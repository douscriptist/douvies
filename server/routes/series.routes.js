const express = require('express');
const {
	check,
	getFavourites,
	getSerie,
	getSeries,
	createSerie,
	updateSerie,
	deleteSerie,
} = require('../controllers/series.controller');
const auth = require('../utils/auth');

const router = express.Router();

router.get('/', auth, getSeries);
router.post('/', auth, check, createSerie);
router.get('/:sid', auth, getSerie);
router.put('/:sid', auth, updateSerie);
router.delete('/:sid', auth, deleteSerie);
router.get('/favourites', auth, getFavourites);

module.exports = router;
