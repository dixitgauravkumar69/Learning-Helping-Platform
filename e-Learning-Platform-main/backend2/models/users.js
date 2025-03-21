const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  Firstname: {
    type: String,
    required: true,
    trim: true,
  },
  Lastname: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  Password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["student", "teacher"],
  },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);