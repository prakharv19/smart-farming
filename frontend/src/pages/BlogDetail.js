// frontend/src/pages/BlogDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`https://smart-farming-backend-2cxi.onrender.com/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [id]);

  if (!blog) return <p>Loading...</p>;
  return (
    <div style={{ padding: 20 }}>
      <h1>{blog.title}</h1>
      <p><small>By {blog.publisher?.fullName} • {new Date(blog.createdAt).toLocaleDateString()}</small></p>
      {blog.image && <img src={blog.image} alt={blog.title} style={{ maxWidth: '100%', marginBottom: 10 }} />}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} /> {/* content assumed HTML or plain text */}
    </div>
  );
};

export default BlogDetail;
