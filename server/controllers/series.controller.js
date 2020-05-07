const CustomError = require('../utils/CustomError');
const asyncHandler = require('../middlewares/asyncHandler');
const { check, validationResult } = require('express-validator');

const Serie = require('../models/Serie');
const User = require('../models/User');

// @route   GET douvies/series/favourites
// @desc    Get favourite series
// @access  Private
exports.getFavourites = asyncHandler(async (req, res) => {
	res.json({ success: true, msg: 'Favourite Series' });
	// try {
	// 	const series = await Serie.find({ user: req.user.id });
	// 	if (!series.length)
	// 		return res.status(404).json({ msg: 'Series not found' });
	// 	res.json(series);
	// } catch (err) {
	// 	console.error(err.message);
	// 	res.status(500).send('Server Erro');
	// }
});

// @route   POST douvies/series
// @desc    Post a serie
// @access  Private
exports.createSerie = asyncHandler(async (req, res) => {
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
			description,
			type,
			yearFrom,
			yearTo,
			seasons,
			personalRate,
			isWatched,
			isFinished,
			isFinalled,
			imdb,
			language,
			posterURL,
		} = req.body;

		const newSerie = new Serie({
			apiId,
			imdbId,
			title,
			description,
			type,
			yearFrom,
			yearTo,
			seasons,
			personalRate,
			isWatched,
			isFinished,
			isFinalled,
			imdb,
			language,
			posterURL,
			user: req.user.id,
		});

		const serie = await newSerie.save();
		res.json(serie);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// FIX: Here will be upcoming public
// FIX: For now, cuz of safety, returns user's series by private
// @route   GET douvies/series
// @desc    Maybe Upcoming?
// @access  Public?
exports.getSeries = asyncHandler(async (req, res) => {
	try {
		const series = await Serie.find({ user: req.user.id });
		if (!series.length)
			return res.status(404).json({ success: false, msg: 'Series not found' });
		res.json(series);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Erro');
	}
});
// LATER: This will be moved to profile api section
// exports.function('/', auth, async (req, res) => {
// 	try {
// 		const series = await Serie.find({ user: req.user.id });
// 		if (!series.length)
// 			return res.status(404).json({ msg: 'Series not found' });
// 		res.json(series);
// 	} catch (err) {
// 		console.error(err.message);
// 		res.status(500).send('Server Erro');
// 	}
// });

// @route   GET douvies/series/:sid
// @desc    Get a serie
// @access  Private
exports.getSerie = asyncHandler(async (req, res) => {
	try {
		const serie = await Serie.findById(req.params.sid);
		if (!serie)
			return res
				.status(404)
				.json({ success: false, msg: 'Serie is not available!' });
		res.json(serie);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ success: false, msg: 'Serie is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   PUT douvies/series/:sid
// @desc    Update a serie
// @access  Private
exports.updateSerie = asyncHandler(async (req, res) => {
	const updatedSerie = { ...req.body, updatedAt: Date.now() };
	console.log(updatedSerie);
	try {
		const isSerie = await Serie.findById(req.params.sid);
		if (!isAuth(isSerie, req, res)) {
			// const serie = await Serie.findOneAndUpdate(
			// 	{ _id: req.params.sid },
			// 	updatedSerie,
			// 	{ new: true }
			// );
			await isSerie.updateOne(updatedSerie);
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

// @route   DELETE douvies/series/:sid
// @desc    Delete a serie
// @access  Private
exports.deleteSerie = asyncHandler(async (req, res) => {
	try {
		const serie = await Serie.findById(req.params.sid);
		// Check if serie exists?
		if (!serie) {
			return res
				.status(404)
				.json({ success: false, msg: 'Serie is not available!' });
		}

		// Check if ther right User requests?
		if (serie.user.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ success: false, msg: 'User not authorized!' });
		}

		await serie.remove();
		res.json({ msg: 'Serie removed succesfully!' });
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ success: false, msg: 'Serie is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

function isAuth(param, req, res) {
	// Check if movie exists?
	if (!param) {
		return res
			.status(404)
			.json({ success: false, msg: 'Serie is not available!' });
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
	check('yearFrom', 'yearFrom is required.').notEmpty(),
	check('personalRate', 'personalRate is required.').notEmpty(),
	check('isFinished', 'isFinished is required.').notEmpty().isBoolean(),
	check('isFinalled', 'isFinalled is required.').notEmpty().isBoolean(),
	check('isWatched', 'isWatched is required.').notEmpty().isBoolean(),
];
