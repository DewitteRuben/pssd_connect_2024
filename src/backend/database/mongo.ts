import mongoose, { Mongoose } from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  email: {
    type: "String",
  },
  countryCode: {
    type: "String",
  },
  phoneNumber: {
    type: "String",
  },
  firstName: {
    type: "String",
  },
  birthdate: {
    type: "Date",
  },
  gender: {
    type: "String",
  },
  mode: {
    type: "String",
  },
  prefGender: {
    type: "String",
  },
  pssd_duration: {
    type: "String",
  },
  images: {
    type: ["String"],
  },
  location: {
    coords: {
      accuracy: {
        type: "Number",
      },
      altitude: {
        type: "Mixed",
      },
      altitudeAccuracy: {
        type: "Mixed",
      },
      heading: {
        type: "Number",
      },
      latitude: {
        type: "Number",
      },
      longitude: {
        type: "Number",
      },
      speed: {
        type: "Number",
      },
    },
    timestamp: {
      type: "Number",
    },
  },
});

class MongoDB {
  private static mongoose: typeof mongoose;

  static async create() {
    this.mongoose = await mongoose.connect("mongodb://127.0.0.1:27017/test");
  }
}
