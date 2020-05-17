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

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, getSeries);
router.post('/', protect, check, createSerie);
router.get('/:sid', protect, getSerie);
router.put('/:sid', protect, updateSerie);
router.delete('/:sid', protect, deleteSerie);
router.get('/favourites', protect, getFavourites);

module.exports = router;
