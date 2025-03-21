const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  currentPage: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("PdfProgress", ProgressSchema);
