const Application = require('../models/Application');

// 1. Хүсэлт илгээх (Ажил хайгч ашиглана)
const createApplication = async (req, res) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();
    res.status(201).json({ message: "Ажилд орох хүсэлт амжилттай илгээгдлээ!" });
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

// 2. Тухайн ажлын хүсэлтүүдийг татах (Ажил олгогч ашиглана)
const getJobApplications = async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId });
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

module.exports = { createApplication, getJobApplications };