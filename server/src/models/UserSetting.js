const mongoose = require('mongoose');

const UserSettingSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	darkMode: { type: Boolean, default: false },
	hideFavourites: { type: Boolean, default: false },
	hideProfile: { type: Boolean, default: false },
	movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movie' }],
	series: [{ type: mongoose.Schema.Types.ObjectId, ref: 'serie' }],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date }
});

module.exports = UserSetting = mongoose.model(
	'user-setting',
	UserSettingSchema
);