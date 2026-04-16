const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Токен үүсгэдэг нууц түлхүүр
const JWT_SECRET = "MediJobSuperSecretKey2026"; 

// 1. Шинээр бүртгүүлэх (Register)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Энэ и-мэйл хаяг бүртгэлтэй байна!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Бүртгэлгүй и-мэйл байна!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Нууц үг буруу байна!' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profession: user.profession,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Нэвтрэхэд алдаа гарлаа', error });
  }
};

// --- 3. Бүх хэрэглэгчдийг татах (Зөвхөн Админ үзэх зориулалттай) ---
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Хэрэглэгчдийг татахад алдаа гарлаа', error });
  }
};

// --- 4. Профайл (CV) шинэчлэх ---
const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        profession: req.body.profession,
        bio: req.body.bio,
        skills: req.body.skills,
        experience: req.body.experience
      },
      { new: true } // Шинэчлэгдсэн датаг буцаах
    ).select('-password'); // Нууц үгийг нь харуулахгүй

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Профайл шинэчлэхэд алдаа гарлаа', error });
  }
};

// БҮХ 4 ФУНКЦ ЭНД БАЙГАА
module.exports = { registerUser, loginUser, getAllUsers, updateProfile };