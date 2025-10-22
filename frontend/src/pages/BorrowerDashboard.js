// frontend/src/pages/BorrowerDashboard.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BorrowerDashboard.css";

const BorrowerDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ---------- HOME AND LOGOUT ----------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goHome = () => {
    navigate("/");
  };

  // Tabs
  const [activeTab, setActiveTab] = useState("equipment");

  // Equipment
  const [equipmentList, setEquipmentList] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Requests
  const [myRequests, setMyRequests] = useState([]);

  // Profile
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    farmSize: "",
    cropType: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Complaint
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintMessage, setComplaintMessage] = useState("");
  const [complaintImage, setComplaintImage] = useState("");
  const [myComplaints, setMyComplaints] = useState([]);

  // ========== Fetch Functions ==========
  const fetchEquipment = useCallback(async () => {
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/equipment");
      setEquipmentList(res.data);
      setFilteredEquipment(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch equipment");
    }
  }, []);

  const fetchMyRequests = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/borrow/my-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch your requests");
    }
  }, [token]);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile({
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        farmSize: res.data.farmSize || "",
        cropType: res.data.cropType || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch profile");
    }
  }, [token]);

  const fetchMyComplaints = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/complaints/my-complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyComplaints(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch complaints");
    }
  }, [token]);

  // ========== Effects ==========
  useEffect(() => {
    fetchEquipment();
    fetchMyRequests();
    fetchProfile();
    fetchMyComplaints();
  }, [fetchEquipment, fetchMyRequests, fetchProfile, fetchMyComplaints]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const location = locationFilter.toLowerCase();
    const filtered = equipmentList.filter(
      (eq) =>
        (eq.name?.toLowerCase().includes(term) ||
          eq.category?.toLowerCase().includes(term) ||
          eq.description?.toLowerCase().includes(term)) &&
        eq.location?.toLowerCase().includes(location)
    );
    setFilteredEquipment(filtered);
  }, [searchTerm, locationFilter, equipmentList]);

  // ========== Handlers ==========
  const borrowEquipment = async (equipmentId) => {
    const startDate = prompt("Enter start date (YYYY-MM-DD):");
    const endDate = prompt("Enter end date (YYYY-MM-DD):");
    if (!startDate || !endDate) return alert("Start and end dates are required");
    try {
      await axios.post(
        "https://smart-farming-backend-2cxi.onrender.com/api/borrow",
        { equipmentId, startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Borrow request sent!");
      fetchMyRequests();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send borrow request");
    }
  };

  const cancelRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    try {
      await axios.delete(`https://smart-farming-backend-2cxi.onrender.com/api/borrow/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Request canceled successfully!");
      fetchMyRequests();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel request");
    }
  };

  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const updateProfile = async () => {
    // Strong password validation
    if (profile.newPassword) {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(profile.newPassword)) {
        return alert(
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
        );
      }
      if (profile.newPassword !== profile.confirmPassword) {
        return alert("New password and confirm password do not match.");
      }
    }

    try {
      const payload = { ...profile };
      await axios.put("https://smart-farming-backend-2cxi.onrender.com/api/auth/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
      fetchProfile();
      setProfile((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintTitle || !complaintMessage)
      return alert("Title and message are required");
    try {
      await axios.post(
        "https://smart-farming-backend-2cxi.onrender.com/api/complaints",
        { title: complaintTitle, message: complaintMessage, image: complaintImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Complaint submitted successfully!");
      setComplaintTitle("");
      setComplaintMessage("");
      setComplaintImage("");
      fetchMyComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit complaint");
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await axios.delete(`https://smart-farming-backend-2cxi.onrender.com/api/complaints/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Complaint deleted!");
      fetchMyComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete complaint");
    }
  };

  // ========== RENDER ==========
  return (
    <div className="dashboard-container">
      {/* Top Buttons */}
      <div className="top-buttons">
        <button onClick={goHome}>Home</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h1 className="dashboard-title"> 
    {profile.fullName ? `${profile.fullName} Dashboard` : 'Lender Dashboard'}
  </h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab("equipment")}
          className={activeTab === "equipment" ? "active" : ""}
        >
          Equipment
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={activeTab === "requests" ? "active" : ""}
        >
          My Requests
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={activeTab === "profile" ? "active" : ""}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("complaint")}
          className={activeTab === "complaint" ? "active" : ""}
        >
          Complaint
        </button>
      </div>

      {/* EQUIPMENT TAB */}
      {activeTab === "equipment" && (
        <div className="equipment-list">
          <h3>Available Equipment</h3>
          <input
            type="text"
            placeholder="Search by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />

          {filteredEquipment.length === 0 ? (
            <p>No equipment found.</p>
          ) : (
            <div className="equipment-card-container">
              {filteredEquipment.map((eq) => (
                <div key={eq._id} className="equipment-card">
                  {eq.images?.length > 0 && <img src={eq.images[0]} alt={eq.name} />}
                  <h4>{eq.name}</h4>
                  <p>
                    <strong>Category:</strong> {eq.category || "N/A"}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{eq.pricePerDay || 0}/day
                  </p>
                  <p>
                    <strong>Condition:</strong> {eq.condition || "N/A"}
                  </p>
                  <p>
                    <strong>Location:</strong> {eq.location || "N/A"}
                  </p>
                  <p>{eq.description || "No description"}</p>
                  <p>
                    <strong>Lender:</strong> {eq.lender?.fullName || "N/A"}
                  </p>
                  <button onClick={() => borrowEquipment(eq._id)}>Borrow</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REQUESTS TAB */}
      {activeTab === "requests" && (
        <div className="requests-list">
          <h3>My Borrow Requests</h3>

          {myRequests.length === 0 ? (
            <p>No borrow requests.</p>
          ) : (
            <div className="request-card-container">
              {myRequests.map((req) => (
                <div key={req._id} className="request-card">
                  <h4>{req.equipment?.name || req.equipment?.equipmentName || "N/A"}</h4>
                  <p>
                    <strong>Status:</strong> {req.status}
                  </p>
                  <p>
                    <strong>Lender:</strong> {req.lender?.fullName || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {req.lender?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Duration:</strong>{" "}
                    {new Date(req.startDate).toLocaleDateString()} →{" "}
                    {new Date(req.endDate).toLocaleDateString()}
                  </p>
                  {req.status === "Pending" && (
                    <button onClick={() => cancelRequest(req._id)}>Cancel Request</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="profile-section">
          <h3>Manage Profile</h3>
          <label>Full Name</label>
          <input name="fullName" value={profile.fullName} onChange={handleProfileChange} />
          <label>Email</label>
          <input name="email" value={profile.email} disabled />
          <label>Phone</label>
          <input name="phone" value={profile.phone} onChange={handleProfileChange} />
          <label>Address</label>
          <input name="address" value={profile.address} onChange={handleProfileChange} />
          <label>Farm Size</label>
          <input name="farmSize" value={profile.farmSize} onChange={handleProfileChange} />
          <label>Crop Type</label>
          <input name="cropType" value={profile.cropType} onChange={handleProfileChange} />
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={profile.currentPassword}
            onChange={handleProfileChange}
          />
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={profile.newPassword}
            onChange={handleProfileChange}
          />
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleProfileChange}
          />
          <small>
            Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.
          </small>
          <button onClick={updateProfile}>Update Profile</button>
        </div>
      )}

      {/* COMPLAINT TAB */}
      {activeTab === "complaint" && (
        <div className="complaint-section">
          <form onSubmit={submitComplaint} className="complaint-form">
            <label>Title:</label>
            <input
              type="text"
              value={complaintTitle}
              onChange={(e) => setComplaintTitle(e.target.value)}
              required
            />

            <label>Message ( with Lender or Publisher email (must) ):</label>
            <textarea
              rows="5"
              value={complaintMessage}
              onChange={(e) => setComplaintMessage(e.target.value)}
              required
            />

            <label>Image URL (optional):</label>
            <input
              type="text"
              value={complaintImage}
              onChange={(e) => setComplaintImage(e.target.value)}
            />

            <button type="submit">Submit Complaint</button>
          </form>

          <h3>My Complaints</h3>
          {myComplaints.length === 0 ? (
            <p>No complaints submitted yet.</p>
          ) : (
            <div className="complaint-list">
              {myComplaints.map((c) => (
                <div key={c._id} className={`complaint-card ${c.status.toLowerCase()}`}>
                  <h4>
                    {c.title} <span>({c.status})</span>
                  </h4>
                  <p>{c.message}</p>
                  {c.image && <img src={c.image} alt="complaint" />}
                  {c.adminComment && (
                    <p>
                      <strong>Admin Comment:</strong> {c.adminComment}
                    </p>
                  )}
                  <small>Submitted: {new Date(c.createdAt).toLocaleString()}</small>
                  {c.status === "Pending" && (
                    <button className="delete-btn" onClick={() => deleteComplaint(c._id)}>
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowerDashboard;
