import { Link } from "react-router-dom"
import ConnectionTest from "../components/ConnectionTest"

function Home() {
  return (
    <div>
      <h1>Creator Platform</h1>
      <p>Welcome to the Creator Platform where users can share and manage their content.</p>

      <h3>Navigate</h3>

      <nav>
        <ul>
          <li>
            <Link to="/login">Go to Login</Link>
          </li>

          <li>
            <Link to="/register">Go to Register</Link>
          </li>

          <li>
            <Link to="/dashboard">Go to Dashboard</Link>
          </li>
          <li>
            <ConnectionTest />
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Home