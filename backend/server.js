const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const Job = require('./models/Job'); 
require('dotenv').config();

const app = express();

// Миддлевар тохиргоо 
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
app.use('/api/reviews', require('./routes/reviewRoutes')); // Бага зэрэг дээшлүүлж зөв байрлалд орууллаа

// ==========================================
// 🔥 CRON JOB: ХУГАЦАА НЬ ДУУССАН ЗАР УСТГАХ
// Өдөр бүрийн шөнийн 00:00 цагт автоматаар ажиллана ('0 0 * * *')
// ==========================================
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Өнөөдрийн эхлэх цаг руу шилжүүлэх

    // isTemporary: true бөгөөд tempEndDate нь өнөөдрөөс өмнө байвал устгах
    const result = await Job.deleteMany({
      isTemporary: true,
      tempEndDate: { $lt: today }
    });

    if (result.deletedCount > 0) {
      console.log(`[CRON] Хугацаа нь дууссан ${result.deletedCount} ширхэг түр зуурын зарыг автоматаар устгалаа.`);
    }
  } catch (error) {
    console.error('[CRON] Зар устгах үед алдаа гарлаа:', error);
  }
});

// Серверийг асаах (ХАМГИЙН ТӨГСГӨЛД БАЙХ ЁСТОЙ)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер ${PORT} порт дээр ажиллаж эхэллээ`);
});