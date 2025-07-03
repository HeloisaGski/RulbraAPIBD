const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password_hash: String,
  ra: String,
  role: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
