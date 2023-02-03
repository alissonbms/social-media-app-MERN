import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userPictureUrl: String,
    location: String,
    description: String,
    pictureUrl: String,
    likes: { type: [], default: [] },
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
