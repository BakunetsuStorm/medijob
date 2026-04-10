const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Токен үүсгэдэг нууц түлхүүр (Үүнийг уг нь .env файлд хадгалдаг ч одоохондоо шууд бичье)
const JWT_SECRET = "MediJobSuperSecretKey2026"; 

// 1. Шинээр бүртгүүлэх (Register)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // И-мэйл бүртгэлтэй эсэхийг шалгах
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Энэ и-мэйл хаяг бүртгэлтэй байна!' });
    }

    // Нууц үгийг түгжих (Hash)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Шинэ хэрэглэгч үүсгэх
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'Амжилттай бүртгүүллээ!' });
  } catch (error) {
    res.status(500).json({ message: 'Бүртгэхэд алдаа гарлаа', error });
  }
};

// 2. Нэвтрэх (Login)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Хэрэглэгч байгаа эсэхийг шалгах
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Бүртгэлгүй и-мэйл байна!' });
    }

    // Нууц үг таарч байгаа эсэхийг шалгах
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Нууц үг буруу байна!' });
    }

    // Эрхийн түлхүүр (Token) үүсгэх
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    // Амжилттай нэвтэрсэн мэдээллийг буцаах
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Нэвтрэхэд алдаа гарлаа', error });
  }
};

module.exports = { registerUser, loginUser };