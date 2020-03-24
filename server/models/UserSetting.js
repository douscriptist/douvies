const mongoose = require('mongoose');

const UserSettingSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	email: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	username: { type: mongoose.Schema.Types.ObjectId, ref: 'user', unique: true },
	darkMode: { type: Boolean, default: false },
	hideFavourites: { type: Boolean, default: false },
	hideProfile: { type: Boolean, default: false },
	favourites: [
		{
			movie: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'movie'
			},
			serie: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'serie'
			}
		}
	],
	date: { type: Date, default: Date.now }
});

module.exports = UserSetting = mongoose.model(
	'user-setting',
	UserSettingSchema
);
