const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Миддлевар тохиргоо (Хуучин зөвхөн app.use(express.json()); байсныг ингэж томруулна)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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

// Бусад route-үүдийн доор үүнийг нэмнэ үү:
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);