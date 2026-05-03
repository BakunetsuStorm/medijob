const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Харуул оруулж ирэв

const { getJobs, createJob, getJobById, deleteJob } = require('../controllers/jobController');

// POST хийхэд authMiddleware шалгана
router.route('/').get(getJobs).post(authMiddleware, createJob);

// Устгах үйлдэлд мөн хамгаалалт хийв
router.route('/:id').get(getJobById).delete(authMiddleware, deleteJob);

module.exports = router;