const Job = require('../models/Job');

// 1. Бүх ажлын зарыг татаж авах (GET)
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Ажлын заруудыг татахад алдаа гарлаа', error });
  }
};

// 2. Шинээр ажлын зар нэмэх (POST)
const createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Ажлын зар нэмэхэд алдаа гарлаа', error });
  }
};

// --- 3. ШИНЭЭР НЭМЭХ ХЭСЭГ: Нэг ажлыг ID-аар нь татах ---
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id); // URL-аас ирсэн ID-аар хайх
    if (!job) {
      return res.status(404).json({ message: 'Ажил олдсонгүй' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error });
  }
};
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Ажил олдсонгүй' });
    }
    res.status(200).json({ message: 'Амжилттай устгагдлаа' });
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error });
  }
};

// getJobById-ийг заавал нэмж export хийнэ шүү!
module.exports = { getJobs, createJob, getJobById };
module.exports = { getJobs, createJob, getJobById, deleteJob };