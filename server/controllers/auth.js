import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Utilities
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, location, occupation } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !location ||
      !occupation
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailAlreadyRegistered = await User.findOne({ email: email });

    if (emailAlreadyRegistered) {
      return res
        .status(400)
        .json({ message: "Email already in use you can not use it" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      pictureUrl:
        req.file === undefined
          ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          : req.file.firebaseUrl,

      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      return res
        .status(500)
        .json({ message: "Could not create user, try again later" });
    }

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { password, email, firstName } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch || user.firstName !== firstName) {
      return res.status(400).json({ message: "Wrong data" });
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
