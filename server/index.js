// index.js - Main Express API Server & Static Host for Smart Land Assistant
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import landsRoutes from './routes/lands.js';
import complaintsRoutes from './routes/complaints.js';
import resurveysRoutes from './routes/resurveys.js';
import weatherSoilRoutes from './routes/weatherSoil.js';
import surveyorRoutes from './routes/surveyor.js';
import auditRoutes from './routes/audit.js';
import notificationsRoutes from './routes/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for client development server
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-role']
}));

// Body parsing with generous limit for evidence uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lands', landsRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/resurveys', resurveysRoutes);
app.use('/api', weatherSoilRoutes); // /api/weather, /api/soil, /api/water, /api/safety
app.use('/api/surveyor', surveyorRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Smart Land & Farmer Assistance System API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve compiled client assets if dist exists
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// SPA fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 BhoomiSeva Smart Land Server running on port ${PORT}`);
  console.log(`🔗 Full Web App: http://localhost:${PORT}`);
  console.log(`🔗 API Health:   http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
