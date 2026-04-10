const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Нэг и-мэйлээр дахиж бүртгүүлэхгүй байх
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['worker', 'employer'], // Ажил хайгч эсвэл Ажил олгогч
    default: 'worker'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);