import express from "express";
import { ExpressError } from "../errors.js";
import FirebaseApp from "../firebase/firebase.js";
import { successResponse } from "./helpers.js";

const router = express.Router();

router.delete("/cancel/:uid", async (req, res, next) => {
  const { uid } = req.params as { uid: string };

  try {
    await FirebaseApp.auth().deleteUser(uid);

    return res.status(200).json(successResponse());
  } catch (e) {
    const err = e as Error;
    return next(new ExpressError({ code: 500, message: err.message }));
  }
});

export default router;
