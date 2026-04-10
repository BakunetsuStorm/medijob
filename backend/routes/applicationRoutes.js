const express = require('express');
const router = express.Router();
const { createApplication, getJobApplications } = require('../controllers/applicationController');

router.post('/', createApplication);
router.get('/job/:jobId', getJobApplications);

module.exports = router;