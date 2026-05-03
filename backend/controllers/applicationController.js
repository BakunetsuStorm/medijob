const Application = require('../models/Application');
const User = require('../models/User'); 
const Job = require('../models/Job');   

// 1. Хүсэлт илгээх
const createApplication = async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId);
    if (!job) {
      return res.status(404).json({ message: "Ажлын зар олдсонгүй." });
    }

    // Хэрэв хуучин алдаатай зар байвал шууд зогсоож анхааруулна
    if (!job.employerId) {
      return res.status(400).json({ message: "Энэхүү ажлын заранд Ажил олгогчийн мэдээлэл дутуу байна. Та хуучин заруудаа устгаад ШИНЭЭР зар нэмж туршина уу!" });
    }

    const applicationData = {
      ...req.body,
      employerId: job.employerId, 
      applicantId: req.user.id  
    };
    
    const newApp = new Application(applicationData);
    await newApp.save();
    
    res.status(201).json({ message: "Ажилд орох хүсэлт амжилттай илгээгдлээ!" });
  } catch (error) {
    console.error("Өргөдөл хадгалах алдаа:", error);
    res.status(500).json({ message: "Алдаа гарлаа", error: error.message });
  }
};

// 2. Тухайн ажлын хүсэлтүүдийг татах
const getJobApplications = async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId })
      // ШИНЭЭР age gender гэдэг үг нэмэгдсэн
      .populate('applicantId', 'profession bio skills experience name email age gender'); 
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

// 3. Бүх өргөдлийг татах
const getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find();
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error });
  }
};

// 4. Төлөв өөрчлөх
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { returnDocument: 'after' } 
    );

    if (status === 'completed') {
      const job = await Job.findById(updatedApp.jobId);
      const worker = await User.findById(updatedApp.applicantId);

      if (job && worker) {
        worker.experience.push({
          title: job.title,
          company: `${job.employerName} (MediJob төсөл)`, 
          duration: new Date().toLocaleDateString('mn-MN'), 
          description: "Энэхүү ажлыг MediJob платформоор дамжуулан амжилттай хийж гүйцэтгэсэн."
        });
        await worker.save(); 
      }
    }

    res.status(200).json(updatedApp);
  } catch (error) {
    res.status(500).json({ message: "Төлөв өөрчлөхөд алдаа гарлаа", error: error.message });
  }
};

// 5. Ажил хайгчийн хүсэлтүүд
const getApplicantApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicantId: req.user.id })
      .populate('jobId')
      .sort({ createdAt: -1 });
      
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error: error.message });
  }
};

// 6. Ажил олгогчийн ажилтнууд
const getEmployerApplications = async (req, res) => {
  try {
    const apps = await Application.find({ employerId: req.user.id })
      .populate('jobId', 'title') 
      // ШИНЭЭР age gender гэдэг үг нэмэгдсэн
      .populate('applicantId', 'name email profession bio skills experience age gender') 
      .sort({ createdAt: -1 });
      
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Алдаа гарлаа", error: error.message });
  }
};

module.exports = { 
  createApplication, 
  getJobApplications, 
  getAllApplications, 
  updateApplicationStatus, 
  getApplicantApplications,
  getEmployerApplications
};