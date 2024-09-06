import express from "express";
import { UserModel } from "../database/user/user.js";
import { User } from "../database/user/types.js";
import { ExpressError } from "../errors.js";
import { getObjectDifferences, successResponse } from "./helpers.js";
import { StreamChatClient } from "../getstream.io/index.js";
import FirebaseApp from "../firebase/firebase.js";
import { RelationshipModel } from "../database/user/relationship.js";
import geolocationApi from "../geolocation.js";
import { suggestionManager } from "../index.js";

const router = express.Router();

router.get("/:uid", async (req, res, next) => {
  const { uid } = req.params as { uid: string };

  try {
    const existingUser = await UserModel.findOne({ uid }).exec();
    if (!existingUser) {
      return next(
        new ExpressError({
          code: 500,
          message: "No user was found with id " + uid,
        })
      );
    }

    return res.status(200).json(successResponse(existingUser.toJSON()));
  } catch (e) {
    const err = e as Error;
    next(
      new ExpressError({
        code: 500,
        message: err.message,
      })
    );
  }
});

router.delete("/:uid", async (req, res, next) => {
  const { uid } = req.params as { uid: string };

  try {
    await Promise.all([
      FirebaseApp.auth().deleteUser(uid),
      UserModel.findOneAndDelete({ uid }).exec(),
      RelationshipModel.findOneAndDelete({ uid }).exec(),
      StreamChatClient.deleteUser(uid),
      StreamChatClient.queryChannels({
        members: { $in: [uid] },
      }).then((channels) => {
        const channelsWithCID = channels.filter((c) => c.cid).map((c) => c.cid);
        if (channelsWithCID.length > 0) {
          StreamChatClient.deleteChannels(channelsWithCID);
        }
      }),
    ]);

    return res.status(200).json(successResponse());
  } catch (e) {
    const err = e as Error;
    return next(new ExpressError({ code: 500, message: err.message }));
  }
});

router.put("/", async (req, res, next) => {
  const { uid, ...rest } = req.body as User;

  try {
    const originalUser = await UserModel.findOne({ uid }).exec();
    const userDiff = getObjectDifferences(rest, originalUser);

    if (userDiff.location) {
      const [longitude, latitude] = rest.location.coordinates;
      const {
        features: [
          {
            properties: { country, city },
          },
        ],
      } = await geolocationApi.reverseLookup(latitude, longitude);

      rest.country = country;
      rest.city = city;
    }

    const userResult = await UserModel.findOneAndUpdate({ uid }, { ...rest }).exec();

    // Update stream chat profile image
    if (userDiff.images && rest?.images.length) {
      await StreamChatClient.partialUpdateUser({
        id: uid,
        set: { image: rest.images[0] },
      });
    }

    // Refresh suggestions if certain fields have updated
    if (userDiff.preferences || userDiff.gender || userDiff.mode) {
      suggestionManager.refresh(uid);
    }

    return res.status(200).json(successResponse(userResult?.toJSON()));
  } catch (e) {
    const err = e as Error;
    return next(new ExpressError({ code: 500, message: err.message }));
  }
});

router.post("/", async (req, res, next) => {
  const { uid, ...rest } = req.body as Omit<User, "chatToken">;

  try {
    const existingUser = await UserModel.findOne({ uid }).exec();
    if (existingUser) {
      return next(
        new ExpressError({
          code: 500,
          message: "the user your tried to add already exists",
        })
      );
    }

    // will throw error if user does not exist
    let firebaseUserExists = true;
    await FirebaseApp.auth()
      .getUser(uid)
      .catch((err) => {
        firebaseUserExists = false;
      });

    if (!firebaseUserExists) {
      return next(
        new ExpressError({
          code: 500,
          message: "A firebase user does not exist for user with id: " + uid,
        })
      );
    }

    // Setup Streamchat user
    const streamChatUser = await StreamChatClient.upsertUser({
      id: uid,
      role: "user",
      name: rest.firstName,
      image: rest.images[0],
    });

    const token = StreamChatClient.createToken(uid);

    // Setup safe location
    if (rest.location) {
      const [longitude, latitude] = rest.location.coordinates;
      const {
        features: [
          {
            properties: { country, city },
          },
        ],
      } = await geolocationApi.reverseLookup(latitude, longitude);

      rest.country = country;
      rest.city = city;
    }

    const newUser = await UserModel.create({ uid, chatToken: token, ...rest });

    return res.status(200).json(successResponse(newUser.toJSON()));
  } catch (e) {
    const err = e as Error;

    next(
      new ExpressError({
        code: 500,
        message: "Failed to create user: " + err.message,
      })
    );
  }
});

export default router;
