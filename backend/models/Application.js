const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle: { type: String, required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  employerName: { type: String, required: true },
  coverLetter: { type: String, required: true }, // Сэтгэгдэл / Захидал
  
  // --- CV / ПРОФАЙЛЫН МЭДЭЭЛЛҮҮД ---
  profession: { type: String, default: '' }, 
  bio: { type: String, default: '' },        
  skills: { type: String, default: '' },     
  experience: { type: String, default: '' }, 

  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);