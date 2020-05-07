const express = require('express');
const { register, check } = require('../controllers/users.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/', check, register);

module.exports = router;
