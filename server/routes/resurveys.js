// routes/resurveys.js
import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// List re-survey requests
router.get('/', (req, res) => {
  const { farmer_id, status } = req.query;
  let list = db.getAllResurveys();

  if (farmer_id) {
    list = list.filter(r => r.farmer_id === farmer_id);
  }
  if (status) {
    list = list.filter(r => r.status === status);
  }

  res.json({ success: true, resurveys: list });
});

// Get single resurvey request
router.get('/:id', (req, res) => {
  const item = db.getResurveyById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Re-survey request not found' });
  }
  res.json({ success: true, resurvey: item });
});

// Create new resurvey request
router.post('/', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'FAR-101';
    const user = db.findUserById(userId);
    const newResurvey = db.createResurveyRequest(req.body, user);
    res.status(201).json({
      success: true,
      resurvey: newResurvey,
      request_id: newResurvey.request_id,
      message: `Re-survey request created successfully with ID: ${newResurvey.request_id}`
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update resurvey status / schedule (Surveyor action)
router.patch('/:id', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'SUR-502';
    const surveyorUser = db.findUserById(userId);
    const updated = db.updateResurvey(req.params.id, req.body, surveyorUser);
    res.json({ success: true, resurvey: updated, message: 'Re-survey request updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
