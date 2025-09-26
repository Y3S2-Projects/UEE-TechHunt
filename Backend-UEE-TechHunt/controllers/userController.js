import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

// Get current user
export const getMe = async (req, res) => {
  res.json(req.user);
};

// Update onboarding (skills, goals)
export const updateOnboarding = async (req, res) => {
  try {
    const { skills, goals } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills, goals },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
