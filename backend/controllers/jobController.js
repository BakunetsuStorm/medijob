const Job = require('../models/Job');

// 1. Бүх ажлын зарыг татаж авах (GET)
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }); // Хамгийн сүүлд нэмэгдсэн нь эхэндээ гарна
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Ажлын заруудыг татахад алдаа гарлаа', error });
  }
};

// 2. Шинээр ажлын зар нэмэх (POST)
const createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body); // Frontend-ээс ирсэн датаг авах
    const savedJob = await newJob.save(); // Өгөгдлийн санд хадгалах
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Ажлын зар нэмэхэд алдаа гарлаа', error });
  }
};

module.exports = { getJobs, createJob };