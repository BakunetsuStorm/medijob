const jwt = require('jsonwebtoken');

// Таны authController дээрхтэй яг ижил түлхүүр үг!
const JWT_SECRET = "MediJobSuperSecretKey2026"; 

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Нэвтрэх эрхгүй байна. Токен илгээгдсэнгүй.' });
    }

    const token = authHeader.split(' ')[1]; 

    // ЭНД нууц үгийг зөв тааруулж шалгаж байна
    const decoded = jwt.verify(token, JWT_SECRET); 

    req.user = decoded; 
    next(); 

  } catch (error) {
    res.status(401).json({ message: 'Токен буруу эсвэл хугацаа нь дууссан байна.' });
  }
};

module.exports = authMiddleware;