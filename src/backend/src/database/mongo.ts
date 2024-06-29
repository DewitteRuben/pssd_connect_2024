import mongoose from "mongoose";

export class MongoDB {
  private static mongoose: typeof mongoose;

  static async connect() {
    this.mongoose = await mongoose.connect("mongodb://127.0.0.1:27017", {
      user: "test",
      pass: "example",
    });
  }

  static async disconnect() {
    if (this.mongoose) {
      this.mongoose.disconnect();
    }
  }
}
