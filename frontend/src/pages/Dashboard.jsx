// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ← Add this import
import api from "../api/api";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [protectedData, setProtectedData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();     // ← Add this line

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          api.get("/users/protected"),
          api.get(`/posts?page=${page}&limit=5`)
        ]);

        setProtectedData(userRes.data);
        setPosts(postsRes.data.posts || []);
        setTotalPages(postsRes.data.totalPages || 1);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  // ==================== ADD handleDelete HERE ====================
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);
      alert("Post deleted successfully!");

      // Refresh the posts list after deletion
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete post. You can only delete your own posts.");
    }
  };
  // ==============================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading Dashboard...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", marginBottom: "20px" }}>
        <h1>Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: "8px 16px", backgroundColor: "#ff4444", color: "white", border: "none", borderRadius: "4px" }}
        >
          Logout
        </button>
      </div>

      {/* Welcome Section */}
      {protectedData && (
        <div style={{ marginBottom: "30px", padding: "15px", background: "#f9f9f9", borderRadius: "8px" }}>
          <h3>Welcome, {protectedData.user?.name || "Creator"}</h3>
          <p>This is your protected dashboard area.</p>
        </div>
      )}

      {/* Posts Section */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Your Posts</h2>
          <button 
            onClick={() => navigate("/create-post")}
            style={{ padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px" }}
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
                backgroundColor: "#fafafa"
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>{p.title}</h3>
              <p>{p.content}</p>

              {/* Edit & Delete Buttons */}
              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => navigate(`/edit-post/${p._id}`)}
                  style={{ 
                    padding: "6px 14px", 
                    backgroundColor: "#007bff", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "4px",
                    cursor: "pointer"
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
                    cursor: "pointer"
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
        <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            style={{ padding: "8px 16px" }}
          >
            Prev
          </button>
          
          <span>Page {page} of {totalPages}</span>

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