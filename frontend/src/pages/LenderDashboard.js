import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LenderDashboard.css';

const LenderDashboard = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [equipmentList, setEquipmentList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState({});
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintMessage, setComplaintMessage] = useState('');
  const [complaintImage, setComplaintImage] = useState('');
  const [myComplaints, setMyComplaints] = useState([]);
  const [editEquipment, setEditEquipment] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // ---------- HOME AND LOGOUT ----------
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goHome = () => {
    navigate('/');
  };

  // ---------- FETCH FUNCTIONS ----------
  const fetchEquipment = useCallback(async () => {
    try {
      const res = await axios.get('https://smart-farming-backend-2cxi.onrender.com/api/equipment/my-equipment', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipmentList(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch equipment');
    }
  }, [token]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get('https://smart-farming-backend-2cxi.onrender.com/api/borrow/incoming', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch requests');
    }
  }, [token]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get('https://smart-farming-backend-2cxi.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch profile');
    }
  }, [token]);

  const fetchMyComplaints = useCallback(async () => {
    try {
      const res = await axios.get('https://smart-farming-backend-2cxi.onrender.com/api/complaints/my-complaints', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyComplaints(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch complaints');
    }
  }, [token]);

  // ---------- EQUIPMENT MANAGEMENT ----------
  const handleEquipmentChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pricePerDay') {
      if (value === '' || /^[0-9]*$/.test(value)) {
        setEditEquipment({ ...editEquipment, [name]: value });
      }
    } else {
      setEditEquipment({ ...editEquipment, [name]: value });
    }
  };

  const saveEquipment = async () => {
    if (!editEquipment.name || !editEquipment.category || !editEquipment.pricePerDay) {
      return alert('Please fill in Name, Category, and Price fields.');
    }

    try {
      const payload = {
        ...editEquipment,
        images: editEquipment.image ? [editEquipment.image] : editEquipment.images || [],
      };

      if (editEquipment._id) {
        await axios.put(`https://smart-farming-backend-2cxi.onrender.com/api/equipment/${editEquipment._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Equipment updated successfully!');
      } else {
        await axios.post('https://smart-farming-backend-2cxi.onrender.com/api/equipment', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Equipment added successfully!');
      }

      setEditEquipment(null);
      fetchEquipment();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save equipment');
    }
  };

  const deleteEquipment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;
    try {
      await axios.delete(`https://smart-farming-backend-2cxi.onrender.com/api/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Equipment deleted successfully!');
      fetchEquipment();
    } catch (err) {
      console.error(err);
      alert('Failed to delete equipment');
    }
  };

  // ---------- REQUEST HANDLING ----------
  const handleRequestAction = async (id, status) => {
    try {
      await axios.put(
        `https://smart-farming-backend-2cxi.onrender.com/api/borrow/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Request ${status.toLowerCase()}!`);
      fetchRequests();
      fetchEquipment();
    } catch (err) {
      console.error(err);
      alert('Failed to update request');
    }
  };

  // ---------- PROFILE ----------
  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const updateProfile = async () => {
    try {
      if (profile.newPassword || profile.confirmNewPassword) {
        if (!profile.currentPassword) return alert("Enter your current password");

        if (profile.newPassword !== profile.confirmNewPassword)
          return alert("New passwords do not match");

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!passwordRegex.test(profile.newPassword))
          return alert("New password must contain at least 1 lowercase, 1 uppercase, 1 digit, 1 special character and be at least 8 characters long");
      }

      const payload = {
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
      };

      if (profile.currentPassword && profile.newPassword) {
        payload.currentPassword = profile.currentPassword;
        payload.newPassword = profile.newPassword;
      }

      await axios.put('https://smart-farming-backend-2cxi.onrender.com/api/auth/me', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Profile updated successfully!');
      setProfile({
        ...profile,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // ---------- COMPLAINT ----------
  const submitComplaint = async () => {
    if (!complaintTitle || !complaintMessage) return alert('Enter title and message');
    try {
      await axios.post(
        'https://smart-farming-backend-2cxi.onrender.com/api/complaints',
        { title: complaintTitle, message: complaintMessage, image: complaintImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Complaint submitted successfully!');
      setComplaintTitle('');
      setComplaintMessage('');
      setComplaintImage('');
      fetchMyComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await axios.delete(`https://smart-farming-backend-2cxi.onrender.com/api/complaints/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Complaint deleted successfully!');
      fetchMyComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete complaint');
    }
  };

  useEffect(() => {
    fetchEquipment();
    fetchRequests();
    fetchProfile();
    fetchMyComplaints();
  }, [fetchEquipment, fetchRequests, fetchProfile, fetchMyComplaints]);

  // ---------- RENDER ----------
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

      <div className="tabs">
        <button className={activeTab === 'equipment' ? 'active' : ''} onClick={() => setActiveTab('equipment')}>My Equipment</button>
        <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>Borrow Requests</button>
        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Manage Profile</button>
        <button className={activeTab === 'complaint' ? 'active' : ''} onClick={() => setActiveTab('complaint')}>Complaint</button>
      </div>

      {/* EQUIPMENT TAB */}
      {activeTab === 'equipment' && (
        <div className="tab-content">
          <h2>My Equipment</h2>
          <button
            className="add-btn"
            onClick={() =>
              setEditEquipment({
                name: '',
                category: '',
                pricePerDay: '',
                description: '',
                condition: '',
                location: '',
                image: '',
                status: 'Available',
              })
            }
          >
            + Add Equipment
          </button>

          {equipmentList.length === 0 ? (
            <p>No equipment added yet.</p>
          ) : (
            <div className="equipment-card-container">
              {equipmentList.map((eq) => (
                <div key={eq._id} className="equipment-card">
                  {eq.images && eq.images.length > 0 && <img src={eq.images[0]} alt={eq.name} className="equipment-img" />}
                  <h3>{eq.name}</h3>
                  <p><strong>Category:</strong> {eq.category}</p>
                  <p><strong>Price:</strong> ₹{eq.pricePerDay}/day</p>
                  <p><strong>Condition:</strong> {eq.condition || 'N/A'}</p>
                  <p><strong>Location:</strong> {eq.location}</p>
                  <p><strong>Status:</strong> {eq.status}</p>
                  <p><strong>Description:</strong> {eq.description || 'No description provided'}</p>
                  <button onClick={() => setEditEquipment(eq)}>Edit</button>
                  <button onClick={() => deleteEquipment(eq._id)}>Delete</button>
                </div>
              ))}
            </div>
          )}

          {editEquipment && (
            <div className="edit-form">
              <h3>{editEquipment._id ? 'Edit Equipment' : 'Add Equipment'}</h3>
              <input name="name" value={editEquipment.name} onChange={handleEquipmentChange} placeholder="Equipment Name" />
              <select name="category" value={editEquipment.category} onChange={handleEquipmentChange}>
                <option value="">Select Category</option>
                <option value="Tractors">Tractors</option>
                <option value="Harvesters">Harvesters</option>
                <option value="Ploughs">Ploughs</option>
                <option value="Seeders">Seeders</option>
                <option value="Sprayers">Sprayers</option>
                <option value="Irrigation Equipment">Irrigation Equipment</option>
                <option value="Soil Preparation Tools">Soil Preparation Tools</option>
                                <option value="Fertilizer Spreaders">Fertilizer Spreaders</option>
                <option value="Threshers">Threshers</option>
                <option value="Transport Vehicles">Transport Vehicles</option>
                <option value="Other">Other</option>
              </select>
              <input name="pricePerDay" value={editEquipment.pricePerDay} onChange={handleEquipmentChange} placeholder="Price Per Day" />
              <select name="condition" value={editEquipment.condition} onChange={handleEquipmentChange}>
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Old">Old</option>
              </select>
              <input name="location" value={editEquipment.location} onChange={handleEquipmentChange} placeholder="Location" />
              <input name="image" value={editEquipment.images || ''} onChange={handleEquipmentChange} placeholder="Image URL" />
              <select name="status" value={editEquipment.status} onChange={handleEquipmentChange}>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
              <textarea name="description" value={editEquipment.description} onChange={handleEquipmentChange} placeholder="Description"></textarea>
              <button onClick={saveEquipment}>Save</button>
              <button onClick={() => setEditEquipment(null)}>Cancel</button>
            </div>
          )}
        </div>
      )}

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="tab-content">
          <h2>Borrow Requests</h2>
          {requests.length === 0 ? (
            <p>No borrow requests.</p>
          ) : (
            <div className="request-card-container">
              {requests.map((req) => (
                <div key={req._id} className="request-card">
                  <h3>{req.equipment?.name || 'Unknown Equipment'}</h3>
                  <p><strong>Category:</strong> {req.equipment?.category || 'N/A'}</p>
                  <p><strong>Borrower:</strong> {req.borrower?.fullName || 'Unknown Borrower'}</p>
                  <p><strong>Email:</strong> {req.borrower?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {req.borrower?.phone || 'N/A'}</p>
                  <p><strong>Duration:</strong> {req.startDate ? req.startDate.slice(0, 10) : 'N/A'} to {req.endDate ? req.endDate.slice(0, 10) : 'N/A'}</p>
                  <p><strong>Status:</strong> {req.status}</p>
                  {req.status === 'Pending' && (
                    <div>
                      <button onClick={() => handleRequestAction(req._id, 'Approved')}>Approve</button>
                      <button onClick={() => handleRequestAction(req._id, 'Rejected')}>Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE TAB */}
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

      {/* COMPLAINT TAB */}
      {activeTab === 'complaint' && (
        <div className="tab-content">
          <h2>Submit Complaint</h2>
          <label>Title</label>
          <input value={complaintTitle} onChange={(e) => setComplaintTitle(e.target.value)} placeholder="Complaint Title" />
          <label>Message ( with Borrower or Publisher email (must) ):</label>
          <textarea value={complaintMessage} onChange={(e) => setComplaintMessage(e.target.value)} placeholder="Describe your issue..." rows="4" />
          <label>Image URL (optional)</label>
          <input value={complaintImage} onChange={(e) => setComplaintImage(e.target.value)} placeholder="Image URL" />
          <button onClick={submitComplaint}>Submit Complaint</button>

          <h3>My Complaints</h3>
          {myComplaints.length === 0 ? (
            <p>No complaints submitted yet.</p>
          ) : (
            <div className="complaint-list">
              {myComplaints.map((c) => (
                <div key={c._id} className={`complaint-card ${c.status.toLowerCase()}`}>
                  <h4>{c.title} <span>({c.status})</span></h4>
                  <p>{c.message}</p>
                  {c.image && <img src={c.image} alt="complaint" />}
                  {c.adminComment && <p><strong>Admin Comment:</strong> {c.adminComment}</p>}
                  <small>Submitted: {new Date(c.createdAt).toLocaleString()}</small>
                  {c.status === 'Pending' && <button onClick={() => deleteComplaint(c._id)}>Delete</button>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LenderDashboard;
