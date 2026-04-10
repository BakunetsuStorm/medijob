const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle: { type: String, required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  employerName: { type: String, required: true },
  coverLetter: { type: String, required: true } // Өөрийгөө танилцуулсан захидал
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);