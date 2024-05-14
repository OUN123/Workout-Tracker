const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    const saltRounds = 10; // You could make this a constant at the top of the file or an environment variable.
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
