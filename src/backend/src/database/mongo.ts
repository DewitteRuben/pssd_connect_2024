import mongoose from "mongoose";

const { DATABASE_URL, MONGO_ROOT_USERNAME, MONGO_ROOT_PASSWORD } = process.env;

export class MongoDB {
  private static mongoose: typeof mongoose;

  static async connect() {
    if (!DATABASE_URL) {
      throw Error("DATABASE_CONNECTION_URL environment is missing");
    }

    this.mongoose = await mongoose.connect(DATABASE_URL, {
      user: MONGO_ROOT_USERNAME,
      pass: MONGO_ROOT_PASSWORD,
    });
  }

  static async disconnect() {
    if (this.mongoose) {
      this.mongoose.disconnect();
    }
  }
}
