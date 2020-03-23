const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	apiId: { type: String, required: true },
	imdbId: { type: String, required: true },
	title: { type: String, required: true },
	director: { type: String },
	description: { type: String },
	type: { type: String },
	year: { type: Date },
	personalRate: { type: String, required: true },
	isWatched: { type: Boolean, required: true, default: true },
	imdb: { type: Number },
	language: { type: String, default: 'English' },
	posterURL: { type: String, default: null },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

module.exports = User = mongoose.model('movie', MovieSchema);
