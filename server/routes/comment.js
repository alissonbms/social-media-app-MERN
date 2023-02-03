import express from "express";

import {
  getPostComments,
  createComment,
  likeOrDislikeComment,
  editComment,
  deleteComment,
} from "../controllers/comment.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:postId", verifyToken, getPostComments);
router.post("/:postId/create", verifyToken, createComment);
router.patch("/:commentId/like", verifyToken, likeOrDislikeComment);
router.patch("/edit/:commentId/:userId", verifyToken, editComment);
router.delete("/:commentId/:userId/:postId", verifyToken, deleteComment);

export default router;
