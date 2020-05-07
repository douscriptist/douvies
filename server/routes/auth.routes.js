const express = require('express');
const {
	check,
	getLoggedInUser,
	login,
} = require('../controllers/auth.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, getLoggedInUser);
router.post('/', check, login);

module.exports = router;
