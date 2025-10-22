const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// ====== MODELS ======
const Blog = require("../models/Blog");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Equipment = require("../models/Equipment");
const BorrowRequest = require("../models/BorrowRequest"); // new

// =====================================================
// 📘 BLOG MANAGEMENT
// =====================================================

// Fetch all blogs
router.get("/blogs", auth(["Admin"]), async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("publisher", "fullName email role")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

// Approve blog
router.put("/blog/:id/approve", auth(["Admin"]), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.status = "Approved";
    blog.adminComment = req.body.comment || "Approved by admin";
    await blog.save();

    res.json({ message: "Blog approved successfully", blog });
  } catch (err) {
    console.error("Error approving blog:", err);
    res.status(500).json({ message: "Failed to approve blog" });
  }
});

// Reject blog
router.put("/blog/:id/reject", auth(["Admin"]), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.status = "Rejected";
    blog.adminComment = req.body.comment || "Rejected by admin";
    await blog.save();

    res.json({ message: "Blog rejected successfully", blog });
  } catch (err) {
    console.error("Error rejecting blog:", err);
    res.status(500).json({ message: "Failed to reject blog" });
  }
});

// Delete blog
router.delete("/blog/:id", auth(["Admin"]), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Failed to delete blog" });
  }
});

// =====================================================
// 🧾 COMPLAINT MANAGEMENT
// =====================================================

// Fetch all complaints
router.get("/complaints", auth(["Admin"]), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "fullName email role")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// Update complaint status
router.put("/complaints/:id", auth(["Admin"]), async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    if (!["Resolved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be Resolved or Rejected" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;
    complaint.adminComment = adminComment || "";
    await complaint.save();

    res.json({ message: "Complaint updated successfully", complaint });
  } catch (err) {
    console.error("Error updating complaint:", err);
    res.status(500).json({ message: "Failed to update complaint" });
  }
});

// Delete complaint
router.delete("/complaints/:id", auth(["Admin"]), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    await complaint.deleteOne();
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error("Error deleting complaint:", err);
    res.status(500).json({ message: "Failed to delete complaint" });
  }
});

// =====================================================
// 👤 USER MANAGEMENT
// =====================================================

router.get("/users", auth(["Admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.delete("/users/:id", auth(["Admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// =====================================================
// ⚙️ EQUIPMENT MANAGEMENT
// =====================================================

router.get("/equipments", auth(["Admin"]), async (req, res) => {
  try {
    const equipments = await Equipment.find().sort({ createdAt: -1 });
    res.json(equipments);
  } catch (err) {
    console.error("Error fetching equipments:", err);
    res.status(500).json({ message: "Failed to fetch equipments" });
  }
});

router.delete("/equipments/:id", auth(["Admin"]), async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: "Equipment not found" });

    await equipment.deleteOne();
    res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    console.error("Error deleting equipment:", err);
    res.status(500).json({ message: "Failed to delete equipment" });
  }
});

// =====================================================
// 📄 BORROW REQUEST MANAGEMENT
// =====================================================

// Fetch all borrow requests (Admin)
router.get("/borrow-requests", auth(["Admin"]), async (req, res) => {
  try {
    const borrowRequests = await BorrowRequest.find()
      .populate("borrower", "fullName role email")
      .populate("lender", "fullName role email")
      .populate("equipment", "name category")
      .sort({ createdAt: -1 });
    res.json(borrowRequests);
  } catch (err) {
    console.error("Error fetching borrow requests:", err);
    res.status(500).json({ message: "Failed to fetch borrow requests" });
  }
});




// Delete borrow request (Admin only)
router.delete("/borrow-requests/:id", auth(["Admin"]), async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Borrow request not found" });

    await request.deleteOne();
    res.json({ message: "Borrow request deleted successfully" });
  } catch (err) {
    console.error("Error deleting borrow request:", err);
    res.status(500).json({ message: "Failed to delete borrow request" });
  }
});

// =====================================================
// 👤 ADMIN PROFILE MANAGEMENT
// =====================================================

router.get("/profile", auth(["Admin"]), async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

router.put("/profile", auth(["Admin"]), async (req, res) => {
  try {
    const { fullName, phone, address, currentPassword, newPassword } = req.body;
    const admin = await User.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (fullName) admin.fullName = fullName;
    if (phone) admin.phone = phone;
    if (address) admin.address = address;

    if (currentPassword && newPassword) {
      const bcrypt = require("bcryptjs");
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    await admin.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
