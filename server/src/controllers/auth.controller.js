const CustomError = require('../utils/CustomError');
const asyncHandler = require('../middlewares/asyncHandler');

const User = require('../models/User');
const Profile = require('../models/Profile');

//LATER: REMOVE EXPRESS VALIDATOR
//LATER: forgotPassword & resetPassword
//LATER: delete pending approval from admin etc.
//LATER: temporarly disable

// @desc      Register user -> Get Token
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, username, email, password } = req.body;

	// Get users gravatar @based on email
	// const avatar = gravatar.url(email, {
	// 	s: '200',
	// 	r: 'pg',
	// 	d: 'mm'
	// });

	// Create User
	const user = await User.create({
		name,
		username,
		email,
		// avatar,
		password,
	});

	// Create default profile
	const profile = await Profile.create({ user: user._id });

	// Send created profile's id to user
	await user.setProfile(profile._id);

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
exports.getMe = asyncHandler(async (req, res, next) => {
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

// @desc      Update user details (self not admin privilages)
// @route     PUT /api/v1/auth/me/update/info
// @access    Private
exports.updateMe = asyncHandler(async (req, res, next) => {
	const updateFields = {};
	if (req.body.name) {
		updateFields.name = req.body.name;
	}
	if (req.body.username) {
		updateFields.username = req.body.username;
	}
	if (req.body.email) {
		updateFields.email = req.body.email;
	}

	// Check and do sth
	if (!Object.keys(updateFields).length > 0) {
		return next(new CustomError('There is no any credentials', 401));
	}

	const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc      Update user password (self not admin privilages)
// @route     PUT /api/v1/auth/me/update/password
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	// Check current password is correct
	if (!(await user.isMatchedPassword(req.body.currentPassword))) {
		return next(new CustomError('Password is incorrect!', 401));
	}

	// Set the new password
	user.password = req.body.newPassword;
	await user.save();

	// Send back token
	// after change password logout all??
	tokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
// exports.forgotPassword = asyncHandler(async (req, res, next) => {
// 	let user;
// 	if (req.body.username) {
// 		user = await User.findOne({ username: req.body.username });
// 	} else {
// 		user = await User.findOne({ email: req.body.email });
// 	}

// 	// If user exists
// 	if (!user) {
// 		return next(
// 			new ErrorResponse(
// 				'There is no related user registered with this email/username',
// 				404
// 			)
// 		);
// 	}

// 	// Get reset token
// 	const resetToken = user.getResetPasswordToken();

// 	await user.save({ validateBeforeSave: false });

// 	// Create reset url
// 	const resetUrl = `${req.protocol}://${req.get(
// 		'host'
// 	)}/api/v1/auth/resetpassword/${resetToken}`;

// 	const message = `You are receiving this email because you (or someone else) has requested the reset of a password. If was that you please make a PUT request to: \n\n ${resetUrl}`;

// 	try {
// 		await sendEmail({
// 			email: user.email,
// 			subject: 'Password Reset Confirmation',
// 			message,
// 		});
// 		res.status(200).json({
// 			success: true,
// 			message: 'Email sent.',
// 		});
// 	} catch (err) {
// 		console.log(err);

// 		user.resetPasswordToken = undefined;
// 		user.resetPasswordExpire = undefined;
// 		await user.save({ validateBeforeSave: false });

// 		return next(
// 			new ErrorResponse('Email could not be sent. Please try again later.', 500)
// 		);
// 	}
// });

// Get Token from model, create cookie and send response

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resetToken
// @access    Public

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
