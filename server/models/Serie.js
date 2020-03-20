const mongoose = require('mongoose');

const SerieSchema = new mongoose.Schema({
	apiId: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String },
	type: { type: String },
	yearFrom: { type: Date, required: true },
	yearTo: { type: Date },
	seasons: { type: Number },
	isFinished: { type: Boolean, required: true, default: false },

	personalRate: { type: String, required: true },
	isWatched: { type: Boolean, required: true },
	imdb: { type: Number },
	language: { type: String, default: 'English' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date, default: Date.now }
});

module.exports = User = mongoose.model('serie', SerieSchema);
