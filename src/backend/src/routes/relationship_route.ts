import express from "express";
import { taskQueue } from "../database/relationships/tasks";
import { SuggestionTask } from "../database/relationships/tasks/suggestions";
import { RelationshipModel } from "../database/user/relationship";
import { ExpressError } from "../errors";
import { successResponse } from "./helpers";
import { Relationship } from "../database/user/types";

const router = express.Router();

router.get("/:uid", async (req, res, next) => {
  const { uid } = req.params as { uid: string };

  try {
    const relationships: Relationship[] = await RelationshipModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "suggestions",
          foreignField: "uid",
          as: "suggestions_info",
          pipeline: [
            {
              $project: {
                uid: 1,
                firstName: 1,
                birthdate: 1,
                _id: 0,
                images: 1,
                profile: 1,
                pssd: 1,
              },
            },
          ],
        },
      },
      {
        $match: {
          uid,
          suggestions_info: { $ne: [] },
        },
      },
    ]).exec();

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

router.post("/suggestion", async (req, res, next) => {
  const { uid } = req.body as { uid: string };

  console.log({ uid });
  taskQueue.queue(new SuggestionTask(uid));
});

export default router;
