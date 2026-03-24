import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Track error messages from the server
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing again
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ensure your backend expects "email" and "password" keys
      const res = await api.post("/users/login", formData);

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      // This pulls the specific error message from your backend (if provided)
      const serverMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(serverMessage);
      console.error("Login Error Details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "20px auto" }}>
      <h2>Login</h2>
      
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={formData.email} // Controlled component
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password} // Controlled component
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;