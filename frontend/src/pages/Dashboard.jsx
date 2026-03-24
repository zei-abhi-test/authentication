// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [protectedData, setProtectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // No need to manually add token or config — interceptor does it!
        const [userRes, postsRes] = await Promise.all([
          api.get("/users/protected"),
          api.get(`/posts?page=${page}&limit=5`)
        ]);

        setProtectedData(userRes.data);
        setPosts(postsRes.data.posts || []);
        setTotalPages(postsRes.data.totalPages || 1);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        // No need to manually handle 401 here — response interceptor already does it
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading Dashboard...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", marginBottom: "20px" }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: "8px 16px", backgroundColor: "#ff4444", color: "white", border: "none", borderRadius: "4px" }}>
          Logout
        </button>
      </div>

      {protectedData && (
        <div style={{ marginBottom: "30px", padding: "15px", background: "#f9f9f9", borderRadius: "8px" }}>
          <h3>Welcome, {protectedData.user?.name || "Creator"}</h3>
        </div>
      )}

      <section>
        <h2>Your Posts</h2>
        {posts.length > 0 ? (
          posts.map((p) => (
            <div key={p._id} style={{ border: "1px solid #eee", padding: "15px", marginBottom: "10px", borderRadius: "5px" }}>
              <h3>{p.title}</h3>
              <p>{p.content}</p>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;