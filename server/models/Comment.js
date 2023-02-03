import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userPictureUrl: String,
    comment: { type: String, required: true },
    likes: { type: Array, default: [] },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

export default Comment;
