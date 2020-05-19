const mongoose = require('mongoose');
const slugify = require('slugify');

const MovieSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required.'],
			unique: true,
			trim: true,
			maxlength: [50, 'Title cannot be longer than 50 characters.'],
		},
		slug: String,
		description: {
			type: String,
			required: [true, 'Description is required.'],
			maxlength: [500, 'Description cannot be longer than 500 characters'],
		},
		director: { type: String, trim: true },
		apiId: {
			type: String,
			required: [true, 'Api ID is required.'],
		},
		imdbId: {
			type: String,
			required: [true, 'IMDB ID is required.'],
			unique: true,
		},
		imdbUrl: {
			type: String,
			match: [
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
				'Please use a valid URL with HTTP or HTTPS',
			],
		},
		posterURL: {
			type: String,
			match: [
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
				'Please use a valid URL with HTTP or HTTPS',
			],
		},
		imdbRate: {
			type: Number,
			min: [1, 'Rating must be at least 1'],
			max: [10, 'Rating must can not be more than 10'],
		},
		imdbVotes: Number,
		genres: {
			type: [String],
			enum: [
				'Action',
				'Adventure',
				'Animation',
				'Biography',
				'Comedy',
				'Crime',
				'Documentary',
				'Drama',
				'Family',
				'Fantasy',
				'Film-Noir',
				'Game-Show',
				'History',
				'Horror',
				'Music',
				'Musical',
				'Mystery',
				'News',
				'Reality-TV',
				'Romance',
				'Sci-Fi',
				'Sport',
				'Talk-Show',
				'Thriller',
				'War',
				'Western',
			],
		},
		language: String,
		releaseDate: Date,
		year: Number,
		runtime: String,
		averageRating: Number,
		personalRate: Number,
		personalComments: {
			type: String,
			maxlength: [100, 'Comment cannot be longer than 100 characters'],
		},
		personalPref: {
			type: [String],
			required: [true, 'Movie definition is required.'],
			enum: [
				'Captain Phillips',
				'Waste of time',
				'Kader',
				'Naysu',
				'Watchable',
				'Ehh',
				'Will be added more...',
			],
		},
		isWatched: {
			type: Boolean,
			required: true,
			default: true,
		},
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
	},
	{
		// id: false,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Create movie slug from the title
MovieSchema.pre('save', function (next) {
	this.slug = slugify(this.title, { lower: true });
	next();
});

module.exports = User = mongoose.model('movie', MovieSchema);
