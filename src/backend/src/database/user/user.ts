import mongoose, { MongooseError, model } from "mongoose";
import { RelationshipModel } from "./relationship";
import { User } from "./types.js";

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
  uid: { required: true, type: String },
  email: { required: true, type: String },
  chatToken: { required: true, type: String },
  notificationToken: String,
  completedRegistration: { required: true, type: Boolean },
  registrationInProgress: { required: true, type: Boolean },
  countryCode: { required: true, type: String },
  phoneNumber: { required: true, type: String },
  firstName: { required: true, type: String },
  birthdate: { required: true, type: String },
  gender: { required: true, type: String },
  country: { type: String },
  city: { type: String },
  mode: {
    required: true,
    enum: ["dating", "friends"],
    default: "dating",
    type: String,
  },
  images: { required: true, type: [String] },
  distanceUnit: { type: String, enum: ["km", "mi"], default: "km" },
  preferences: {
    genderPreference: { required: true, type: String },
    showAge: { type: Boolean, default: true },
    ageStart: { type: Number }, // calculated based on entered age
    ageEnd: { type: Number }, // calculated based on entered age
    maxDistance: { type: Number, default: 100 },
    global: { type: Boolean, default: true },
    showDistance: { type: Boolean, default: true },
    showMe: { type: Boolean, default: true },
  },
  profile: {
    school: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    about: { type: String, default: "" },
    company: { type: String, default: "" },
    city: { type: String, default: "" },
  },
  pssd: {
    duration: { required: true, type: String },
    symptoms: [String],
    medications: [String],
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      await RelationshipModel.create({
        uid: this.uid,
        dislikes: [],
        likes: [],
        matches: [],
        suggestions: [],
      });
    } catch (error) {
      next(error as MongooseError);
    }
  }

  next();
});

export const UserModel = model<User>("user", UserSchema);
