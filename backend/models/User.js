const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['worker', 'employer', 'admin'],
    default: 'worker'
  },
  professions: {
    type: [String], // Олон мэргэжил хадгалах Array
    default: []
  },
  // backend/models/User.js доторх userSchema-д нэмэх:
  companyRegNumber: {
    type: String, // Байгууллагын регистрийн дугаар
    default: ""
  },
  companyIndustry: {
    type: String, // Үйл ажиллагааны чиглэл
    default: ""
  },
  
  // 🔥 ШИНЭ: ЗУРАГ БОЛОН АЖИЛ ОЛГОГЧИЙН МЭДЭЭЛЭЛ
  profilePicture: { type: String, default: '' }, // Цээж зураг эсвэл Лого
  website: { type: String, default: '' },        // Компанийн вэбсайт

  // --- CV / ПРОФАЙЛЫН МЭДЭЭЛЛҮҮД ---
  age: { type: Number, default: null },       
  gender: { type: String, default: '' },      
  profession: { type: String, default: '' },  
  bio: { type: String, default: '' },         
  skills: { type: String, default: '' },      
  
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