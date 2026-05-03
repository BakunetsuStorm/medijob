const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { 
  createApplication, 
  getJobApplications, 
  getAllApplications, 
  updateApplicationStatus, 
  getApplicantApplications,
  getEmployerApplications // ҮҮНИЙГ НЭМСЭН
} = require('../controllers/applicationController'); 

router.post('/', authMiddleware, createApplication);
router.get('/job/:jobId', getJobApplications);
router.get('/', getAllApplications);
router.put('/:id/status', authMiddleware, updateApplicationStatus);

router.get('/worker', authMiddleware, getApplicantApplications);
// АЖИЛ ОЛГОГЧИЙН ЗАМ (ЭНЭ БАЙХГҮЙГЭЭС БОЛООД ХООСОН БАЙСАН)
router.get('/employer', authMiddleware, getEmployerApplications); 

module.exports = router;