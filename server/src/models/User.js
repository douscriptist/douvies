const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: {
		first: { type: String, required: true },
		last: { type: String, required: true }
	},
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	avatar: { type: String },
	createdAt: { type: Date, default: Date.now },
	isActive: { type: Boolean, default: true },
	settings: { type: mongoose.Schema.Types.ObjectId, ref: 'user-setting' }
});

module.exports = User = mongoose.model('user', UserSchema);
