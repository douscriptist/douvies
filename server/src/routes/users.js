const express = require('express');
const {
	getMe,
	updateMe,
	updateMyProfile,
	getAllUsers,
} = require('../controllers/users.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/', getAllUsers);

router.put('/me/info', protect, updateMe);
router.put('/me/profile', protect, updateMyProfile);

// // TODO: asyncHandler next param
// // TODO: /user re-route
// // TODO: refactor all

module.exports = router;
