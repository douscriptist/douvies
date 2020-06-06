const express = require('express');
const {
	register,
	login,
	getMe,
	logout,
} = require('../controllers/auth.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// router.get('/', protect, getLoggedInUser);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

router.post('/login', login);
router.post('/register', register);

module.exports = router;
