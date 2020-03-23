const mongoose = require('mongoose');

const SerieSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	apiId: { type: String, required: true },
	imdbId: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String },
	type: { type: String },
	yearFrom: { type: Date, required: true },
	yearTo: { type: Date },
	seasons: { type: Number },
	isFinished: { type: Boolean, required: true, default: false },
	isFinalled: { type: Boolean, required: true },
	isWatched: { type: Boolean, required: true },
	personalRate: { type: String, required: true },
	imdb: { type: Number },
	language: { type: String, default: 'English' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	posterURL: { type: String, default: null }
});

module.exports = User = mongoose.model('serie', SerieSchema);
