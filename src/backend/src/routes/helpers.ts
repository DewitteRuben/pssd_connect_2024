import _ from "lodash";
import { EventEmitter } from "node:events";
import { RelationshipModel } from "../database/user/relationship";
import { UserModel } from "../database/user/user";

export class SocketUserStore extends EventEmitter {
  public socketIdUserIdMap: Record<string, string>;
  constructor() {
    super();
    this.socketIdUserIdMap = {};
  }

  add(socketId: string, uid: string) {
    this.socketIdUserIdMap[socketId] = uid;

    this.emit("change", { socketId, uid, action: "add" });
  }

  remove(socketId: string) {
    const uid = this.socketIdUserIdMap[socketId];

    delete this.socketIdUserIdMap[socketId];

    this.emit("change", { socketId, uid, action: "remove" });
  }

  getUserID(socketID: string) {
    return this.socketIdUserIdMap[socketID] ?? null;
  }

  getSocketID(uid: string) {
    for (const socketID in this.socketIdUserIdMap) {
      const userID = this.socketIdUserIdMap[socketID];
      if (userID === uid) {
        return socketID;
      }
    }

    return null;
  }

  removeByUserID(uid: string) {
    let matchingSocketID;
    for (const socketID in this.socketIdUserIdMap) {
      const userID = this.socketIdUserIdMap[socketID];
      if (userID === uid) {
        matchingSocketID = socketID;
      }
    }

    if (matchingSocketID) {
      delete this.socketIdUserIdMap[matchingSocketID];
    }
  }
}

export const EARTH_RADIUS_IN_KM = 6371;

export const successResponse = (json?: any) => {
  return { status: 200, success: true, result: json ?? {} };
};

export function getObjectDifferences<T>(obj1: T, obj2: T): any {
  function differences<T>(obj1: any, obj2: any): any {
    return _.transform<any, any>(
      obj1,
      (result: any, value, key) => {
        if (!_.isEqual(value, obj2[key])) {
          if (_.isObject(value) && _.isObject(obj2[key])) {
            const diff = differences(value, obj2[key]);
            if (!_.isEmpty(diff)) {
              result[key] = diff;
            }
          } else {
            result[key] = value;
          }
        }
      },
      {} as any
    );
  }

  return differences(obj1, obj2);
}

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
