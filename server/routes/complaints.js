// routes/complaints.js
import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// List complaints (optionally filtered by farmer_id or status)
router.get('/', (req, res) => {
  const { farmer_id, status } = req.query;
  let complaints = db.getAllComplaints();

  if (farmer_id) {
    complaints = complaints.filter(c => c.farmer_id === farmer_id);
  }
  if (status) {
    complaints = complaints.filter(c => c.status === status);
  }

  res.json({ success: true, complaints });
});

// Get single complaint
router.get('/:id', (req, res) => {
  const complaint = db.getComplaintById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }
  res.json({ success: true, complaint });
});

// Create new survey complaint
router.post('/', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'FAR-101';
    const user = db.findUserById(userId);
    const newComplaint = db.createComplaint(req.body, user);
    res.status(201).json({
      success: true,
      complaint: newComplaint,
      complaint_id: newComplaint.complaint_id,
      message: `Complaint filed successfully with ID: ${newComplaint.complaint_id}`
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update complaint status (Surveyor action)
router.patch('/:id', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'SUR-502';
    const surveyorUser = db.findUserById(userId);
    const updated = db.updateComplaintStatus(req.params.id, req.body, surveyorUser);
    res.json({ success: true, complaint: updated, message: 'Complaint status updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
