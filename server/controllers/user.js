import User from "../models/User.js";
import { Types } from "mongoose";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    console.log(`Friends: ${friends}`);

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeFriendshipStatus = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    if (!userId || !friendId) {
      return res.status(400).json({ message: "Some necessary id is missing" });
    }

    if (
      !userId ||
      !friendId ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(friendId)
    ) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    if (user.friends.includes(friendId)) {
      user.friends.filter((id) => id !== friendId);
      friend.friends.filter((id) => id !== userId);
    } else {
      user.friends.push(friendId);
      friend.friends.push(userId);
    }

    const userSaved = await user.save();
    const friendSaved = await friend.save();

    if (!userSaved || !friendSaved) {
      return res
        .status(400)
        .json({ message: "Could not update friendship status" });
    }

    const friends = Promise.all(user.friends.map((id) => User.findById(id)));
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
