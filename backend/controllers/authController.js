const User = require("../models/User");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Helper function to convert old localhost URLs to relative paths
const normalizeImageUrl = (url) => {
  if (url && url.includes("localhost")) {
    // Extract just the filename from the URL
    const filename = url.split("/uploads/")[1];
    return `/uploads/${filename}`;
  }
  return url;
};

// Register User
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  // Validation: Check for missing fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create the user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    // Normalize image URL before sending response
    const userResponse = user.toObject();
    userResponse.profileImageUrl = normalizeImageUrl(
      userResponse.profileImageUrl
    );

    res.status(201).json({
      id: user._id,
      user: userResponse,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering User", error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Convert old localhost URLs to relative paths
    const userResponse = user.toObject();
    userResponse.profileImageUrl = normalizeImageUrl(
      userResponse.profileImageUrl
    );

    res.status(200).json({
      id: user._id,
      user: userResponse,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// User Info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert old localhost URLs to relative paths
    const userResponse = user.toObject();
    userResponse.profileImageUrl = normalizeImageUrl(
      userResponse.profileImageUrl
    );

    res.status(200).json(userResponse);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; //From protect middleware
    const { fullName, email, profileImageUrl, currentPassword, newPassword } =
      req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Update basic info
    if (fullName) user.fullName = fullName;

    if (email) {
      //Check if email already exists (for another user)
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    //Update profile image
    if (typeof profileImageUrl !== "undefined") {
      // If the user had a previous image and it's changing or being deleted...
      if (
        user.profileImageUrl &&
        user.profileImageUrl !== profileImageUrl &&
        user.profileImageUrl.trim() !== ""
      ) {
        // Remove leading slash if present for compatibility with path.join
        let oldImageRelativePath = user.profileImageUrl.startsWith("/")
          ? user.profileImageUrl.substring(1)
          : user.profileImageUrl;
        let fullOldImagePath = path.join(__dirname, "..", oldImageRelativePath);

        // Only delete if not default/seed image
        if (fs.existsSync(fullOldImagePath)) {
          try {
            fs.unlinkSync(fullOldImagePath);
          } catch (err) {
            console.error("Error deleting old image:", err);
          }
        }
      }
      // Set to the new image, or an empty string if deleted
      user.profileImageUrl = profileImageUrl;
    }

    //update password if provided
    if (currentPassword && newPassword) {
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      user.password = newPassword; // Will be hashed by pre-save hook
    }

    await user.save();

    const userResponse = user.toObject();
    userResponse.profileImageUrl = normalizeImageUrl(
      userResponse.profileImageUrl
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: userResponse._id,
        fullName: userResponse.fullName,
        email: userResponse.email,
        profileImageUrl: userResponse.profileImageUrl,
      },
    });
  } catch (error) {
    console.error("Upadte profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
