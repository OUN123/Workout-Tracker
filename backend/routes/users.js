const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Exercise = require('../models/exercise.model'); // Ensure Exercise model is imported if used
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);
// Register User
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' }); // Adjusted token expiry
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Profile route (Protected)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get monthly exercise statistics (Protected)
router.get('/stats/monthly', verifyToken, async (req, resp) => {
  console.log("Fetching monthly stats for user:", req.user.id); // Added logging
  const userId = req.user.id;
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

  try {
    const stats = await Exercise.aggregate([
      { $match: { userId: userId, date: { $gte: startOfYear, $lt: endOfYear } } },
      { $group: { _id: { month: { $month: "$date" } }, count: { $sum: 1 } } },
      { $sort: { "_id.month": 1 } }
    ]);
    resp.json(stats);
  } catch (error) {
    console.log(error); // Add error logging for troubleshooting
    resp.status(500).send('Server error');
  }
});

module.exports = router;
