const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Return only the relative path
  const imageUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    message: "Image uploaded successfully",
    imageUrl: imageUrl,
    filename: req.file.filename,
  });
});

module.exports = router;
