const express = require('express');
const router = express.Router();
const Exercise = require('../models/exercise.model');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find({ userId: req.user.id });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Add a new exercise
router.post('/add', async (req, res) => {
  const newExercise = new Exercise({
    ...req.body,
    userId: req.user.id,
  });

  try {
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json('Exercise not found.');
    }

    exercise.description = req.body.description;
    exercise.duration = Number(req.body.duration);
    exercise.date = Date.parse(req.body.date);

    await exercise.save();
    res.json('Exercise updated!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Delete an exercise
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).send('Exercise not found.');
    }
    res.send('Exercise deleted.');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

router.get('/stats/monthly', async (req, res) => {
  const userId = req.user.id;
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

  try {
    const stats = await Exercise.aggregate([
      { $match: { userId: userId, date: { $gte: startOfYear, $lt: endOfYear } } },
      { $group: {
        _id: { month: { $month: "$date" } },
        count: { $sum: 1 }
      }},
      { $sort: { "_id.month": 1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
