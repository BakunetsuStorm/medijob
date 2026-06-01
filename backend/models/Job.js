const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  employerName: { type: String, required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  salary: { type: Number, required: true },
  salaryType: { type: String, enum: ['цаг', 'өдөр', 'төсөл'], required: true },
  
  locationType: { type: String, enum: ['Зайнаас', 'Оффис', 'Холимог'], default: 'Зайнаас' },
  location: { type: String, default: '' }, 
  
  // Түр зуурын ажил
  isTemporary: { type: Boolean, default: false },
  durationText: { type: String, default: '' },
  tempEndDate: { type: Date },
  
  // Тогтмол давтамжтай ажил
  isRecurring: { type: Boolean, default: false },
  recurringDays: { type: [String], default: [] }, // Жнь: ['Даваа', 'Лхагва']

  // Цагийн хуваарь
  workingHours: { type: String, default: '' },
  workersNeeded: { type: Number, default: 1, required: true }, // 🔥 ШИНЭ: Авах хүний тоо

  requirements: { type: String, required: false },
  rating: { type: Number, default: 0 },
  coverImage: { type: String, default: 'https://via.placeholder.com/400x200?text=Job+Image' }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);