const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../utils/auth');

const Movie = require('../../models/Movie');
const User = require('../../models/User');

// @route   POST douvies/movies
// @desc    Post a movie
// @access  Private
router.post(
	'/',
	[
		auth,
		check('apiId', 'apiId is required.').notEmpty(),
		check('imdbId', 'imdbId is required.').notEmpty(),
		check('title', 'title is required.').notEmpty(),
		check('personalRate', 'personalRate is required.').notEmpty(),
		check('isWatched', 'isWatched is required.')
			.notEmpty()
			.isBoolean()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			// const user = await User.findById(req.user.id).select('-password');
			const {
				apiId,
				imdbId,
				title,
				director,
				description,
				type,
				year,
				personalRate,
				isWatched,
				imdb,
				language,
				posterURL
			} = req.body;

			const newMovie = new Movie({
				apiId,
				imdbId,
				title,
				director,
				description,
				type,
				year,
				personalRate,
				isWatched,
				imdb,
				language,
				posterURL,
				user: req.user.id
			});

			const movie = await newMovie.save();
			res.json(movie);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route   GET douvies/movies
// @desc    Maybe Upcoming?
// @access  Public?
router.get('/', async (req, res) => {
	try {
		const movies = await Movie.find();
		if (!movies.length)
			return res.status(404).json({ msg: 'Movies not found' });
		res.json(movies);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Erro');
	}
});

// @route   GET douvies/movies/:mid
// @desc    Get a movie
// @access  Private
router.get(
	'/:mid',
	/*auth,*/ async (req, res) => {
		try {
			const movie = await Movie.findById(req.params.mid);
			if (!movie)
				return res.status(404).json({ msg: 'Movie is not available!' });
			res.json(movie);
		} catch (err) {
			console.error(err.message);
			if (err.kind === 'ObjectId') {
				return res.status(404).json({ msg: 'Movie is not available!' });
			}
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
