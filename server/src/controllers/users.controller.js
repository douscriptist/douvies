const CustomError = require('../utils/CustomError');
const asyncHandler = require('../middlewares/asyncHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const UserSetting = require('../models/UserSetting');

// @route   POST douvies/users
// @desc    Register User
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { name, username, email, password } = req.body;

	// See if user or username exists?
	let user = await User.findOne({ email });
	if (user) {
		return res.status(400).json({ errors: [{ msg: 'User already exists!' }] });
	}
	user = await User.findOne({ username });
	if (user) {
		return res
			.status(400)
			.json({ errors: [{ msg: 'Username already exists!' }] });
	}

	// Get users gravatar @based on email
	// const avatar = gravatar.url(email, {
	// 	s: '200',
	// 	r: 'pg',
	// 	d: 'mm'
	// });

	user = new User({
		name,
		email,
		username,
		// avatar,
		password,
	});

	// Encrpyt password
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(password, salt);

	// Create User default Settings
	const newUserSetting = new UserSetting({
		user: user.id,
	});

	await user.save();
	await newUserSetting.save();

	// Return jwt @because after register user need to logged in
	// req.user.id or req.id
	// const payload = {
	// 	user: {
	// 		id: user.id,
	// 	},
	// };
	const payload = { id: user.id };

	jwt.sign(
		payload,
		process.env.JWT_SECRET,
		// LATER:
		{ expiresIn: 360000 },
		(err, token) => {
			if (err) throw err;
			res.json({ token });
		}
	);

	// console.log('register');
	// res.status(201).json({
	// 	success: true,
	// 	token: 'random token',
	// 	msg: 'user registered successfully',
	// });
});

exports.check = [
	check('name.first', 'firstName is required!').notEmpty(),
	check('name.last', 'lastName is required!').notEmpty(),
	check('username', 'username is required!').notEmpty(),
	check('username', 'username length between 6-12').isLength({
		min: 6,
		max: 12,
	}),
	check('email', 'Enter a valid email!').isEmail(),
	check('password', 'Enter a password between 6 - 12 digits!').isLength({
		min: 6,
		max: 12,
	}),
];
