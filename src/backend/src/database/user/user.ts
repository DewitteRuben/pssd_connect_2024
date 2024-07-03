import mongoose, { MongooseError, model } from "mongoose";

const Schema = mongoose.Schema;

export type UserProfile = {
  school: string;
  jobTitle: string;
  about: string;
  company: string;
  city: string;
};

export type UserPSSDInfo = {
  duration: string;
  symptoms: string[];
  medications: string[];
};

export type UserPreferences = {
  genderPreference: GenderPreference;
  showAge: boolean;
  ageStart: number;
  ageEnd: number;
  maxDistance: number;
  global: boolean;
  showDistance: boolean;
  showMe: boolean;
};

export type UserLocation = {
  coords: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
};

export type Gender = "man" | "woman" | "other";
export type GenderPreference = "men" | "women" | "everyone";

export type Relationship = {
  uid: string;
  suggestions: string[];
  likes: string[];
  dislikes: string[];
  matches: string[];
};

export type User = {
  uid: string;
  idToken: string;
  chatToken: string;
  email: string;
  completedRegistration: boolean;
  registrationInProgress: boolean;
  countryCode: string;
  phoneNumber: string;
  firstName: string;
  birthdate: string | Date;
  gender: Gender;
  mode: string;
  profile: UserProfile;
  preferences: UserPreferences;
  pssd: UserPSSDInfo;
  images: string[];
  location: UserLocation;
};

const UserSchema = new Schema<User>({
  uid: { required: true, type: String },
  email: { required: true, type: String },
  chatToken: { required: true, type: String },
  completedRegistration: { required: true, type: Boolean },
  registrationInProgress: { required: true, type: Boolean },
  countryCode: { required: true, type: String },
  phoneNumber: { required: true, type: String },
  firstName: { required: true, type: String },
  birthdate: { required: true, type: String },
  gender: { required: true, type: String },
  mode: { required: true, type: String },
  images: { required: true, type: [String] },
  preferences: {
    genderPreference: { required: true, type: String },
    showAge: { type: Boolean, default: true },
    ageStart: Number, // calculated based on entered age
    ageEnd: Number, // calculated based on entered age
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
    coords: {
      latitude: Number,
      longitude: Number,
    },
    timestamp: Number,
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

const RelationshipSchema = new Schema<Relationship>({
  uid: { required: true, type: String },
  dislikes: { required: true, type: [String], ref: "user" },
  matches: { required: true, type: [String], ref: "user" },
  likes: { required: true, type: [String], ref: "user" },
  suggestions: { required: true, type: [String], ref: "user" },
});

export const RelationshipModel = model<Relationship>("relationships", RelationshipSchema);
