import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likeOrDislikePost,
} from "../controllers/post.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.patch("/:postId/like", verifyToken, likeOrDislikePost);

export default router;
