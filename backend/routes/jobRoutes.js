const express = require('express');
const router = express.Router();

// 1. Бүх функцүүдээ ГАНЦХАН УДАА энд дуудаж оруулж ирнэ
const { getJobs, createJob, getJobById, deleteJob } = require('../controllers/jobController');

// 2. Үндсэн зам (Бүх ажлыг татах, шинэ ажил нэмэх)
router.route('/').get(getJobs).post(createJob);

// 3. ID-тай зам (Нэг ажлыг татах, устгах)
router.route('/:id').get(getJobById).delete(deleteJob);

module.exports = router;