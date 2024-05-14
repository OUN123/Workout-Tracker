const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB database!');
}).catch(err => {
  console.error('Could not connect to MongoDB database:', err);
});

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running on port: ${port}`);
});