import express from "express";

import {
  getUser,
  getUserFriends,
  changeFriendshipStatus,
  deleteUser,
  editUser,
} from "../controllers/user.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch(
  "/changeFriend/:userId/:friendId",
  verifyToken,
  changeFriendshipStatus
);
router.patch("/edit/:userId/:loggedId", verifyToken, editUser);
router.delete("/:userId/:loggedId", verifyToken, deleteUser);

export default router;
