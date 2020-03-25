const express = require('express');
const router = express.Router();
const auth = require('../../utils/auth');

const UserSetting = require('../../models/UserSetting');

// @route   GET douvies/profile
// @desc    Get all Users
// @access  Public?
router.get('/', async (req, res) => {
	res.status(404).json({ page: 'Profile & Settings' });
});

// @route   GET douvies/profile/:uid
// @desc    Get a user profile and settings
// @access  Private
router.get('/:uid', auth, async (req, res) => {
	try {
		const settings = await UserSetting.findById(req.params.uid).populate(
			'user',
			['username', 'email']
		);

		console.log(settings);

		// Check if settings/profile exists?
		if (!settings) {
			return res.status(404).json({ msg: 'Settings is not available!' });
		}

		// Check if ther right User requests?
		if (settings.user.id.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized!' });
		}

		res.json(settings);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Settings is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

module.exports = router;
