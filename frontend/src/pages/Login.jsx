import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"

const Login = () => {

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = () => {
    login("test-token")
    navigate("/dashboard")
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Test Login</button>
    </div>
  )
}

export default Login