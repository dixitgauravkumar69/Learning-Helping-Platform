const mongoose = require("mongoose");

const DumySchema = new mongoose.Schema({
  Courseid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  ProgressPer: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Dumy", DumySchema);
