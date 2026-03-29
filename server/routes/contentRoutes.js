import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import Content from '../models/Content.js';
import Quiz from '../models/Quiz.js';

const router = express.Router();

// @route   GET /api/content
// @desc    Get all learning contents
// @access  Public (or Student)
router.get('/', async (req, res) => {
  try {
    const contents = await Content.find({}).populate('createdBy', 'name');
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/content/:id
// @desc    Get single learning content by ID
// @access  Public (or Student)
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    const quizzes = await Quiz.find({ contentId: req.params.id });
    res.json({ content, quizzes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/content
// @desc    Create new learning content (Admin only)
// @access  Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, category, description, text, videoUrl } = req.body;

    const content = new Content({
      title,
      category,
      description,
      text,
      videoUrl,
      createdBy: req.user._id,
    });

    const createdContent = await content.save();
    res.status(201).json(createdContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/content/:id
// @desc    Delete learning content (Admin only)
// @access  Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    await content.deleteOne();
    // Also delete associated quizzes
    await Quiz.deleteMany({ contentId: req.params.id });
    res.json({ message: 'Content removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/content/:id/quiz
// @desc    Create quiz for a content (Admin only)
// @access  Admin
router.post('/:id/quiz', protect, admin, async (req, res) => {
  try {
    const { title, questions } = req.body;

    const quiz = new Quiz({
      contentId: req.params.id,
      title,
      questions,
    });

    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
