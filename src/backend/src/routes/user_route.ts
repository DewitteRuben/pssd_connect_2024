import express from "express";
import { UserModel } from "../database/user/user.js";
import { User } from "../database/user/types.js";
import { ExpressError } from "../errors.js";
import { successResponse } from "./helpers.js";
import { StreamChatClient } from "../getstream.io/index.js";
import FirebaseApp from "../firebase/firebase.js";

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
    await FirebaseApp.auth().deleteUser(uid);
    const obj = await UserModel.findOneAndDelete({ uid }).exec();
    await StreamChatClient.deleteUser(uid);

    return res.status(200).json(successResponse(obj?.toJSON()));
  } catch (e) {
    const err = e as Error;
    return next(new ExpressError({ code: 500, message: err.message }));
  }
});

router.put("/", async (req, res, next) => {
  const { uid, ...rest } = req.body as User;

  try {
    const obj = await UserModel.findOneAndUpdate({ uid }, { ...rest }).exec();
    return res.status(200).json(successResponse(obj?.toJSON()));
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

    // TODO: ensure this doesn't cause issues with people guessing Firebase UIDs
    if (!firebaseUserExists) {
      return next(
        new ExpressError({
          code: 500,
          message: "A firebase user does not exist for user with id: " + uid,
        })
      );
    }

    //const streamChatUser = await StreamChatClient.upsertUser({ id: uid, role: "admin" });
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiVTF1MnF4cGlDYVBaMGpMSkNnZTVNZnlMbVhCMyJ9.Zpo-ZZ2NMB3BQFRi89vKO8HVFFtvGV209Mz5v7B9-N0" ??
      StreamChatClient.createToken(uid);

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
