// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// ====== ROUTES IMPORTS ======
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const equipmentRoutes = require('./routes/equipment');
const borrowRoutes = require('./routes/borrow');
const publisherRoutes = require('./routes/publisher');
const adminRoutes = require('./routes/admin');
const publicBlogsRoutes = require('./routes/blogsPublic');
const publicRoutes = require('./routes/public');
const complaintRoutes = require('./routes/complaint'); // ✅ singular form

// ====== ROUTES USAGE ======
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/publisher', publisherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', publicBlogsRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/complaints', complaintRoutes); // ✅ route endpoint stays plural

// ====== TEST ROUTE ======
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// ====== MONGODB CONNECTION ======
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ====== SERVER START ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
