import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { Types } from "mongoose";

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId || !Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { userId, comment } = req.body;

    if (!userId || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = new Comment({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPictureUrl: user.pictureUrl,
      comment,
      post: postId,
    });

    const savedComment = await newComment.save();

    if (!savedComment) {
      return res
        .status(500)
        .json({ message: "Could not create comment, try again later" });
    }

    const postPopulated = await Post.findById(postId).populate({
      path: "comments",
    });

    res.status(201).json(postPopulated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId || !Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const post = await Post.findById(postId).populate({
      path: "comments",
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = post.comments;

    res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const likeOrDislikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (
      !commentId ||
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.likes.includes(userId)) {
      const commentLikesFiltered = comment.likes.filter((id) => id !== userId);
      comment.likes = commentLikesFiltered;
    } else {
      comment.likes.push(userId);
    }

    const savedComment = await comment.save();

    if (!savedComment) {
      return res
        .status(400)
        .json({ message: "Could not like or dislike comment" });
    }

    res.status(200).json(savedComment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const id = req.params.commentId;
    const userId = req.params.userId;
    const postId = req.params.postId;

    if (
      !id ||
      !userId ||
      !postId ||
      !Types.ObjectId.isValid(id) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId)
    ) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const post = await Post.findById(postId);
    const comment = await Comment.findById(id);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    if (!comment) {
      return res.status(400).json({ message: "Comment not found" });
    }

    if (userId !== comment.userId || userId !== post.userId) {
      return res
        .status(409)
        .json({ message: "You are not the comment author or the post owner" });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: "Comment deleted!", post: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const { commentId, userId } = req.params;

    if (
      !commentId ||
      !userId ||
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (userId !== comment.userId) {
      return res.status(409).json({ message: "You are not the author" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(400).json({ message: "Could not update comment" });
    }
    res.status(201).json(updatedComment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
