const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../../utils/auth');

const UserSetting = require('../../models/UserSetting');
const Serie = require('../../models/Serie');
const User = require('../../models/User');

// @route   GET douvies/profile
// @desc    Get all Users
// @access  Public?
router.get('/', async (req, res) => {
	res.status(404).json({ page: 'Profile & Settings' });
});

// @route   GET douvies/profile/:uid
// @desc    Get a profile by user id
// @access  Private
router.get('/:uid', auth, async (req, res) => {
	try {
		// const user = await User.findById(req.params.uid).select('-password');
		const [user] = await User.aggregate(
			[
				{
					$match: {
						_id: mongoose.Types.ObjectId(req.params.uid)
					}
				},
				{
					$lookup: {
						from: 'user-settings',
						localField: '_id',
						foreignField: 'user',
						as: 'settings'
					}
				},
				{
					// $unwind: '$settings'
					$unwind: {
						path: '$settings',
						// includeArrayIndex: 'arrayIndex',
						preserveNullAndEmptyArrays: false
					}
				},
				{
					$project: {
						password: false,
						'settings.movies': false,
						'settings.series': false,
						'settings.user': false,
						'settings.date': false,
						'settings.__v': false
					}
				}
			],
			(err, data) => {
				if (!err) {
					return data;
				}
			}
		);

		// Check if settings/profile exists?
		if (!user) {
			return res.status(404).json({ msg: 'User is not available!' });
		}

		// Check if ther right User requests?
		if (user._id.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized!' });
		}

		res.json(user);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'User is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   GET douvies/profile/user/:pid
// @desc    Get a user profile by profile id
// @access  Private
router.get('/user/:pid', auth, async (req, res) => {
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
			return res.status(404).json({ msg: 'Settings is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   PUT douvies/profile/user/:pid
// @desc    Update user profile by profile id
// @access  Private
router.put('/user/:pid', auth, async (req, res) => {
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
			return res.status(404).json({ msg: 'Settings is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

function isAuthUser(param, req, res) {
	// Check if settings/profile exists?
	if (!param) {
		return res.status(404).json({ msg: 'Settings is not available!' });
	}

	// Check if ther right User requests?
	if (
		param.user.id.toString() !== req.user.id &&
		param.user.toString() !== req.user.id
	) {
		return res.status(401).json({ msg: 'User not authorized!' });
	}
}

module.exports = router;
