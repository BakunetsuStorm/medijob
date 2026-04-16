const express = require('express');
const router = express.Router();
const { 
  createApplication, 
  getJobApplications, 
  getAllApplications, 
  updateApplicationStatus, 
  getApplicantApplications // ШИНЭЭР НЭМЛЭЭ
} = require('../controllers/applicationController'); 

router.post('/', createApplication);
router.get('/job/:jobId', getJobApplications);
router.get('/', getAllApplications);
router.put('/:id/status', updateApplicationStatus);
router.get('/applicant/:applicantId', getApplicantApplications); // ЭНЭ МӨРИЙГ ШИНЭЭР НЭМЛЭЭ

module.exports = router;