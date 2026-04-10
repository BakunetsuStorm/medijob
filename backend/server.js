const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Миддлевар тохиргоо 
app.use(express.json());
app.use(cors());

// MongoDB-тэй холбогдох хэсэг
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB өгөгдлийн сантай амжилттай холбогдлоо!'))
  .catch((err) => console.log('❌ Холбогдоход алдаа гарлаа:', err));

// Тестийн API
app.get('/', (req, res) => {
  res.send('MediJob Backend хэвийн ажиллаж байна...');
});

// Үндсэн API замууд (БҮХ ЗАМУУД ЭНД БАЙХ ЁСТОЙ)
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes')); 

// Серверийг асаах (ХАМГИЙН ТӨГСГӨЛД БАЙХ ЁСТОЙ)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер ${PORT} порт дээр ажиллаж эхэллээ`);
});