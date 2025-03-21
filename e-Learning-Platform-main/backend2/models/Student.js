const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  Firstname: { type: String, required: true },
  Lastname: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
});

module.exports = mongoose.model("Student", StudentSchema);
