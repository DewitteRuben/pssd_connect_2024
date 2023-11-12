import express from "express";
import { User, UserModel } from "../database/user/user.js";
import { ExpressError } from "../errors.js";
import { firebaseUserApi } from "../firebase/firebase.js";
import { successResponse } from "./helpers.js";

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

router.post("/", async (req, res, next) => {
  const { uid, ...rest } = req.body as User;

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
    await firebaseUserApi.getUserById(uid).catch((err) => {
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

    const newUser = await UserModel.create({ uid, ...rest });

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
