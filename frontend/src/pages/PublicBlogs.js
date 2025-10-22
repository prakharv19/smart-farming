// frontend/src/pages/PublicBlogs.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PublicBlogs.css";

const PublicBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/public/blogs"); // only approved blogs
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch approved blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="public-blogs section-grid">
      <h2>📰 Approved Blog Posts</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid">
        {filteredBlogs.length === 0 ? (
          <p>No approved blogs found.</p>
        ) : (
          filteredBlogs.map((blog) => (
            <div key={blog._id} className="card">
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="blog-img"
                />
              )}
              <h3>{blog.title}</h3>
              <p>
                <strong>By:</strong> {blog.publisher?.fullName}
              </p>

              {/* ✅ Automatically add line gaps every 3–4 lines */}
              <p className="content">
                {blog.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicBlogs;
