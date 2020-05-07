const express = require('express');
const {
	check,
	getLoggedInUser,
	login,
} = require('../controllers/auth.controller');

const auth = require('../utils/auth');

const router = express.Router();

router.get('/', auth, getLoggedInUser);
router.post('/', check, login);

module.exports = router;
