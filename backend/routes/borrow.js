const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");
const BorrowRequest = require("../models/BorrowRequest");
const Equipment = require("../models/Equipment");

// ----------------- BORROWER ROUTES -----------------

// Send Borrow Request
router.post("/", auth(["Borrower"]), async (req, res) => {
  const { equipmentId, startDate, endDate } = req.body;

  try {
    // Validate Equipment
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment)
      return res.status(404).json({ message: "Equipment not found" });
    if (equipment.status !== "Available")
      return res
        .status(400)
        .json({ message: "Equipment is currently not available" });

    // ✅ Force ObjectId for references
    const borrowRequest = new BorrowRequest({
      equipment: new mongoose.Types.ObjectId(equipment._id),
      borrower: new mongoose.Types.ObjectId(req.user.id),
      lender: new mongoose.Types.ObjectId(equipment.lender),
      startDate,
      endDate,
      status: "Pending",
    });

    await borrowRequest.save();
    res.json({
      message: "Borrow request submitted successfully",
      borrowRequest,
    });
  } catch (err) {
    console.error("Error sending borrow request:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get Borrower Requests
router.get("/my-requests", auth(["Borrower"]), async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ borrower: req.user.id })
      .populate("equipment", "name category pricePerDay status")
      .populate("lender", "fullName email phone");
    res.json(requests);
  } catch (err) {
    console.error("Error fetching borrower requests:", err);
    res.status(500).json({ error: err.message });
  }
});

// Cancel Borrow Request
router.delete("/:id", auth(["Borrower"]), async (req, res) => {
  try {
    const request = await BorrowRequest.findOne({
      _id: req.params.id,
      borrower: req.user.id.toString(),
    });

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "Pending")
      return res
        .status(400)
        .json({ message: "Only pending requests can be canceled" });

    await request.deleteOne();
    res.json({ message: "Borrow request canceled successfully" });
  } catch (err) {
    console.error("Error canceling borrow request:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------- LENDER ROUTES -----------------

// Get Incoming Requests for Lender
router.get("/incoming", auth(["Lender"]), async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ lender: req.user.id })
      .populate("equipment", "name category pricePerDay status")
      .populate("borrower", "fullName email phone");
    res.json(requests);
  } catch (err) {
    console.error("Error fetching incoming requests:", err);
    res.status(500).json({ error: err.message });
  }
});

// Approve or Reject a Borrow Request
router.put("/:id", auth(["Lender"]), async (req, res) => {
  const { status } = req.body; // status = "Approved" or "Rejected"
  if (!["Approved", "Rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.lender.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    request.status = status;
    await request.save();

    // If approved, mark equipment as unavailable
    if (status === "Approved") {
      const equipment = await Equipment.findById(request.equipment);
      if (equipment) {
        equipment.status = "Unavailable";
        await equipment.save();
      }
    }

    res.json({
      message: `Request ${status.toLowerCase()} successfully`,
      request,
    });
  } catch (err) {
    console.error("Error updating borrow request status:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
