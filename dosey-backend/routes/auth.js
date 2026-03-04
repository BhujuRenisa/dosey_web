const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/delete-account', authMiddleware, authController.deleteAccount);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/profile-pic', authMiddleware, upload.single('profilePic'), authController.updateProfilePic);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;