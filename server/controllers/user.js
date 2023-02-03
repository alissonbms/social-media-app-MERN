import User from "../models/User.js";
import { Types } from "mongoose";
import bcrypt from "bcrypt";

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

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, pictureUrl }) => {
        return { _id, firstName, lastName, occupation, location, pictureUrl };
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

    if (userId === friendId) {
      return res.status(400).json({ message: "Something went wrong" });
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
      const userFriendsFiltered = user.friends.filter((id) => id !== friendId);
      user.friends = userFriendsFiltered;
      const friendFriendsFiltered = friend.friends.filter(
        (id) => id !== userId
      );
      friend.friends = friendFriendsFiltered;
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

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, pictureUrl }) => {
        return { _id, firstName, lastName, occupation, location, pictureUrl };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const loggedId = req.params.loggedId;

    if (
      !id ||
      !Types.ObjectId.isValid(id) ||
      !loggedId ||
      !Types.ObjectId.isValid(loggedId)
    ) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    if (loggedId !== id) {
      return res.status(409).json({ message: "You are not the owner" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const usersRelationship = await User.find({ friends: id });

    const updateUserRelationship = await Promise.all(
      usersRelationship.map((user) =>
        User.findByIdAndUpdate(
          user._id,
          { $pull: { friends: id } },
          { new: true }
        )
      )
    );

    if (updateUserRelationship) {
      await User.findByIdAndDelete(id);
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const loggedId = req.params.loggedId;

    if (
      !id ||
      !Types.ObjectId.isValid(id) ||
      !loggedId ||
      !Types.ObjectId.isValid(loggedId)
    ) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    if (loggedId !== id) {
      return res.status(409).json({ message: "You are not the owner" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Could not update user" });
    }
    res.status(201).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
