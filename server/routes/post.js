import express from "express";

import {
  deletePost,
  getFeedPosts,
  getUserPosts,
  editPost,
  likeOrDislikePost,
} from "../controllers/post.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.patch("/:postId/like", verifyToken, likeOrDislikePost);
router.patch("/:postId/:userId/edit", verifyToken, editPost);
router.delete("/:postId", verifyToken, deletePost);

export default router;
