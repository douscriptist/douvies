const express = require('express');
const {
	register,
	login,
	getMe,
	logout,
	updateMe,
	updatePassword,
} = require('../controllers/auth.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// router.get('/', protect, getLoggedInUser);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

router.post('/login', login);
router.post('/register', register);

router.put('/me/update/info', protect, updateMe);
router.put('/me/update/password', protect, updatePassword);

// DELETE USER JUST WANT TO DELETE

module.exports = router;
