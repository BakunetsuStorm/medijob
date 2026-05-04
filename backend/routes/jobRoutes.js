const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const { getJobs, createJob, getJobById, updateJob, deleteJob } = require('../controllers/jobController');

router.route('/').get(getJobs).post(authMiddleware, createJob);

// 🔥 ШИНЭЧИЛСЭН: .put(authMiddleware, updateJob) нэмэгдсэн
router.route('/:id')
  .get(getJobById)
  .put(authMiddleware, updateJob)
  .delete(authMiddleware, deleteJob);

module.exports = router;