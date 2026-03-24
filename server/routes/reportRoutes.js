import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import IncidentReport from '../models/IncidentReport.js';

const router = express.Router();

// @route   POST /api/reports
// @desc    Submit an incident report
// @access  Student (All logged in users)
router.post('/', protect, async (req, res) => {
  try {
    const { type, description, location, imageUrl } = req.body;

    const report = new IncidentReport({
      studentId: req.user._id,
      type,
      description,
      location,
      imageUrl,
    });

    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/reports
// @desc    Get all incident reports (Admin only)
// @access  Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const reports = await IncidentReport.find({})
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reports/:id/status
// @desc    Update incident report status (Admin only)
// @access  Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const report = await IncidentReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = req.body.status || report.status;
    const updatedReport = await report.save();
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
