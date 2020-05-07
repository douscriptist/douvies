const express = require('express');
const {
	check,
	getFavourites,
	getMovie,
	getMovies,
	createMovie,
	updateMovie,
	deleteMovie,
} = require('../controllers/movies.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getMovies);
router.post('/', protect, check, createMovie);
router.get('/:mid', protect, getMovie);
router.put('/:mid', protect, updateMovie);
router.delete('/:mid', protect, deleteMovie);
router.get('/favourites', protect, getFavourites);

module.exports = router;
