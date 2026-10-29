// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
// Ensure .env is always loaded from server directory regardless of execution working directory
require('dotenv').config({ path: path.join(__dirname, '.env') }); 

const seedDatabase = require('./seedData');
const requestorRoutes = require('./routes/requestor');

// --- 1. Import All Routes Explicitly ---
const authRoutes = require('./routes/auth'); 
const dashboardRoutes = require('./routes/dashboard');
const requestRoutes = require('./routes/request');
const vendorRoutes = require('./routes/vendor'); 
const contractRoutes = require('./routes/contract'); 
const analyticsRoutes = require('./routes/analyticsRoutes');
// ---------------------------------------

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const JWT_SECRET = process.env.JWT_SECRET; 

if (!JWT_SECRET) {
    console.error("JWT_SECRET is not set. Check your .env file.");
}

// -------------------------------------------------------------
// Enterprise-Grade CORS Configuration (Express 5 Compatible)
// -------------------------------------------------------------
const rawFrontendUrls = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : [];

const defaultAllowedOrigins = [
  'https://mankray-app.vercel.app',
  'https://task-pink-seven.vercel.app',
  'https://task-1mu1.onrender.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

const allowedOrigins = Array.from(new Set([...rawFrontendUrls, ...defaultAllowedOrigins]));

const isOriginAllowed = (origin) => {
  // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
  if (!origin) return true;
  
  // Direct whitelist match
  if (allowedOrigins.includes(origin)) return true;

  // Dynamic regex match: Allow all Mankray / Vercel deployment preview domains
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(origin)) return true;

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin: ${origin}`);
      // Return null, false to reject CORS gracefully without throwing 500 error
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-auth-token',
    'Origin',
    'Accept',
    'X-Requested-With'
  ],
  exposedHeaders: ['x-auth-token'],
  optionsSuccessStatus: 200 // Legacy browser support
};

// Global CORS Middleware (Automatically handles all OPTIONS preflights & cross-origin headers)
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); 

// Uploads Folder Auto-Create
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve Static Files
console.log("🚀 Serving Static Files from ROOT:", uploadDir);
app.use('/uploads', express.static(uploadDir));

// MongoDB Connection
if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not defined in .env file.");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes Define (Using imported variables now)
app.use('/api/auth', authRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/vendors', vendorRoutes); 
app.use('/api/contracts', contractRoutes); 
app.use('/api/analytics', analyticsRoutes);
app.use('/api/integrations', require('./routes/integration'));
app.use('/api/requestors', requestorRoutes);

// Health check endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Mankray Backend is running!',
    databaseStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
    res.send('Mankray Backend is Running. Frontend is hosted on Vercel.');
});

// Fallback 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
