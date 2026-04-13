import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"
import { socket } from "../services/socket"

const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    socket.connect()

    socket.on("connect", () => {
      console.log("Connected:", socket.id)
    })

    socket.on("disconnect", () => {
      console.log("Disconnected")
    })

    socket.on("connect_error", (err) => {
      console.log(" Error:", err.message)
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("connect_error")
      socket.disconnect()
    }
  }, [isAuthenticated])

  if (loading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default MainLayout