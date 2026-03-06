// const User = require('../Model/UserSchema')
// const bcrypt = require('bcryptjs')

// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" })
//     }

//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword
//     })

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email
//     })
//   } catch (error) {
//     res.status(500).json({ message: "Server error" })
//   }
// }

// exports.getAllUsers = async (req, res) => {
//   const users = await User.find().select('-password')
//   res.json(users)
// }

// exports.getUserById = async (req, res) => {
//   const user = await User.findById(req.params.id).select('-password')
//   if (!user) return res.status(404).json({ message: "User not found" })
//   res.json(user)
// }

// exports.updateUser = async (req, res) => {
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     { name: req.body.name },
//     { new: true }
//   ).select('-password')

//   if (!user) return res.status(404).json({ message: "User not found" })
//   res.json(user)
// }

// exports.deleteUser = async (req, res) => {
//   const user = await User.findByIdAndDelete(req.params.id)
//   if (!user) return res.status(404).json({ message: "User not found" })
//   res.json({ message: "User deleted" })
// }

const User = require("../Model/UserSchema")
const bcrypt = require("bcrypt")

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

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
      user
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}