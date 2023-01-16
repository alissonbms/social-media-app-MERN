import express from "express";
import {
  getPostComments,
  createComment,
  likeOrDislikeComment,
} from "../controllers/comment.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:postId", verifyToken, getPostComments);
router.post("/:postId/create", verifyToken, createComment);
router.patch("/:commentId/like", verifyToken, likeOrDislikeComment);

export default router;
