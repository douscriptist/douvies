const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../utils/auth');

const Serie = require('../../models/Serie');
const User = require('../../models/User');

// @route   POST douvies/series
// @desc    Post a serie
// @access  Private
router.post(
	'/',
	[
		auth,
		check('apiId', 'apiId is required.').notEmpty(),
		check('imdbId', 'imdbId is required.').notEmpty(),
		check('title', 'title is required.').notEmpty(),
		check('yearFrom', 'yearFrom is required.').notEmpty(),
		check('personalRate', 'personalRate is required.').notEmpty(),
		check('isFinished', 'isFinished is required.')
			.notEmpty()
			.isBoolean(),
		check('isFinalled', 'isFinalled is required.')
			.notEmpty()
			.isBoolean(),
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
				posterURL
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
				user: req.user.id
			});

			const serie = await newSerie.save();
			res.json(serie);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route   GET douvies/series
// @desc    Maybe Upcoming?
// @access  Public?
router.get('/', auth, async (req, res) => {
	try {
		const series = await Serie.find();
		if (!series.length)
			return res.status(404).json({ msg: 'Series not found' });
		res.json(series);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Erro');
	}
});

// @route   GET douvies/series/:sid
// @desc    Get a serie
// @access  Private
router.get(
	'/:sid',
	/*auth,*/ async (req, res) => {
		try {
			const serie = await Serie.findById(req.params.sid);
			if (!serie)
				return res.status(404).json({ msg: 'Serie is not available!' });
			res.json(serie);
		} catch (err) {
			console.error(err.message);
			if (err.kind === 'ObjectId') {
				return res.status(404).json({ msg: 'Serie is not available!' });
			}
			res.status(500).send('Server Error');
		}
	}
);

// @route   DELETE douvies/series/:sid
// @desc    Delete a serie
// @access  Private
router.delete('/:sid', auth, async (req, res) => {
	try {
		const serie = await Serie.findById(req.params.sid);
		// Check if serie exists?
		if (!serie) {
			return res.status(404).json({ msg: 'Serie is not available!' });
		}

		// Check if ther right User requests?
		if (serie.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized!' });
		}

		await serie.remove();
		res.json({ msg: 'Serie removed succesfully!' });
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Serie is not available!' });
		}
		res.status(500).send('Server Error');
	}
});

module.exports = router;
