import Post from "../models/Post.js";
import User from "../models/User.js";
import { Types } from "mongoose";

export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;

    if (!userId || !description) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPictureUrl: user.pictureUrl,
      location: user.location,
      description,
      pictureUrl: req.file === undefined ? null : req.file.firebaseUrl,
    });

    const savedPost = await newPost.save();

    if (!savedPost) {
      return res.status(400).json({ message: "Could not create post" });
    }

    const posts = await Post.find()
      .populate({
        path: "comments",
      })
      .sort({ createdAt: -1 });
    res.status(201).json(posts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "comments",
      })
      .sort({ createdAt: -1 });
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

    const posts = await Post.find({ userId })
      .populate({
        path: "comments",
      })
      .sort({ createdAt: -1 });
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
      !userId ||
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
      const postLikesFiltered = post.likes.filter((id) => id !== userId);
      post.likes = postLikesFiltered;
    } else {
      post.likes.push(userId);
    }

    const savedPost = await post.save();

    if (!savedPost) {
      return res
        .status(400)
        .json({ message: "Could not like or dislike post" });
    }

    const postPopulatedAndSaved = await Post.findById(postId).populate({
      path: "comments",
    });

    res.status(200).json(postPopulatedAndSaved);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.postId;
    const { userId } = req.body;

    if (
      !id ||
      !userId ||
      !Types.ObjectId.isValid(id) ||
      !Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    if (userId !== post.userId) {
      return res.status(409).json({ message: "You are not the author" });
    }

    await Post.findByIdAndDelete(id);

    const posts = await Post.find()
      .populate({
        path: "comments",
      })
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const { postId, userId } = req.params;

    if (
      !postId ||
      !Types.ObjectId.isValid(postId) ||
      !userId ||
      !Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (userId !== post.userId) {
      return res.status(409).json({ message: "You are not the author" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(400).json({ message: "Could not update post" });
    }

    const posts = await Post.find()
      .populate({
        path: "comments",
      })
      .sort({ createdAt: -1 });

    res.status(201).json({ updatedPost, posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
