const CustomError = require('../utils/CustomError');
const asyncHandler = require('../middlewares/asyncHandler');
const { check, validationResult } = require('express-validator');

const Movie = require('../models/Movie');
const User = require('../models/User');

// @route   GET douvies/movies/favourites
// @desc    Get favourite movies
// @access  Private
exports.getFavourites = asyncHandler(async (req, res) => {
	res.json({ success: true, msg: 'Favourite Series' });
	// try {
	// 	const movies = await Serie.find({ user: req.user.id });
	// 	if (!movies.length)
	// 		return res.status(404).json({ msg: 'Series not found' });
	// 	res.json(movies);
	// } catch (err) {
	// 	console.error(err.message);
	// 	res.status(500).send('Server Erro');
	// }
});

// @route   POST douvies/movies
// @desc    Post a movie
// @access  Private
exports.createMovie = asyncHandler(async (req, res) => {
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
			posterURL,
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
			user: req.user.id,
		});

		const movie = await newMovie.save();
		res.json(movie);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   GET douvies/movies
// @desc    Maybe Upcoming?
// @access  Public?
exports.getMovies = asyncHandler(async (req, res) => {
	try {
		const movies = await Movie.find();
		if (!movies.length)
			return res.status(404).json({ success: false, msg: 'Movies not found' });
		res.json(movies);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Erro');
	}
});

// @route   GET douvies/movies/:mid
// @desc    Get a movie
// @access  Private
exports.getMovie = asyncHandler(async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.mid);
		if (!isAuth(movie, req, res)) {
			res.json(movie);
		}
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ success: false, msg: 'Movie is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   PUT douvies/movies/:mid
// @desc    Update a movie
// @access  Private
exports.updateMovie = asyncHandler(async (req, res) => {
	const updatedMovie = { ...req.body, updatedAt: Date.now() };
	try {
		const isMovie = await Movie.findById(req.params.mid);
		if (!isAuth(isMovie, req, res)) {
			// const movie = await Movie.findOneAndUpdate(
			// 	{ _id: req.params.mid },
			// 	updatedMovie,
			// 	{ new: true }
			// );
			await isMovie.updateOne(updatedMovie);
			res.status(200).json({ success: true, msg: 'Updated successfully...' });
		}
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ success: false, msg: 'Movie is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   DELETE douvies/movies/:mid
// @desc    Delete a movie
// @access  Private
exports.deleteMovie = asyncHandler(async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.mid);
		if (!isAuth(movie, req, res)) {
			await movie.remove();
			res.json({ msg: 'Movie removed succesfully!' });
		}
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ success: false, msg: 'Movie is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

function isAuth(param, req, res) {
	// Check if movie exists?
	if (!param) {
		return res
			.status(404)
			.json({ success: false, msg: 'Movie is not available!' });
	}
	// Check if ther right User requests?
	if (param.user.toString() !== req.user.id) {
		return res
			.status(401)
			.json({ success: false, msg: 'User not authorized!' });
	}
}

exports.check = [
	check('apiId', 'apiId is required.').notEmpty(),
	check('imdbId', 'imdbId is required.').notEmpty(),
	check('title', 'title is required.').notEmpty(),
	check('personalRate', 'personalRate is required.').notEmpty(),
	check('isWatched', 'isWatched is required.').notEmpty().isBoolean(),
];
