import { EARTH_RADIUS_IN_KM } from "../../routes/helpers.js";
import { RelationshipModel } from "../user/relationship.js";
import { UserModel } from "../user/user.js";
import differenceInYears from "date-fns/differenceInYears/index.js";

export const findSuggestionsForUser = async (uid: string) => {
  const user = await UserModel.findOne({ uid }).exec();

  if (!user) throw new Error("user with id " + uid + " was not found");

  const {
    mode,
    gender,
    birthdate,
    location: {
      coords: { latitude, longitude },
    },
    preferences: { genderPreference, ageEnd, ageStart, maxDistance, global },
  } = user;

  let requestedGender;
  let otherGenderPreference;

  switch (genderPreference) {
    case "men":
      requestedGender = "man";
      break;
    case "women":
      requestedGender = "woman";
      break;
    // case "everyone":
    //   requestedGender = { $in: ["man", "woman"] };
    //   break;
  }

  switch (gender) {
    case "man":
      otherGenderPreference = "men";
      break;
    case "woman":
      otherGenderPreference = "women";
      break;
    // case "other":
    //   otherGenderPreference = "everyone";
    //   break;
  }

  const currentDate = new Date();

  const minBirthdate = new Date(
    currentDate.getFullYear() - ageStart,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const maxBirthdate = new Date(
    currentDate.getFullYear() - ageEnd,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const age = differenceInYears(currentDate, new Date(birthdate));

  const radiusInKilometers = maxDistance;
  const radiusInRadians = radiusInKilometers / EARTH_RADIUS_IN_KM; // Earth's radius in kilometers

  const relationships = await RelationshipModel.findOne({ uid }).lean().exec();

  if (global) {
    return UserModel.find({
      mode,
      gender: requestedGender,
      "preferences.genderPreference": otherGenderPreference,
      "preferences.ageStart": { $lte: age },
      "preferences.ageEnd": { $gte: age },
      $expr: {
        $and: [
          // e.g. gte 1970 and lte 2005
          { $gte: [{ $toDate: "$birthdate" }, maxBirthdate] },
          { $lte: [{ $toDate: "$birthdate" }, minBirthdate] },
          { $not: { $in: ["$uid", relationships?.likes] } },
          { $not: { $in: ["$uid", relationships?.dislikes] } },
          { $not: { $in: ["$uid", relationships?.matches] } },
        ],
      },
      $or: [
        { "preferences.global": true },
        {
          "location.coords": {
            $geoWithin: {
              $centerSphere: [[latitude, longitude], radiusInRadians],
            },
          },
        },
      ],
    }).exec();
  }

  return UserModel.find({
    mode,
    gender: requestedGender,
    "preferences.genderPreference": otherGenderPreference,
    "preferences.ageStart": { $lte: age },
    "preferences.ageEnd": { $gte: age },
    $expr: {
      $and: [
        { $gte: [{ $toDate: "$birthdate" }, maxBirthdate] },
        { $lt: [{ $toDate: "$birthdate" }, minBirthdate] },
        { $not: { $in: ["$uid", relationships?.likes] } },
        { $not: { $in: ["$uid", relationships?.dislikes] } },
        { $not: { $in: ["$uid", relationships?.matches] } },
      ],
    },
    "location.coords": {
      $geoWithin: {
        $centerSphere: [[latitude, longitude], radiusInRadians],
      },
    },
  }).exec();
};
