// frontend/src/pages/CreatePost.jsx
import { useState } from "react";
import api from "../api/api";
import ImageUpload from "../components/ImageUpload";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Image Upload Handler
  const handleUpload = async (formData) => {
    try {
      setUploading(true);
      const res = await api.post("/upload", formData);
      setCoverImageUrl(res.data.imageUrl || res.data.url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setCreating(true);
      const postData = {
        title,
        content,
        coverImage: coverImageUrl || null,
      };

      await api.post("/posts", postData);

      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      setCoverImageUrl("");
      setMessage("Post created successfully! ✅");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Failed to create post");
      toast.error("Post creation failed");
    } finally {
      setCreating(false);
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

        {/* ✅ Correct Place: ImageUpload goes here */}
        <ImageUpload onUpload={handleUpload} />

        <button 
          type="submit" 
          disabled={creating || uploading}
          style={{ 
            padding: "12px", 
            fontSize: "16px", 
            backgroundColor: (creating || uploading) ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: (creating || uploading) ? "not-allowed" : "pointer"
          }}
        >
          {creating ? "Creating Post..." : uploading ? "Uploading..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;