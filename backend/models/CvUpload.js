// models/CvUpload.js
const mongoose = require("mongoose");

const CvUploadSchema = new mongoose.Schema({
  originalName: String,
  savedName: String,
  filePath: String,
  fileUrl: String,
  analysis: {
    skills: [String],
    score: Number,
    rank: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CvUpload", CvUploadSchema);
