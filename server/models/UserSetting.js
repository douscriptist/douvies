const mongoose = require('mongoose');

const UserSettingSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	email: { type: String, ref: 'user' },
	username: { type: String, ref: 'user', unique: true },
	darkMode: { type: Boolean, default: false },
	hideFavourites: { type: Boolean, default: false },
	hideProfile: { type: Boolean, default: false },
	favourites: [
		{
			id: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'movie'
			},
			apiId: { type: String, required: true, ref: 'movie' },
			title: { type: String, required: true, ref: 'movie' }
		}
	],
	date: { type: Date, default: Date.now }
});

module.exports = Profile = mongoose.model('user-setting', UserSettingSchema);
