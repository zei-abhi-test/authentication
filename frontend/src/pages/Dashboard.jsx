import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for Logout
import api from "../api/api";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // If no token exists, don't even try to fetch; just redirect
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await api.get("/api/users/protected", {
          headers: {
            // Important: "Bearer " must have a space after it
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        // If the token is expired or invalid (401), kick them to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p>Loading protected data...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: "5px 15px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <p>This is the creator dashboard.</p>

      {data ? (
        <div style={{ background: "#f4f4f4", padding: "15px", borderRadius: "8px" }}>
          <h3>Protected Data from Server:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
};

export default Dashboard;