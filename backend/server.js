const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // .env доторх нууц үгийг унших сан

const app = express();

// Миддлевар тохиргоо (Frontend-ээс дата хүлээж авахын тулд)
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

// Серверийг асаах
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер ${PORT} порт дээр ажиллаж эхэллээ`);
});

// Тестийн API
app.get('/', (req, res) => {
  res.send('MediJob Backend хэвийн ажиллаж байна...');
});

// Үндсэн API замууд (ҮҮНИЙГ НЭМНЭ)
app.use('/api/jobs', require('./routes/jobRoutes'));