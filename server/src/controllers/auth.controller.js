const CustomError = require('../utils/CustomError');
const asyncHandler = require('../middlewares/asyncHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//LATER: REMOVE EXPRESS VALIDATOR
const User = require('../models/User');

// @desc      Register user -> Get Token
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, username, email, password } = req.body;

	// Create User
	const user = await User.create({
		name,
		username,
		email,
		password,
	});

	tokenResponse(user, 200, res);
});

// @desc      Login user -> Get Token
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
	const { username, email, password } = req.body;
	// Validate email & password
	if ((!email && !username) || !password) {
		return next(
			new CustomError('Username or Email & password is required.', 400)
		);
	}

	// Check if user exists
	// with email or username
	let user;
	if (!username) {
		user = await User.findOne({ email }).select('+password');
	} else {
		user = await User.findOne({ username }).select('+password');
	}

	if (!user) {
		return next(new CustomError('User not found.', 401));
	}

	// Check password is matching
	const isMatched = await user.isMatchedPassword(password);
	if (!isMatched) {
		return next(new CustomError('Password is wrong!', 401));
	}

	tokenResponse(user, 200, res);
});

// @desc      Logout user & Clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		data: {},
	});
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// Get Token from model, create cookie and send response
const tokenResponse = (user, statusCode, res) => {
	// Create Token // Comes from User model as methods not statics
	const token = user.getSignedJWTToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token,
	});
};
