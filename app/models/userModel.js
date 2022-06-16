const mongoose = require("mongoose");

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
    enum: ["Listener", "Artist", "Admin"],
  },
  disabled: {
    required: false,
    type: Boolean,
    default: false,
  },
  name: {
    required: false,
    type: String,
  },
  surname: {
    required: false,
    type: String,
  },
  birthdate: {
    required: false,
    type: Date,
  },
  plan: {
    type: String,
    enum: ["Free", "Premium"],
    default: "Free",
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("User", userSchema);
