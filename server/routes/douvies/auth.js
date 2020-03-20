const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../utils/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult, oneOf } = require('express-validator');
require('dotenv').config();

const User = require('../../models/User');

// @route   GET douvies/auth
// @desc    Test Route
// @access  Public
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   POST douvies/auth
// @desc    Authenticate User & Get Token
// @access  Public
router.post(
	'/',
	[
		check('input', 'Username or email is required').exists(),
		check('input', 'Username has to be minimum 6 characters').isLength({
			min: 6
		}),
		check('password', 'Password is required!').exists()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { input, password } = req.body;

		try {
			// See if user exists?
			let user = await User.findOne({ email: input });
			let userName = await User.findOne({ username: input });
			if (!user) {
				if (!userName) {
					// Security ????
					return res.status(404).json({ errors: [{ msg: 'User not found!' }] });
				} else {
					user = userName;
				}
			}

			// Match email and password
			const isMatched = await bcrypt.compare(password, user.password);
			if (!isMatched) {
				// Security ????
				return res
					.status(404)
					.json({ errors: [{ msg: 'Password is wrong!' }] });
			}

			//
			const payload = {
				user: {
					id: user.id
				}
			};

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
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
