const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['worker', 'employer', 'admin'],
    default: 'worker'
  },
  
  // --- CV / ПРОФАЙЛЫН МЭДЭЭЛЛҮҮД (Шинээр нэмэгдсэн) ---
  profession: { type: String, default: '' }, // Мэргэжил (Жнь: Вэб хөгжүүлэгч)
  bio: { type: String, default: '' },        // Товч танилцуулга
  skills: { type: String, default: '' },     // Ур чадварууд
  experience: { type: String, default: '' }  // Туршлага

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);