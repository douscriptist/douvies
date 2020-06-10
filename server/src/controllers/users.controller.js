const CustomError = require('../utils/CustomError');
const asyncHandler = require('../middlewares/asyncHandler');
const mongoose = require('mongoose');

const { roles } = require('../utils/constants');

const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc      Get current logged in user
// @route     GET /api/v1/users/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id).populate('settings');
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @desc      Update logged in user (self)
// @route     PUT /api/v1/auth/users/me/info
// @access    Private
exports.updateMe = asyncHandler(async (req, res, next) => {
	// check if role change && isAdmin
	if (req.body.hasOwnProperty('role') && req.user.role !== roles.ADMIN_ROLE) {
		console.log('hello');
		return next(new CustomError('Not authorized!', 401));
	}

	const user = await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc      Update logged in user profile (self)
// @route     PUT /api/v1/auth/users/me/profile
// @access    Private
exports.updateMyProfile = asyncHandler(async (req, res, next) => {
	console.log(req.user);
	console.log(req.user.id, 'user.id');
	console.log(req.user.profile, 'user.profile');
});

//////////////////////////////////////////////////////////////////////

// @desc      Get all users & profiles
// @route     GET /api/v1/users
// @access    Private -must be logged in
exports.getAllUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find().populate('settings');

	res.status(200).json({
		success: true,
		data: users,
	});
});

// @route   GET douvies/profile/:uid
// @desc    Get a profile by user id
// @access  Private
exports.getProfileByUID = asyncHandler(async (req, res) => {
	try {
		// const user = await User.findById(req.params.uid).select('-password');
		const [user] = await User.aggregate(
			[
				{
					$match: {
						_id: mongoose.Types.ObjectId(req.params.uid),
					},
				},
				{
					$lookup: {
						from: 'user-settings',
						localField: '_id',
						foreignField: 'user',
						as: 'settings',
					},
				},
				{
					// $unwind: '$settings'
					$unwind: {
						path: '$settings',
						// includeArrayIndex: 'arrayIndex',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$project: {
						password: false,
						'settings.movies': false,
						'settings.series': false,
						'settings.user': false,
						'settings.date': false,
						'settings.__v': false,
					},
				},
			],
			(err, data) => {
				if (!err) {
					return data;
				}
			}
		);

		// Check if settings/profile exists?
		if (!user) {
			return res
				.status(404)
				.json({ success: false, msg: 'User is not available!' });
		}

		// Check if ther right User requests?
		if (user._id.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ success: false, msg: 'User not authorized!' });
		}

		res.json(user);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ success: false, msg: 'User is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   GET douvies/profile/user/:pid
// @desc    Get a user profile by profile id
// @access  Private
exports.getProfileByPID = asyncHandler(async (req, res) => {
	try {
		const settings = await UserSetting.findById(req.params.pid).populate(
			'user',
			['name', 'email', 'username', 'createdAt']
		);

		isAuthUser(settings, req, res);
		res.json(settings);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ success: false, msg: 'Settings is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   PUT douvies/profile/user/:pid
// @desc    Update user profile by profile id
// @access  Private
exports.updateProfileByPID = asyncHandler(async (req, res) => {
	const { darkMode, hideFavourites, hideProfile } = req.body;

	try {
		const updated = await UserSetting.findById(req.params.pid);
		if (!isAuthUser(updated, req, res)) {
			// LATER: refactor
			// Update area
			updated.darkMode = darkMode;
			updated.hideFavourites = hideFavourites;
			updated.hideProfile = hideProfile;
			updated.updatedAt = Date.now();
			await updated.save();
			res.json(updated);
		}
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ success: false, msg: 'Settings is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   PUT douvies/profile/:uid
// @desc    Update user profile by user id
// @access  Private
exports.updateProfileByUID = asyncHandler(async (req, res) => {
	const { darkMode, hideFavourites, hideProfile } = req.body;

	try {
		const updated = await UserSetting.findById(req.params.pid);
		if (!isAuthUser(updated, req, res)) {
			// LATER: refactor
			// Update area
			updated.darkMode = darkMode;
			updated.hideFavourites = hideFavourites;
			updated.hideProfile = hideProfile;
			updated.updatedAt = Date.now();
			await updated.save();
			res.json(updated);
		}
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ success: false, msg: 'Settings is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

exports.resetProfile = asyncHandler(async (req, res) => {
	res.status(200).json({
		success: true,
		msg: 'Profile deleted/Resetted to default settings',
	});
});
