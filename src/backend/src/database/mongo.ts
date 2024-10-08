import mongoose from "mongoose";
import { getEnvironmentVariables } from "../utils";

const {
  DATABASE_URL,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_INITDB_DATABASE,
  ENVIRONMENT,
} = getEnvironmentVariables([
  "DATABASE_URL",
  "MONGO_USERNAME",
  "MONGO_PASSWORD",
  "MONGO_INITDB_DATABASE",
  "ENVIRONMENT",
]);

export class MongoDB {
  private static mongoose: typeof mongoose;

  static async connect() {
    this.mongoose = await mongoose.connect(DATABASE_URL, {
      user: MONGO_USERNAME,
      dbName: MONGO_INITDB_DATABASE,
      authSource: ENVIRONMENT === "DEV" ? "admin" : MONGO_INITDB_DATABASE,
      pass: MONGO_PASSWORD,
    });
  }

  static async disconnect() {
    if (this.mongoose) {
      this.mongoose.disconnect();
    }
  }
}
