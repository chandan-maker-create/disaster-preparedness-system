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

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);

// Simple admin analytics endpoint
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const reportCount = await IncidentReport.countDocuments();
    const contentCount = await Content.countDocuments();
    res.json({ users: userCount, reports: reportCount, contents: contentCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
