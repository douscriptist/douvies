const express = require('express');
const {
	getAllProfiles,
	getProfileByPID,
	getProfileByUID,
	updateProfileByPID,
	updateProfileByUID,
	resetProfile,
} = require('../controllers/profiles.controller');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getAllProfiles);
router.get('/:uid', protect, getProfileByUID);
router.put('/:uid', protect, updateProfileByUID);
router.delete('/:pid', protect, resetProfile);

// TODO: asyncHandler next param
// TODO: /user re-route
// TODO: refactor all
router.get('/user/:pid', protect, getProfileByPID);
router.put('/user/:pid', protect, updateProfileByPID);

module.exports = router;
