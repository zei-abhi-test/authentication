// frontend/src/pages/CreatePost.jsx
import { useState } from "react";
import api from "../api/api";
import ImageUpload from "../components/ImageUpload";
import axios from "axios";   // Kept from your second version

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ====================== FORM SUBMIT (Text Post) ======================
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

  // ====================== IMAGE UPLOAD HANDLER (axios version kept) ======================
  const handleUpload = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Uploaded:", res.data);
      // You can add success message or store the image URL here if needed
    } catch (err) {
      console.error(err);
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

        {/* Image Upload Component - kept as per your request */}
        <ImageUpload onUpload={handleUpload} />

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