const User = require("../Model/UserSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Register User
exports.registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }
}


// Login User
exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.status(200).json({
      message: "Login successful",
      token
    })

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }
}


// Get Logged In User Profile
exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }
}


// Get All Users
exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select("-password")

    res.json(users)

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }
}


// Get User By ID
exports.getUserById = async (req, res) => {
  try {

    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }
}


// Update User
exports.updateUser = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }
}


// Delete User
exports.deleteUser = async (req, res) => {
  try {

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User deleted successfully" })

  } catch (error) {

    res.status(500).json({ message: "Server error" })

  }
}