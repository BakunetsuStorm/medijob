const express = require('express');
const router = express.Router();
// updateProfile нэмэгдсэн
const { registerUser, loginUser, getAllUsers, updateProfile } = require('../controllers/authController'); 

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.put('/profile/:id', updateProfile); // ЭНЭ МӨРИЙГ ШИНЭЭР НЭМЛЭЭ

module.exports = router;