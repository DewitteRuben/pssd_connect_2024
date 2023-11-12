import mongoose from "mongoose";

class MongoDB {
  private static mongoose: typeof mongoose;

  static async create() {
    this.mongoose = await mongoose.connect("mongodb://127.0.0.1:27017/test");
  }
}
