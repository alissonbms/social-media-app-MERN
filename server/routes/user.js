import express from "express";
import {
  getUser,
  getUserFriends,
  changeFriendshipStatus,
} from "../controllers/user.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/:userId/:friendId", verifyToken, changeFriendshipStatus);

export default router;
