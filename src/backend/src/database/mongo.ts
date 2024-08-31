import mongoose from "mongoose";

const {
  DATABASE_URL,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_INITDB_DATABASE,
  ENVIRONMENT,
} = process.env;

export class MongoDB {
  private static mongoose: typeof mongoose;

  static async connect() {
    if (!DATABASE_URL) {
      throw Error("DATABASE_CONNECTION_URL environment is missing");
    }
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
