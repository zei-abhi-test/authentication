// frontend/src/components/ImageUpload.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Change this URL to your backend endpoint
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      setUploadSuccess(true);
      
      // Optional: Clear after successful upload
      // setTimeout(() => {
      //   setSelectedFile(null);
      //   setPreview(null);
      //   setUploadSuccess(false);
      // }, 3000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    setUploadSuccess(false);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Image</h2>

      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-8 text-center cursor-pointer transition-colors mb-4"
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg object-contain"
            />
            <button
              onClick={(e) => { e.stopPropagation(); removeImage(); }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              📸
            </div>
            <p className="text-lg font-medium text-gray-700">Drop image here or click to upload</p>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      {uploadSuccess && (
        <p className="text-green-500 text-sm text-center mb-4">
          ✅ Image uploaded successfully!
        </p>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <span className="animate-spin">⟳</span>
              Uploading...
            </>
          ) : (
            'Upload Image'
          )}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;