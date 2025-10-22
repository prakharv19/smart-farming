// frontend/src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>🚜 Smart Farming System</h1>
      <p>Welcome to the Smart Farming Platform — Empowering Farmers with Technology!</p>

      <div className="home-buttons">
        <button onClick={() => navigate("/blogs")} className="home-btn blog-btn">
          📰 View Approved Blogs
        </button>
        <button onClick={() => navigate("/equipment")} className="home-btn equip-btn">
          ⚙️ View Available Equipment
        </button>
      </div>
    </div>
  );
};

export default Home;
