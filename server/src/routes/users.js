const express = require('express');
const {} = require('../controllers/users.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

module.exports = router;
