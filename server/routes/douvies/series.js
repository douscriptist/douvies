const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.status(404).json({ page: 'Series' });
});

module.exports = router;
