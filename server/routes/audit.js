// routes/audit.js
import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Retrieve all audit logs with optional filter
router.get('/', (req, res) => {
  const { entity, action } = req.query;
  let logs = db.auditLogs;

  if (entity) {
    logs = logs.filter(l => l.entity.toLowerCase().includes(entity.toLowerCase()));
  }
  if (action) {
    logs = logs.filter(l => l.action.toLowerCase() === action.toLowerCase());
  }

  res.json({ success: true, count: logs.length, audit_logs: logs });
});

export default router;
