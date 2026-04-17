// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { socket } from "../services/socket";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ====================== AUTH CHECK + DATA FETCHING ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch user profile
        const userRes = await api.get("https://authentication-3v7a.onrender.com/users/profile");

        // Fetch posts with pagination
        const postsRes = await api.get(`https://authentication-3v7a.onrender.com/posts?page=${page}&limit=5`);

        setUserData(userRes.data);
        setPosts(postsRes.data.posts || postsRes.data || []);
        setTotalPages(postsRes.data.totalPages || 1);
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          // Token expired or invalid
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [page, navigate]);

  // ====================== SOCKET.IO REAL-TIME LISTENING ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("newPost", (data) => {
      toast.success(data.message || "New post created!");

      // Optional: Refresh posts or add new post to list
      // You can enhance this later to automatically add the new post
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("newPost");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // ====================== DELETE POST ======================
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      alert("Post deleted successfully!");

      // Update UI immediately (optimistic update)
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete post. You can only delete your own posts.");
    }
  };

  // ====================== LOGOUT ======================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ====================== LOADING STATE ======================
  if (loading) {
    return <p style={{ padding: "40px", textAlign: "center" }}>Loading Dashboard...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
          paddingBottom: "10px",
        }}
      >
        <h1>Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Welcome Section */}
      {userData && (
        <div
          style={{
            marginBottom: "30px",
            padding: "15px",
            background: "#f0f8ff",
            borderRadius: "8px",
            borderLeft: "5px solid #007bff",
          }}
        >
          <h3>
            Welcome back, {userData.name || userData.user?.name || "User"}!
          </h3>
          <p>Email: {userData.email}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Posts Section */}
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Your Posts</h2>
          <button
            onClick={() => navigate("/create-post")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + Create New Post
          </button>
        </div>

        {posts.length > 0 ? (
          posts.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #eee",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>{p.title}</h3>
              <p>{p.content}</p>

              {/* ✅ Cover Image Display - kept from your extra block */}
              {p.coverImage && (
                <img
                  src={p.coverImage}
                  alt={`Cover image for ${p.title}`}
                  style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "12px",
                  }}
                />
              )}

              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => navigate(`/edit-post/${p._id}`)}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts found. Create your first post!</p>
        )}

        {/* Pagination */}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{ padding: "8px 16px" }}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{ padding: "8px 16px" }}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;