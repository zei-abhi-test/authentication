const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  logoutUser,
} = require("../controllers/userController");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to your dashboard",
    user: req.user,
  });
});

router.get("/profile", authMiddleware, getProfile);

router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.post("/logout", authMiddleware, logoutUser);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

module.exports = router;