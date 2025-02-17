const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../utils/db');
const auth = require('../middleware/auth');
const Result = require('../models/Result');

// Get results
router.get('/', auth, async (req, res) => {
  await connectToDatabase();
  try {
    const results = await Result.find({ user: req.user.id }).sort({ date: -1 });
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create result
router.post('/', auth, async (req, res) => {
  await connectToDatabase();
  try {
    const newResult = new Result({
      user: req.user.id,
      data: req.body.data
    });
    const result = await newResult.save();
    res.status(201).json(result);
  } catch (err) {
    console.error('Error saving result:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
