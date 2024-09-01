import { FilterQuery } from "mongoose";
import { calculateDistance, EARTH_RADIUS_IN_KM } from "../../routes/helpers.js";
import { RelationshipModel } from "../user/relationship.js";
import { UserModel } from "../user/user.js";
import { Message } from "firebase-admin/messaging";
import { User } from "../user/types.js";
import { differenceInYears } from "date-fns";

export const findSuggestionsForUser = async (uid: string) => {
  const user = await UserModel.findOne({ uid }).exec();

  if (!user) throw new Error("user with id " + uid + " was not found");

  const {
    mode,
    gender,
    birthdate,
    location: {
      coordinates: [longitude, latitude],
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
    case "everyone":
      requestedGender = { $in: ["man", "woman"] };
      break;
  }

  switch (gender) {
    case "man":
      otherGenderPreference = { $in: ["men", "everyone"] };
      break;
    case "woman":
      otherGenderPreference = { $in: ["women", "everyone"] };
      break;
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

  const suggestionQuery: FilterQuery<User> = {
    uid: { $ne: uid },
    mode,
    gender: requestedGender,
    "preferences.genderPreference": otherGenderPreference,
    "preferences.ageStart": { $lte: age },
    "preferences.ageEnd": { $gte: age },
    $expr: {
      $and: [
        { $gte: [{ $toDate: "$birthdate" }, maxBirthdate] },
        { $lte: [{ $toDate: "$birthdate" }, minBirthdate] },
        { $not: { $in: ["$uid", relationships?.likes] } },
        { $not: { $in: ["$uid", relationships?.dislikes] } },
        { $not: { $in: ["$uid", relationships?.matches] } },
      ],
    },
  };

  if (!global) {
    suggestionQuery.location = {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radiusInRadians],
      },
    };
  }

  const suggestions = await UserModel.find(suggestionQuery).exec();

  // My distance away from the other person, should be lower or equal to their max distance (if they're not global)
  return suggestions.filter((suggestion) => {
    if (suggestion.preferences.global) return true;

    const distance = calculateDistance(
      longitude,
      latitude,
      suggestion.location.coordinates[0],
      suggestion.location.coordinates[1]
    );

    return distance <= suggestion.preferences.maxDistance;
  });
};

export const createMatchMessage = (
  user1: Pick<User, "notificationToken" | "firstName">,
  user2: Pick<User, "notificationToken" | "firstName">
) => {
  const message: Message = {
    token: user1.notificationToken,
    notification: {
      title: "You got a new match!",
      body: `${user2.firstName} likes you.`,
    },
  };

  return message;
};
