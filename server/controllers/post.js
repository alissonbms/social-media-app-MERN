import Post from "../models/Post.js";
import User from "../models/User.js";
import { Types } from "mongoose";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;

    if (!userId || !description || !picturePath) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      location: user.location,
      description,
      picturePath,
    });

    const savedPost = await newPost.save();

    if (!savedPost) {
      return res.status(400).json({ message: "Could not create post" });
    }

    const posts = await Post.find();
    res.status(201).json(posts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeOrDislikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (
      !postId ||
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    const savedPost = await post.save();

    if (!savedPost) {
      return res
        .status(400)
        .json({ message: "Could not like or dislike post" });
    }

    res.status(200).json(savedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
