// routes/lands.js
import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all lands or filter by user
router.get('/', (req, res) => {
  const userId = req.query.user_id;
  const role = req.query.role;

  if (role === 'surveyor') {
    return res.json({ success: true, lands: db.getAllLands() });
  }

  if (userId) {
    return res.json({ success: true, lands: db.getLandsForUser(userId) });
  }

  res.json({ success: true, lands: db.getAllLands() });
});

// Get land by ID or survey number
router.get('/:id', (req, res) => {
  const land = db.getLandById(req.params.id);
  if (!land) {
    return res.status(404).json({ success: false, message: 'Land record not found' });
  }
  res.json({ success: true, land });
});

// Mark disputed area on land
router.post('/:id/dispute', (req, res) => {
  try {
    const { disputed_polygon, remarks } = req.body;
    const userId = req.headers['x-user-id'] || 'FAR-101';
    const user = db.findUserById(userId);

    const updatedLand = db.markDisputedArea(req.params.id, disputed_polygon, remarks, user);
    res.json({ success: true, land: updatedLand, message: 'Disputed area marked successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
