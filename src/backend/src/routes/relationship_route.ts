import express from "express";
import { taskQueue } from "../database/relationships/tasks";
import {
  CheckForMatchTask,
  DislikeTask,
  LikeTask,
  UnmatchTask,
} from "../database/relationships/tasks/suggestions";
import { ExpressError } from "../errors";
import { getRelationships, successResponse } from "./helpers";
import { Relationship } from "../database/user/types";

const router = express.Router();

router.get("/:uid", async (req, res, next) => {
  const { uid } = req.params as { uid: string };

  try {
    const relationships: Relationship[] = await getRelationships(uid);

    if (!relationships.length) {
      return next(
        new ExpressError({
          code: 500,
          message: "No relationships were found for id " + uid,
        })
      );
    }

    // Since we aggregate we will always get an array as a response, however, we only aggregate for the suggestions_info, which is for 1 user
    // in that case we just take the first result
    return res.status(200).json(successResponse(relationships[0]));
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

router.post("/like/:likedUid", async (req, res, next) => {
  const { uid: likerUid } = req.body as { uid: string };
  const { likedUid } = req.params as { likedUid: string };

  taskQueue.queue(new LikeTask(likerUid, likedUid));
  taskQueue.queue(new CheckForMatchTask(likerUid, likedUid));

  return res.json(successResponse());
});

router.post("/dislike/:dislikedUid", async (req, res, next) => {
  const { uid: disliker } = req.body as { uid: string };
  const { dislikedUid } = req.params as { dislikedUid: string };

  taskQueue.queue(new DislikeTask(disliker, dislikedUid));

  return res.json(successResponse());
});

router.post("/unmatch/:unmatchUid", async (req, res, next) => {
  const { uid } = req.body as { uid: string };
  const { unmatchUid } = req.params as { unmatchUid: string };

  taskQueue.queue(new UnmatchTask(uid, unmatchUid));

  return res.json(successResponse());
});

export default router;
