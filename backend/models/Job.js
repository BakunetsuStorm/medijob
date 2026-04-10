const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  employerName: { type: String, required: true },
  salary: { type: Number, required: true },
  salaryType: { type: String, enum: ['цаг', 'өдөр', 'төсөл'], required: true },
  
  // --- ШИНЭЭР НЭМЭГДСЭН ХЭСГҮҮД ---
  locationType: { 
    type: String, 
    enum: ['Зайнаас', 'Оффис', 'Холимог'], 
    default: 'Зайнаас' 
  },
  requirements: { 
    type: String, 
    required: true // Ажлын шаардлага заавал бичих ёстой
  },
  // ---------------------------------

  rating: { type: Number, default: 0 },
  coverImage: { type: String, default: 'https://via.placeholder.com/400x200?text=Job+Image' }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);