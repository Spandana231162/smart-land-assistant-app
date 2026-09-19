// routes/auth.js
import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all users (useful for demo role switcher)
router.get('/users', (req, res) => {
  res.json({ success: true, users: db.users });
});

// Login / switch user
router.post('/login', (req, res) => {
  const { user_id, role } = req.body;
  
  let user = null;
  if (user_id) {
    user = db.findUserById(user_id);
  } else if (role) {
    user = db.users.find(u => u.role === role);
  }

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    user,
    token: `demo-token-${user.user_id}-${Date.now()}`
  });
});

// Get current user profile
router.get('/me', (req, res) => {
  const userId = req.headers['x-user-id'] || 'FAR-101';
  const user = db.findUserById(userId) || db.users[0];
  res.json({ success: true, user });
});

export default router;
