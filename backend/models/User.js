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
  
  // --- CV / ПРОФАЙЛЫН МЭДЭЭЛЛҮҮД ---
  age: { type: Number, default: null },       // ШИНЭ: Нас
  gender: { type: String, default: '' },      // ШИНЭ: Хүйс
  profession: { type: String, default: '' },  // Мэргэжил 
  bio: { type: String, default: '' },         // Товч танилцуулга
  skills: { type: String, default: '' },      // Ур чадварууд
  
  experience: [
    {
      title: { type: String },       
      company: { type: String },     
      duration: { type: String },    
      description: { type: String }  
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);