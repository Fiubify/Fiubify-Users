const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  role: {
    required: true,
    type: String,
    enum: ['Listener', 'Artist', 'Admin'],
  },
  disabled: {
    required: false,
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', userSchema);
