// frontend/src/pages/EditPost.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        setError("Failed to load post");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put(`/posts/${id}`, { title, content });
      alert("Post updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading post...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h2>Edit Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={8}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button 
          type="submit" 
          disabled={saving}
          style={{ padding: "12px 20px", background: "#007bff", color: "white", border: "none" }}
        >
          {saving ? "Saving..." : "Update Post"}
        </button>
        <button 
          type="button" 
          onClick={() => navigate("/dashboard")}
          style={{ marginLeft: "10px", padding: "12px 20px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditPost;