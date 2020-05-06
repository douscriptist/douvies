const express = require('express');
const { register, check } = require('../controllers/users.controller');

const router = express.Router();

router.post('/', check, register);

module.exports = router;
