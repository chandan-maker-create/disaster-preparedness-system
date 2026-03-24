import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import Alert from '../models/Alert.js';

const router = express.Router();

// @route   GET /api/alerts
// @desc    Get all alerts, active ones first
// @access  Public
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({}).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/alerts
// @desc    Create a new emergency alert (Admin only)
// @access  Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { message, severity, category, location } = req.body;

    const alert = new Alert({
      message,
      severity,
      category,
      location,
      createdBy: req.user._id,
    });

    const createdAlert = await alert.save();
    res.status(201).json(createdAlert);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete an alert (Admin only)
// @access  Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    await alert.deleteOne();
    res.json({ message: 'Alert removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
