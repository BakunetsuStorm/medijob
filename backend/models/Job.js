const mongoose = require('mongoose');

// Ажлын зарын бүтэц
const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true // Заавал байх ёстой мэдээлэл
  },
  category: { 
    type: String, 
    required: true 
  },
  employerName: { 
    type: String, 
    required: true 
  },
  salary: { 
    type: Number, 
    required: true 
  },
  salaryType: { 
    type: String, 
    enum: ['цаг', 'өдөр', 'төсөл'], // Зөвхөн энэ 3 үгийн нэгийг л авна
    required: true 
  },
  rating: { 
    type: Number, 
    default: 0 // Анх үнэлгээ нь 0 байна
  },
  coverImage: { 
    type: String, // Зургийн линк байх учраас String байна
    default: 'https://via.placeholder.com/400x200?text=Job+Image' 
  }
}, { timestamps: true }); // Хэзээ үүссэн, шинэчлэгдсэн цагийг автоматаар хадгална

module.exports = mongoose.model('Job', jobSchema);