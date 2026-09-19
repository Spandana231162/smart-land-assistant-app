// routes/notifications.js
import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get notifications for current user
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'] || req.query.user_id;
  const role = req.headers['x-user-role'] || req.query.role;

  let list = db.notifications;
  if (userId) {
    list = list.filter(n => n.user_id === userId || n.role === role);
  }

  res.json({
    success: true,
    unread_count: list.filter(n => n.status === 'unread').length,
    notifications: list
  });
});

// Mark notification as read
router.patch('/:id/read', (req, res) => {
  const notif = db.markNotificationRead(req.params.id);
  if (!notif) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }
  res.json({ success: true, notification: notif });
});

export default router;
