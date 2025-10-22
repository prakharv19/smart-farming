// frontend/src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+91', // default
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'Borrower',
    farmSize: '',
    cropType: '',
    expertise: ''
  });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ===== Validation Functions =====
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validatePhone = (phone) => {
    const regex = /^\d{10}$/; // 10 digits
    return regex.test(phone);
  };

  const validateFarmSize = (size) => /^\d+$/.test(size);

  const handleSubmit = async e => {
    e.preventDefault();

    // ===== Client-side validations =====
    if (!validatePassword(formData.password)) {
      alert("Password must be minimum 8 characters, include uppercase, lowercase, digit, and special symbol.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!validatePhone(formData.phone)) {
      alert("Phone must be 10 digits long (without country code).");
      return;
    }

    if (formData.role === 'Borrower' && !validateFarmSize(formData.farmSize)) {
      alert("Farm size must contain only digits (in acres)");
      return;
    }

    // Concatenate country code + phone
    const phoneWithCode = `${formData.countryCode} ${formData.phone}`;

    // Prepare data to send
    const sendData = { ...formData, phone: phoneWithCode };
    delete sendData.confirmPassword; // no need to send confirmPassword
    delete sendData.countryCode; // already added to phone

    try {
      const res = await axios.post('https://smart-farming-backend-2cxi.onrender.com/api/auth/register', sendData);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} required />

        <label>Email</label>
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />

        <label>Phone</label>
        <div className="phone-field">
          <select name="countryCode" value={formData.countryCode} onChange={handleChange}>
            <option value="+91">+91 India</option>
            <option value="+1">+1 USA</option>
            <option value="+44">+44 UK</option>
            <option value="+61">+61 Australia</option>
            {/* add more country codes here */}
          </select>
          <input name="phone" placeholder="10-digit Phone" onChange={handleChange} required />
        </div>

        <label>Password</label>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

        <label>Address</label>
        <input name="address" placeholder="Complete Address" onChange={handleChange} required />

        <label>Role</label>
        <select name="role" onChange={handleChange}>
          <option value="Borrower">Borrower</option>
          <option value="Lender">Lender</option>
          <option value="Publisher">Publisher</option>
        </select>

        {formData.role === 'Borrower' && (
          <>
            <label>Farm Size (in acres)</label>
            <input name="farmSize" placeholder="Farm Size" onChange={handleChange} required />
            <label>Crop Type</label>
            <input name="cropType" placeholder="Crop Type" onChange={handleChange} />
          </>
        )}

        {formData.role === 'Publisher' && (
          <>
            <label>Expertise / Blog Category</label>
            <input name="expertise" placeholder="Expertise / Blog Category" onChange={handleChange} />
          </>
        )}

        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Register;
