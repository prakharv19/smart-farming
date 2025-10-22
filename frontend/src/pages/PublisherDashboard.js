import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PublisherDashboard.css";

const PublisherDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Blog states
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Farming Tips",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Tab management
  const [activeTab, setActiveTab] = useState("blogs");

  // Complaint states
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintMessage, setComplaintMessage] = useState("");
  const [complaintImage, setComplaintImage] = useState("");
  const [myComplaints, setMyComplaints] = useState([]);

  // Profile states
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    expertise: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // ====================== FETCH BLOGS ======================
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/publisher/my-blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Fetch blogs error:", err);
      alert("Failed to fetch your blogs");
    }
  };

  // ====================== FETCH PROFILE ======================
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/publisher/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile({
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        expertise: res.data.expertise || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.error("Profile fetch failed:", err);
      alert("Failed to fetch profile");
    }
  };

  // ====================== FETCH USER COMPLAINTS ======================
  const fetchMyComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints/my-complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyComplaints(res.data);
    } catch (err) {
      console.error("Fetch complaints error:", err);
      alert("Failed to fetch complaints");
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchProfile();
    fetchMyComplaints();
  }, []);

  // ====================== BLOG HANDLERS ======================
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/publisher/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/publisher", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ title: "", excerpt: "", content: "", category: "Farming Tips", image: "" });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save blog");
    }
  };

  const handleEdit = (b) => {
    setEditingId(b._id);
    setForm({
      title: b.title || "",
      excerpt: b.excerpt || "",
      content: b.content || "",
      category: b.category || "Farming Tips",
      image: b.image || "",
    });
    setActiveTab("create");
  };

  const handleSubmitForApproval = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/publisher/${id}/submit`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Submitted for approval");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/publisher/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete blog");
    }
  };

  // ====================== COMPLAINT HANDLERS ======================
  const handleComplaint = async (e) => {
    e.preventDefault();
    if (!complaintTitle || !complaintMessage) return alert("Title and message are required");
    try {
      await axios.post(
        "http://localhost:5000/api/complaints",
        { title: complaintTitle, message: complaintMessage, image: complaintImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Complaint submitted successfully");
      setComplaintTitle("");
      setComplaintMessage("");
      setComplaintImage("");
      fetchMyComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit complaint");
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/complaints/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Complaint deleted successfully");
      fetchMyComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete complaint");
    }
  };

  // ====================== PROFILE UPDATE ======================
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (profile.newPassword && profile.newPassword !== profile.confirmNewPassword) {
      return alert("New password and Confirm password do not match");
    }
    try {
      const payload = {};
      ["fullName", "email", "phone", "address", "expertise", "currentPassword", "newPassword"].forEach(
        (key) => {
          if (profile[key]) payload[key] = profile[key];
        }
      );
      await axios.put("http://localhost:5000/api/publisher/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Profile updated successfully");
      setProfile((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmNewPassword: "" }));
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Profile update failed");
    }
  };

  // ====================== LOGOUT ======================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="publisher-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{profile.fullName ? `${profile.fullName} Dashboard` : 'Publisher Dashboard'}</h1>
        <div className="header-buttons">
          <button className="home-btn" onClick={() => navigate("/")}>🏠 Home</button>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-buttons">
        <button onClick={() => setActiveTab("blogs")} className={activeTab === "blogs" ? "active" : ""}>My Blogs</button>
        <button onClick={() => setActiveTab("create")} className={activeTab === "create" ? "active" : ""}>Create / Edit Blog</button>
        <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}>Profile</button>
        <button onClick={() => setActiveTab("complaint")} className={activeTab === "complaint" ? "active" : ""}>Complaint</button>
      </div>

      {/* Blogs Section */}
      {activeTab === "blogs" && (
        <div className="blogs-section">
          <h3>📄 Your Blogs</h3>
          {blogs.length === 0 ? <p>No blogs created yet.</p> : blogs.map((b) => (
            <div key={b._id} className={`blog-card ${b.status?.toLowerCase()}`}>
              <h4>{b.title} <span>({b.status || "Draft"})</span></h4>
              <p><strong>Excerpt:</strong> {b.excerpt || "-"}</p>
              <p><strong>Category:</strong> {b.category || "Other"}</p>
              {b.adminComment && <p><strong>Admin Comment:</strong> {b.adminComment}</p>}
              <div className="blog-actions">
                <button onClick={() => handleEdit(b)}>✏️ Edit</button>
                {["Draft", "Rejected"].includes(b.status) && (
                  <button onClick={() => handleSubmitForApproval(b._id)}>🚀 Submit</button>
                )}
                <button onClick={() => handleDeleteBlog(b._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Blog */}
      {activeTab === "create" && (
        <div className="form-section">
          <h3>{editingId ? "✏️ Edit Blog" : "📝 Create New Blog"}</h3>
          <form onSubmit={handleCreate}>
            <label>Title:</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <label>Excerpt:</label>
            <input type="text" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            <label>Category:</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Farming Tips</option>
              <option>Equipment</option>
              <option>Market News</option>
              <option>Finance</option>
              <option>Other</option>
            </select>
            <label>Image URL:</label>
            <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <label>Content:</label>
            <textarea rows="7" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            <button type="submit">{editingId ? "💾 Save Changes" : "📝 Save Draft"}</button>
          </form>
        </div>
      )}

      {/* Profile Section */}
      {activeTab === "profile" && (
        <div className="profile-section">
          <h3>👤 Manage Profile</h3>
          <form onSubmit={handleProfileUpdate}>
            <label>Full Name:</label>
            <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} required />
            <label>Email:</label>
            <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required />
            <label>Phone:</label>
            <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            <label>Address:</label>
            <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
            <label>Expertise:</label>
            <input type="text" value={profile.expertise} onChange={(e) => setProfile({ ...profile, expertise: e.target.value })} />
            <label>Current Password:</label>
            <input type="password" value={profile.currentPassword} onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })} />
            <label>New Password:</label>
            <input type="password" value={profile.newPassword} onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })} />
            <label>Confirm New Password:</label>
            <input type="password" value={profile.confirmNewPassword} onChange={(e) => setProfile({ ...profile, confirmNewPassword: e.target.value })} />
            <button type="submit">💾 Update Profile</button>
          </form>
        </div>
      )}

      {activeTab === "complaint" && (
  <div className="complaint-section">
    <h3>🛠️ Submit a Complaint</h3>
    <form onSubmit={handleComplaint}>
      <label>Title:</label>
      <input type="text" value={complaintTitle} onChange={(e) => setComplaintTitle(e.target.value)} required />
      <label>Message:</label>
      <textarea rows="5" value={complaintMessage} onChange={(e) => setComplaintMessage(e.target.value)} required />
      <label>Image URL (optional):</label>
      <input type="text" value={complaintImage} onChange={(e) => setComplaintImage(e.target.value)} />
      <button type="submit">Submit Complaint</button>
    </form>

    <h4>📋 My Complaints</h4>
    {myComplaints.length === 0 ? (
      <p>No complaints submitted yet.</p>
    ) : (
      <div className="complaint-cards">
        {myComplaints.map((c) => (
          <div key={c._id} className={`complaint-card ${c.status.toLowerCase()}`}>
            <h5>{c.title} <span>({c.status})</span></h5>
            <p>{c.message}</p>
            {c.image && <img src={c.image} alt="complaint" className="complaint-img" />}
            {c.adminComment && <p><strong>Admin Comment:</strong> {c.adminComment}</p>}
            <small>Submitted: {new Date(c.createdAt).toLocaleString()}</small>
            <button className="delete-complaint-btn" onClick={() => handleDeleteComplaint(c._id)}>🗑️ Delete</button>
          </div>
        ))}
      </div>
    )}
  </div>
)}

    </div>
  );
};

export default PublisherDashboard;
