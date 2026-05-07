const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "MediJobSuperSecretKey2026"; 

const registerUser = async (req, res) => {
  try {
    // 🔥 ЗАСВАР: Frontend-ээс илгээсэн шинэ талбаруудыг хүлээж авах
    const { name, email, password, role, professions, companyRegNumber, companyIndustry } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Энэ и-мэйл хаяг бүртгэлтэй байна!' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔥 ЗАСВАР: Бааз руу хадгалахдаа шинэ талбаруудыг хамт өгнө
    await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role,
      professions: role === 'worker' ? professions : [],
      companyRegNumber: role === 'employer' ? companyRegNumber : '',
      companyIndustry: role === 'employer' ? companyIndustry : ''
    });
    
    res.status(201).json({ message: 'Амжилттай бүртгүүллээ!' });
  } catch (error) {
    res.status(500).json({ message: 'Бүртгэхэд алдаа гарлаа', error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Бүртгэлгүй и-мэйл байна!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Нууц үг буруу байна!' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture, 
      website: user.website,              
      age: user.age,             
      gender: user.gender,       
      // 🔥 ЗАСВАР: Нэвтрэхэд эдгээр мэдээллийг буцааж явуулна
      professions: user.professions,
      profession: user.profession, 
      companyRegNumber: user.companyRegNumber,
      companyIndustry: user.companyIndustry,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Нэвтрэхэд алдаа гарлаа', error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Хэрэглэгчдийг татахад алдаа гарлаа', error });
  }
};

const updateProfile = async (req, res) => {
  try {
    // 🔥 ЗАСВАР: Профайл засахад шинэ талбарууд өөрчлөгдөх боломжтой болгох
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        phone: req.body.phone,
        profilePicture: req.body.profilePicture,
        website: req.body.website,
        age: req.body.age,             
        gender: req.body.gender,       
        professions: req.body.professions, 
        profession: req.body.profession,
        companyRegNumber: req.body.companyRegNumber,
        companyIndustry: req.body.companyIndustry,
        bio: req.body.bio,
        skills: req.body.skills,
        experience: req.body.experience
      },
      { new: true } 
    ).select('-password'); 

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Профайл шинэчлэхэд алдаа гарлаа', error });
  }
};

module.exports = { registerUser, loginUser, getAllUsers, updateProfile };