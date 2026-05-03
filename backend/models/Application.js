const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Эдгээр ID-ууд нь "ObjectId" буюу бусад мэдээлэлтэйгээ (User, Job) холбогдох ёстой
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Бусад текст мэдээллүүд
  jobTitle: { type: String, required: true },
  employerName: { type: String, required: true },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  coverLetter: { type: String, required: true },
  
  // Төлөв
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);