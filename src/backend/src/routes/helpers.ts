import { RelationshipModel } from "../database/user/relationship";

export const successResponse = (json?: any) => {
  return { status: 200, success: true, result: json ?? {} };
};

export const getRelationships = (uid: string) => {
  return RelationshipModel.aggregate([
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
              "location.country": 1,
              "location.city": 1,
              images: 1,
              profile: 1,
              pssd: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        suggestions_info: {
          $filter: {
            input: "$suggestions_info",
            as: "suggestion",
            cond: {
              $and: [
                { $not: { $in: ["$$suggestion.uid", "$likes"] } },
                { $not: { $in: ["$$suggestion.uid", "$dislikes"] } },
                { $not: { $in: ["$$suggestion.uid", "$matches"] } },
              ],
            },
          },
        },
      },
    },
    {
      $match: {
        uid,
      },
    },
  ]).exec();
};
