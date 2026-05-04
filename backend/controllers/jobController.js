const Job = require('../models/Job');

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error });
  }
};

const createJob = async (req, res) => {
  try {
    const newJob = new Job({ ...req.body, employerId: req.user.id });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Ажил олдсонгүй' });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error });
  }
};

// 🔥 ШИНЭЭР НЭМСЭН: Ажлын зарыг засах функц
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Ажил олдсонгүй' });

    // Зөвхөн зарыг оруулсан эзэн нь л засах эрхтэй байх хамгаалалт
    if (job.employerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Та энэ зарыг засах эрхгүй байна!' });
    }

    // Зарыг шинэчлэх (req.body дотор шинэ мэдээллүүд ирнэ)
    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Засахад алдаа гарлаа', error });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Ажил олдсонгүй' });
    res.status(200).json({ message: 'Амжилттай устгагдлаа' });
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error });
  }
};

// updateJob-ийг export хийсэн эсэхээ шалгаарай
module.exports = { getJobs, createJob, getJobById, updateJob, deleteJob };