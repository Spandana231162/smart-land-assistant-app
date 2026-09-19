// routes/surveyor.js
import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Surveyor KPI Metrics
router.get('/stats', (req, res) => {
  const lands = db.getAllLands();
  const complaints = db.getAllComplaints();
  const resurveys = db.getAllResurveys();

  const stats = {
    total_assigned_surveys: lands.length + resurveys.length,
    pending_requests: resurveys.filter(r => r.status !== 'Resolved' && r.status !== 'Rejected').length,
    resurvey_requests: resurveys.length,
    boundary_complaints: complaints.length,
    disputed_lands: lands.filter(l => l.disputed_polygon !== null || l.survey_status === 'Disputed').length,
    completed_surveys: resurveys.filter(r => r.status === 'Resolved' || r.status === 'Approved').length,
    verified_lands: lands.filter(l => l.survey_status === 'Verified').length
  };

  res.json({ success: true, stats });
});

// Update land verification / boundary points
router.post('/verify', (req, res) => {
  try {
    const { land_id, updates } = req.body;
    const userId = req.headers['x-user-id'] || 'SUR-502';
    const surveyorUser = db.findUserById(userId);

    const updatedLand = db.updateLandSurvey(land_id, updates, surveyorUser);
    res.json({
      success: true,
      land: updatedLand,
      message: `Survey data for land #${updatedLand.survey_number} updated & verified successfully.`
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Forward verified information to Government Revenue Portal
router.post('/forward-gov', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'SUR-502';
    const surveyorUser = db.findUserById(userId);

    const submission = db.forwardToGovernment(req.body, surveyorUser);
    res.json({
      success: true,
      submission,
      message: `Official Cadastral Record #${submission.dispatch_id} transmitted to ${submission.target_department}.`
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
