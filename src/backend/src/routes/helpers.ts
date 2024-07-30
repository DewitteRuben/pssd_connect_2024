import { RelationshipModel } from "../database/user/relationship";
import { UserModel } from "../database/user/user";

export const EARTH_RADIUS_IN_KM = 6371;

export const successResponse = (json?: any) => {
  return { status: 200, success: true, result: json ?? {} };
};

export const getRelationships = async (uid: string) => {
  const user = await UserModel.findOne({ uid }).exec();
  if (!user) {
    throw new Error("User not found");
  }

  const { latitude, longitude } = user.location.coords;

  return RelationshipModel.aggregate([
    {
      $match: {
        uid,
      },
    },
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
              "location.coords": 1,
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
      $addFields: {
        suggestions_info: {
          $map: {
            input: "$suggestions_info",
            as: "suggestion",
            in: {
              $mergeObjects: [
                "$$suggestion",
                {
                  distance: {
                    $let: {
                      vars: {
                        lat1: latitude,
                        lon1: longitude,
                        lat2: "$$suggestion.location.coords.latitude",
                        lon2: "$$suggestion.location.coords.longitude",
                      },
                      in: {
                        $multiply: [
                          EARTH_RADIUS_IN_KM, // Earth's radius in kilometers
                          {
                            $acos: {
                              $add: [
                                {
                                  $multiply: [
                                    { $sin: { $degreesToRadians: "$$lat1" } },
                                    { $sin: { $degreesToRadians: "$$lat2" } },
                                  ],
                                },
                                {
                                  $multiply: [
                                    { $cos: { $degreesToRadians: "$$lat1" } },
                                    { $cos: { $degreesToRadians: "$$lat2" } },
                                    {
                                      $cos: {
                                        $subtract: [
                                          { $degreesToRadians: "$$lon2" },
                                          { $degreesToRadians: "$$lon1" },
                                        ],
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        "suggestions_info.location": 0,
      },
    },
  ]).exec();
};
