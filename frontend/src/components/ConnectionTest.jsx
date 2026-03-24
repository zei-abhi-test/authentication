// frontend/src/components/ConnectionTest.jsx
import { useState } from "react";
import api from "../api/api";

function ConnectionTest() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const testConnection = async () => {
    try {
      const res = await api.get("/test");        // ← changed
      setMessage(res.data.message);
      setError("");
    } catch (error) {
      setError("Connection failed");
      setMessage(error.response?.data?.message || "Connection failed");  // ← changed
    }
  };

  return (
    <div> 
      <h2>Backend Connection Test</h2>
      <button onClick={testConnection}>Test Backend Connection</button>
      {message && <p>{message}</p>}
      {error && <p style={{color: "red"}}>{error}</p>}
    </div>
  );
}

export default ConnectionTest;