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
require("dotenv").config()
const jwt = require("jsonwebtoken")

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

router.post('/login', async (req, res) => {
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
    console.log("Token generated:", token)
    localStorage.setItem("token", token)
    res.header("Authorization", `Bearer ${token}`)
    res.status(200).json({ message: "Login successful", token })

    res.json({ message: "Login successful", token })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})


router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
} )

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    ).select('-password')
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.delete('/users/:id', async (req, res) => {

  try {
    const user = await User
      .findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ message: "User deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})  

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user })
})
