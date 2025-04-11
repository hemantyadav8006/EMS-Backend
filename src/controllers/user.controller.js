import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Op } from "sequelize";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // check validation
  if ([username, email, password].some((e) => e.trim() === "")) {
    return res.status(400).json({
      message: "All fields are required!",
    });
  }

  // check for existing user
  const user = await User.findOne({
    where: {
      [Op.or]: [{ username }, { email }],
    },
  });
  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "User already exist" });
  }

  const profilePhotoLocalPath = req.file?.path;
  if (!profilePhotoLocalPath) {
    return res
      .status(400)
      .json({ success: false, message: "Profile File is required" });
  }

  const profileImage = await uploadOnCloudinary(profilePhotoLocalPath);

  if (!profileImage) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to upload file on server" });
  }

  const newUser = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    profile_photo: profileImage.url,
  });

  const createdUser = await User.findByPk(newUser.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!createdUser) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering user",
    });
  }
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: createdUser,
  });
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // check empty fields
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "username or password can't be null." });
  }

  // check existing user
  const user = await User.findOne({ where: { username: username } });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not Found" });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials!" });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Login Successfull",
    accessToken,
    refreshToken,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      profile_photo: user.profile_photo,
    },
  });
};

export const logoutUser = async (req, res) => {};
