import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./PublicHome.css";

const PublicHome = () => {
  const [view, setView] = useState(""); // "" | "equipment" | "blogs"
  const [equipment, setEquipment] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [searchEquipment, setSearchEquipment] = useState("");
  const [searchBlog, setSearchBlog] = useState("");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/public/equipment");
        setEquipment(res.data);
      } catch (err) { console.error(err); }
    };
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/public/blogs");
        setBlogs(res.data);
      } catch (err) { console.error(err); }
    };
    fetchEquipment();
    fetchBlogs();
  }, []);

  const filteredEquipment = equipment.filter(eq =>
    eq.name?.toLowerCase().includes(searchEquipment.toLowerCase()) ||
    eq.category?.toLowerCase().includes(searchEquipment.toLowerCase()) ||
    eq.description?.toLowerCase().includes(searchEquipment.toLowerCase()) ||
    eq.location?.toLowerCase().includes(searchEquipment.toLowerCase())
  );

  const filteredBlogs = blogs.filter(b =>
    b.title?.toLowerCase().includes(searchBlog.toLowerCase()) ||
    b.excerpt?.toLowerCase().includes(searchBlog.toLowerCase()) ||
    b.content?.toLowerCase().includes(searchBlog.toLowerCase())
  );

  return (
    <div className="public-home">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>🌾 Smart Farming System</h1>
          <p>Your gateway to equipment & farming knowledge</p>
          <Link to="/login" className="btn login-btn">Login</Link>
        </div>
      </header>

      {/* Explore Sections */}
      {view === "" && (
        <div className="explore-section">
          <div className="explore-card" onClick={() => setView("equipment")}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWBMX8Kj1Z0QS7rt3oFGUpa7K0zsjELOCu_g&s" alt="Equipment" />
            <h2>Available Equipment</h2>
            <p>See all equipment ready for rent</p>
            <button className="btn">Explore</button>
          </div>
          <div className="explore-card" onClick={() => setView("blogs")}>
            <img src="data:image/jpeg;base64,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" alt="Blogs" />
            <h2>Blog Posts</h2>
            <p>Read farming tips, market news, and more</p>
            <button className="btn">Explore</button>
          </div>
        </div>
      )}

      {/* Equipment Section */}
      {view === "equipment" && (
        <section className="section-grid">
          <h1>Available Equipment</h1>
          <h2>For Borrowing Equipment Please Login</h2>
          <input
            type="text"
            placeholder="Search by name, category, description, location..."
            value={searchEquipment}
            onChange={(e) => setSearchEquipment(e.target.value)}
            className="search-bar"
          />
          {filteredEquipment.length === 0 ? <p>No equipment found.</p> :
            <div className="grid">
              {filteredEquipment.map(eq => (
                <div key={eq._id} className="card">
                  {eq.images?.[0] && <img src={eq.images[0]} alt={eq.name} />}
                  <h3>{eq.name}</h3>
                  <p><strong>Category:</strong> {eq.category}</p>
                  <p><strong>Price:</strong> ₹{eq.pricePerDay}/day</p>
                  <p><strong>Description:</strong> {eq.description}</p>
                  <p><strong>Location:</strong> {eq.location}</p>
                </div>
              ))}
            </div>
          }
          <button className="btn back-btn" onClick={() => setView("")}>⬅ Back</button>
        </section>
      )}

      {/* Blogs Section */}
      {view === "blogs" && (
        <section className="section-grid">
          <h2>All Blog Posts</h2>
          <input
            type="text"
            placeholder="Search blogs by title, excerpt, content..."
            value={searchBlog}
            onChange={(e) => setSearchBlog(e.target.value)}
            className="search-bar"
          />
          {filteredBlogs.length === 0 ? <p>No blogs found.</p> :
            <div className="grid">
              {filteredBlogs.map(b => (
                <div key={b._id} className="card">
                  {b.image && <img src={b.image} alt={b.title} />}
                  <h3><Link to={`/blogs/${b._id}`}>{b.title}</Link></h3>
                  <p>{b.excerpt || b.content.slice(0, 250) + "..."}</p>
                </div>
              ))}
            </div>
          }
          <button className="btn back-btn" onClick={() => setView("")}>⬅ Back</button>
        </section>
      )}
    </div>
  );
};

export default PublicHome;
