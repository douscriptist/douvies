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
const auth = require('../utils/auth');

const router = express.Router();

router.get('/', getMovies);
router.post('/', auth, check, createMovie);
router.get('/:mid', auth, getMovie);
router.put('/:mid', auth, updateMovie);
router.delete('/:mid', auth, deleteMovie);
router.get('/favourites', auth, getFavourites);

module.exports = router;
