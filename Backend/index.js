require("dotenv").config()

const express = require("express")
const cors = require("cors")

const connectDB = require("./src/Config/db")

const userRoutes = require("./src/routes/userRoutes")
// const dataRoutes = require("./src/Router/data")

const authMiddleware = require("./src/middleware/auth")

const app = express()

// ---------- Middleware ----------

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ---------- Health Check ----------

app.get("/", (req, res) => {
  res.json({
    status: "Server Running",
    message: "MERN Backend Connected"
  })
})

// ---------- Routes ----------

// Auth Routes
app.use("/api/users", userRoutes)

// // CRUD Routes (Protected)
// app.use("/api/data", authMiddleware, dataRoutes)

// Protected Test Route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user
  })
})


// ---------- 404 Handler ----------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  })
})

// ---------- Global Error Handler ----------

app.use((err, req, res, next) => {
  console.error(err)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  })
})

// ---------- Server Start ----------

const startServer = async () => {
  try {

    await connectDB()

    console.log("MongoDB Connected Successfully")

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

  } catch (error) {

    console.error("Database connection failed:", error)
    process.exit(1)

  }
}

startServer()