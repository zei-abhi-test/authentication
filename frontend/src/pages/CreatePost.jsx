// frontend/src/pages/CreatePost.jsx
import { useState } from "react";
import api from "../api/api";        // Make sure path is correct

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/posts", { title, content });

      setMessage("Post created successfully! ✅");
      setTitle("");
      setContent("");

      console.log("Post created:", response.data); // For debugging
    } catch (err) {
      console.error("Create post error:", err);
      setError(err.response?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h2>Create New Post</h2>

      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
          required
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          style={{ padding: "10px", fontSize: "16px" }}
          required
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: "12px", 
            fontSize: "16px", 
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Creating Post..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;