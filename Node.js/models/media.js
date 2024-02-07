import { model, Schema } from "mongoose";

const MediaSchema = new Schema(
  {
    titre: String,
    description: String,
    user:String
  },
  { timestamps: true }
);



export default model("Media", MediaSchema);