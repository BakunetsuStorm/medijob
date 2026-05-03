const express = require('express');
const router = express.Router();
const { createReview, getReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createReview);
router.get('/:userId', getReviews); // ID-аар татах

module.exports = router;