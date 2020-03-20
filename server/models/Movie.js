const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
	apiId: { type: String, required: true },
	title: { type: String, required: true },
	director: { type: String },
	description: { type: String },
	type: { type: String },
	year: { type: Date },
	personalRate: { type: String, required: true },
	isWatched: { type: Boolean, required: true },
	imdb: { type: Number },
	language: { type: String, default: 'English' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date, default: Date.now }
});

module.exports = User = mongoose.model('movie', MovieSchema);
