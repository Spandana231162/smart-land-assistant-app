// api/weather.js
import { db } from '../server/db.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
  // Return weather data in the shape expected by the client
  res.status(200).json({ success: true, data: db.weather });
}
