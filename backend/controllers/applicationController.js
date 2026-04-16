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
// --- 3. Бүх өргөдлийг татах (Зөвхөн Админ ашиглана) ---
const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find();
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};
// --- 4. Өргөдлийн төлөв өөрчлөх (Зөвхөн Ажил олгогч ашиглана) ---
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' эсвэл 'rejected' гэж ирнэ
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    res.status(200).json(updatedApp);
  } catch (error) {
    res.status(500).json({ message: "Төлөв өөрчлөхөд алдаа гарлаа", error });
  }
};
// --- 5. Ажил хайгчийн илгээсэн хүсэлтүүдийг татах ---
const getApplicantApplications = async (req, res) => {
  try {
    // Тухайн хэрэглэгчийн ID-аар шүүж, хамгийн сүүлд явуулсныг нь эхэнд харуулах
    const apps = await Application.find({ applicantId: req.params.applicantId }).sort({ createdAt: -1 });
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

module.exports = { createApplication, getJobApplications, getAllApplications, updateApplicationStatus, getApplicantApplications };
