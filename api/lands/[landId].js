// api/lands/[landId].js
import { db } from '../server/db.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
  const { landId } = req.query;
  const land = db.getLandById(landId || 'LAND-TG-501');
  if (!land) {
    return res.status(404).json({ success: false, message: 'Land not found' });
  }
  return res.status(200).json({ success: true, land });
}
