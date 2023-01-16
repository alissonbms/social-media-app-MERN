import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    picturePath: {
      type: String,
      default: "random.png",
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    friends: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
