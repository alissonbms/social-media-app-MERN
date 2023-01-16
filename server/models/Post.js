import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userPicturePath: String,
    location: String,
    description: String,
    picturePath: String,
    likes: { type: Array, default: [] },
    // comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

const Post = model("Post", postSchema);
export default Post;
