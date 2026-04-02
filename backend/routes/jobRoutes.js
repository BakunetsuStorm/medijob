const express = require('express');
const router = express.Router();
const { getJobs, createJob } = require('../controllers/jobController');

// http://localhost:5000/api/jobs гэсэн хаягаар хандах үед:
router.route('/').get(getJobs).post(createJob);

module.exports = router;