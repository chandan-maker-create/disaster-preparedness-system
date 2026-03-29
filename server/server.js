import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

import User from './models/User.js';
import IncidentReport from './models/IncidentReport.js';
import Content from './models/Content.js';

// Load env variables
dotenv.config();

// Connect Database
connectDB();

// Initialize app
const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://chandan-maker-create-disaster-prepared.vercel.app"
  ],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);

// Test route (optional but useful)
app.get('/', (req, res) => {
  res.send("API is running...");
});

// Admin analytics route
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const reportCount = await IncidentReport.countDocuments();
    const contentCount = await Content.countDocuments();

    res.json({
      users: userCount,
      reports: reportCount,
      contents: contentCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});