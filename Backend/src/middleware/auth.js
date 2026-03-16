const Jwt = require("jsonwebtoken")
require("dotenv").config()
import { useContext } from "react"
import { AuthContext } from "../../../frontend/src/context/authContext"


const authMiddleware = (req, res, next) => {
  const tok=req.headers.authorization
  const token = tok && tok.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: "No token provided" })
  }
  Jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" })
    }
    req.user = user
    console.log("Authenticated user:", user)
    next()
  })
}

export const useAuth = () => {
    return useContext(AuthContext)
}

module.exports = authMiddleware