// frontend/src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState("blogs");
  const [adminName, setAdminName] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);

  const [blogFilter, setBlogFilter] = useState("All");
  const [complaintFilter, setComplaintFilter] = useState("All");
  const [borrowFilter, setBorrowFilter] = useState("All");

  // ===== Profile =====
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // ===== Profile functions =====
  const fetchProfile = async () => {
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/admin/profile", { headers });
      setProfile({ ...res.data, currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setAdminName(res.data.fullName);
    } catch {
      alert("Failed to fetch profile");
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    if (profile.newPassword && profile.newPassword !== profile.confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }
    try {
      await axios.put("https://smart-farming-backend-2cxi.onrender.com/api/admin/profile", profile, { headers });
      alert("Profile updated successfully");
      fetchProfile();
      setAdminName(profile.fullName);
    } catch {
      alert("Failed to update profile");
    }
  };

  // ===== Fetch functions =====
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/admin/blogs", { headers });
      setBlogs(res.data);
    } catch {
      alert("Failed to fetch blogs");
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/admin/complaints", { headers });
      setComplaints(res.data);
    } catch {
      alert("Failed to fetch complaints");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/admin/users", { headers });
      setUsers(res.data);
    } catch {
      alert("Failed to fetch users");
    }
  };

  const fetchEquipment = async () => {
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/admin/equipments", { headers });
      setEquipment(res.data);
    } catch {
      alert("Failed to fetch equipment");
    }
  };

  const fetchBorrowRequests = async () => {
    try {
      const res = await axios.get("https://smart-farming-backend-2cxi.onrender.com/api/admin/borrow-requests", { headers });
      setBorrowRequests(res.data);
    } catch {
      alert("Failed to fetch borrow requests");
    }
  };

  useEffect(() => {
    fetchProfile();
    if (activeTab === "blogs") fetchBlogs();
    else if (activeTab === "complaints") fetchComplaints();
    else if (activeTab === "users") fetchUsers();
    else if (activeTab === "equipment") fetchEquipment();
    else if (activeTab === "borrow") fetchBorrowRequests();
  }, [activeTab]);

  // ===== Blog actions =====
  const approveBlog = async (id) => {
    try {
      await axios.put(`https://smart-farming-backend-2cxi.onrender.com/api/admin/blog/${id}/approve`, { comment: "Approved by admin" }, { headers });
      fetchBlogs();
    } catch {
      alert("Failed to approve blog");
    }
  };

  const rejectBlog = async (id) => {
    const comment = prompt("Reason for rejection:") || "Rejected by admin";
    try {
      await axios.put(`https://smart-farming-backend-2cxi.onrender.com/api/admin/blog/${id}/reject`, { comment }, { headers });
      fetchBlogs();
    } catch {
      alert("Failed to reject blog");
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await axios.delete(`https://smart-farming-backend-2cxi.onrender.com/api/admin/blog/${id}`, { headers });
      fetchBlogs();
    } catch {
      alert("Failed to delete blog");
    }
  };

  // ===== Complaint actions =====
  const updateComplaintStatus = async (id, status) => {
    const adminComment = prompt(`Enter ${status} comment:`) || "";
    try {
      await axios.put(`https://smart-farming-backend-2cxi.onrender.com/api/admin/complaints/${id}`, { status, adminComment }, { headers });
      fetchComplaints();
    } catch {
      alert("Failed to update complaint");
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await axios.delete(`https://smart-farming-backend-2cxi.onrender.com/api/admin/complaints/${id}`, { headers });
      fetchComplaints();
    } catch {
      alert("Failed to delete complaint");
    }
  };

  // ===== User actions =====
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`https://smart-farming-backend-2cxi.onrender.com/api/admin/users/${id}`, { headers });
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  // ===== Equipment actions =====
  const deleteEquipment = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;
    try {
      await axios.delete(`https://smart-farming-backend-2cxi.onrender.com/api/admin/equipments/${id}`, { headers });
      fetchEquipment();
    } catch {
      alert("Failed to delete equipment");
    }
  };

  // ===== Borrow Request actions =====
  const updateBorrowRequestStatus = async (id, status) => {
    const adminComment = prompt(`Enter comment for ${status}:`) || "";
    try {
      await axios.put(`https://smart-farming-backend-2cxi.onrender.com/api/admin/borrow-requests/${id}`, { status, adminComment }, { headers });
      fetchBorrowRequests();
    } catch {
      alert("Failed to update borrow request status");
    }
  };

  const deleteBorrowRequest = async (id) => {
    if (!window.confirm("Delete this borrow request?")) return;
    try {
      await axios.delete(`https://smart-farming-backend-2cxi.onrender.com/api/admin/borrow-requests/${id}`, { headers });
      fetchBorrowRequests();
    } catch {
      alert("Failed to delete borrow request");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    window.location.href = "/login";
  };

  // ===== Filtered data =====
  const filteredBlogs = blogFilter === "All" ? blogs : blogs.filter((b) => b.status === blogFilter);
  const filteredComplaints = complaintFilter === "All" ? complaints : complaints.filter((c) => c.status === complaintFilter);
  const filteredBorrow = borrowFilter === "All" ? borrowRequests : borrowRequests.filter((r) => r.status === borrowFilter);

  return (
    <div className="admin-dashboard">
      {/* Top Navigation */}
      <div className="admin-topbar">
        <h2>{adminName ? `${adminName} - Admin Dashboard` : "Admin Dashboard"}</h2>
        <div className="nav-buttons">
          <button onClick={() => setActiveTab("blogs")}>📰 Blogs</button>
          <button onClick={() => setActiveTab("complaints")}>📢 Complaints</button>
          <button onClick={() => setActiveTab("users")}>👥 Users</button>
          <button onClick={() => setActiveTab("equipment")}>⚙️ Equipment</button>
          <button onClick={() => setActiveTab("borrow")}>📄 Borrow Requests</button>
          <button onClick={() => setActiveTab("profile")}>👤 Profile</button>
        </div>
        <button className="logout" onClick={logout}>🚪 Logout</button>
      </div>

      <div className="admin-content">
        {/* BLOGS */}
        {activeTab === "blogs" && (
          <>
            <h2>📰 Blog Management</h2>
            <div className="filter-bar">
              <label>Filter:</label>
              <select value={blogFilter} onChange={(e) => setBlogFilter(e.target.value)}>
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            {filteredBlogs.map((b) => (
              <div key={b._id} className={`blog-card ${b.status.toLowerCase()}`}>
                {b.image && <img src={b.image} alt={b.title} className="blog-image" />}
                <div className="blog-content">
                  <h3>{b.title}</h3>
                  <p><strong>Status:</strong> {b.status}</p>
                  <p><strong>Publisher:</strong> {b.publisher?.fullName}</p>
                  <p><strong>Category:</strong> {b.category}</p>
                  <p className="content">{b.content}</p>
                  <p><strong>Admin Comment:</strong> {b.adminComment || "—"}</p>
                  <div className="action-buttons">
                    {b.status === "Pending" && (
                      <>
                        <button className="approve" onClick={() => approveBlog(b._id)}>✅ Approve</button>
                        <button className="reject" onClick={() => rejectBlog(b._id)}>❌ Reject</button>
                      </>
                    )}
                    <button className="delete" onClick={() => deleteBlog(b._id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* COMPLAINTS */}
        {activeTab === "complaints" && (
          <>
            <h2>📢 Complaint Management</h2>
            <div className="filter-bar">
              <label>Filter:</label>
              <select value={complaintFilter} onChange={(e) => setComplaintFilter(e.target.value)}>
                <option>All</option>
                <option>Pending</option>
                <option>Resolved</option>
                <option>Rejected</option>
              </select>
            </div>
            {filteredComplaints.map((c) => (
              <div key={c._id} className="blog-card">
                <div className="blog-content">
                  <h3>{c.title}</h3>
                  <p><strong>Status:</strong> {c.status}</p>
                  <p><strong>By:</strong> {c.user?.fullName} ({c.user?.role})</p>
                  <p className="content">{c.message}</p>
                  {c.image && <img src={c.image} alt="complaint" className="blog-image" />}
                  <div className="action-buttons">
                    {c.status === "Pending" && (
                      <>
                        <button className="approve" onClick={() => updateComplaintStatus(c._id, "Resolved")}>✅ Resolve</button>
                        <button className="reject" onClick={() => updateComplaintStatus(c._id, "Rejected")}>❌ Reject</button>
                      </>
                    )}
                    <button className="delete" onClick={() => deleteComplaint(c._id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <h2>👥 User Management</h2>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.address}</td>
                      <td>{u.phone}</td>
                      <td><button className="delete" onClick={() => deleteUser(u._id)}>🗑️ Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* EQUIPMENT */}
        {activeTab === "equipment" && (
          <>
            <h2>⚙️ Equipment Management</h2>
            {equipment.length === 0 ? (
              <p>No equipment found.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Rent (₹/day)</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((e) => (
                    <tr key={e._id}>
                      <td>{e.name}</td>
                      <td>{e.category}</td>
                      <td>{e.description}</td>
                      <td>₹{e.pricePerDay}</td>
                      <td>{e.location}</td>
                      <td>{e.status}</td>
                      <td>
                        {e.images?.length > 0 ? <img src={e.images[0]} alt={e.name} className="table-image" /> : "No Image"}
                      </td>
                      <td><button className="delete" onClick={() => deleteEquipment(e._id)}>🗑️ Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* BORROW REQUESTS */}
{activeTab === "borrow" && (
  <>
    <h2>📄 Borrow Request Management</h2>

    {/* Filter */}
    <div className="filter-bar">
      <label>Filter:</label>
      <select value={borrowFilter} onChange={(e) => setBorrowFilter(e.target.value)}>
        <option>All</option>
        <option>Pending</option>
        <option>Approved</option>
        <option>Rejected</option>
        <option>Completed</option>
      </select>
    </div>

    {/* Borrow Requests Table */}
    {filteredBorrow.length === 0 ? (
      <p>No borrow requests found.</p>
    ) : (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Equipment</th>
            <th>Borrower</th>
            <th>Lender</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBorrow.map((r) => (
            <tr key={r._id}>
              <td>{r.equipment?.name || "Equipment"}</td>
              <td>{r.borrower?.fullName || "Borrower"}</td>
              <td>{r.lender?.fullName || "Lender"}</td>
              <td>{r.status}</td>
              <td>{new Date(r.startDate).toLocaleDateString()}</td>
              <td>{new Date(r.endDate).toLocaleDateString()}</td>
              <td className="action-buttons">
                {r.status === "Pending" && (
                  <>
                    
                    
                  </>
                )}
                <button className="delete" onClick={() => deleteBorrowRequest(r._id)}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </>
)}



        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>Manage Profile</h2>
            <label>Full Name</label>
            <input name="fullName" value={profile.fullName || ''} onChange={handleProfileChange} placeholder="Full Name" />
            <label>Email</label>
            <input name="email" value={profile.email || ''} disabled />
            <label>Phone</label>
            <input name="phone" value={profile.phone || ''} onChange={handleProfileChange} placeholder="Phone" />
            <label>Address</label>
            <input name="address" value={profile.address || ''} onChange={handleProfileChange} placeholder="Address" />

            <h3>Change Password</h3>
            <label>Current Password</label>
            <input type="password" name="currentPassword" value={profile.currentPassword || ''} onChange={handleProfileChange} placeholder="Current Password" />
            <label>New Password</label>
            <input type="password" name="newPassword" value={profile.newPassword || ''} onChange={handleProfileChange} placeholder="New Password" />
            <label>Confirm New Password</label>
            <input type="password" name="confirmNewPassword" value={profile.confirmNewPassword || ''} onChange={handleProfileChange} placeholder="Confirm New Password" />
            <button onClick={updateProfile}>Update Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
