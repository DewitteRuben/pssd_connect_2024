import mongoose, { Types, model } from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export type User = {
  userid: Types.ObjectId;
  email: string;
  countryCode: string;
  phoneNumber: string;
  firstName: string;
  birthdate: string;
  gender: string;
  mode: string;
  prefGender: string;
  pssd_duration: string;
  images: string[];
  location: {
    coords: {
      accuracy: number;
      altitude: number;
      altitudeAccuracy: number;
      heading: number;
      latitude: number;
      longitude: number;
      speed: number;
    };
    timestamp: number;
  };
};

const UserSchema = new Schema<User>({
  userid: ObjectId,
  email: String,
  countryCode: String,
  phoneNumber: String,
  firstName: String,
  birthdate: String,
  gender: String,
  mode: String,
  prefGender: String,
  pssd_duration: String,
  images: [String],
  location: {
    coords: {
      accuracy: Number,
      altitude: Number,
      altitudeAccuracy: Number,
      heading: Number,
      latitude: Number,
      longitude: Number,
      speed: Number,
    },
    timestamp: Number,
  },
});

export const UserModel = model<User>("user", UserSchema);
