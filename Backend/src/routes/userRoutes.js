const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/auth")

const {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/userController")

router.post("/register", registerUser)
router.post("/login", loginUser)

router.get("/profile", authMiddleware, getProfile)

router.get("/", getAllUsers)
router.get("/:id", getUserById)

router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user })
})

module.exports = router