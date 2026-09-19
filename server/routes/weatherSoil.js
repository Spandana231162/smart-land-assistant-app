// routes/weatherSoil.js
import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Weather data with agricultural guidance & live alerts
router.get('/weather', (req, res) => {
  res.json({
    success: true,
    data: db.weather
  });
});

// Soil moisture, NPK, pH & health recommendations
router.get('/soil/:landId?', (req, res) => {
  res.json({
    success: true,
    data: db.soil
  });
});

// Water availability, groundwater level, canal schedule & conservation
router.get('/water/:landId?', (req, res) => {
  res.json({
    success: true,
    data: db.water
  });
});

// Farmer safety precautions across weather categories
router.get('/safety', (req, res) => {
  res.json({
    success: true,
    data: db.farmerSafety
  });
});

export default router;
