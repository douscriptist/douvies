const express = require('express');
const {
	getAllProfiles,
	getProfileByPID,
	getProfileByUID,
	updateProfileByPID,
	updateProfileByUID,
	resetProfile,
} = require('../controllers/profiles.controller');
const auth = require('../utils/auth');

const router = express.Router();

router.get('/', getAllProfiles);
router.get('/:uid', auth, getProfileByUID);
router.put('/:uid', auth, updateProfileByUID);
router.delete('/:pid', auth, resetProfile);

// TODO: asyncHandler next param
// TODO: /user re-route
// TODO: refactor all
router.get('/user/:pid', auth, getProfileByPID);
router.put('/user/:pid', auth, updateProfileByPID);

module.exports = router;
