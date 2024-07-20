import { Schema, model } from "mongoose";
import { Relationship } from "./types.js";

const RelationshipSchema = new Schema<Relationship>({
    uid: { required: true, type: String },
    dislikes: { required: true, type: [String], ref: "user" },
    matches: { required: true, type: [String], ref: "user" },
    likes: { required: true, type: [String], ref: "user" },
    suggestions: { required: true, type: [String], ref: "user" },
  });
  
  export const RelationshipModel = model<Relationship>("relationships", RelationshipSchema);
  