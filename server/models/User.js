const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	lastName: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	avatar: { type: String },
	createdAt: { type: Date, default: Date.now },
	settings: { type: mongoose.Schema.Types.ObjectId, ref: 'user-setting' }
});

module.exports = User = mongoose.model('user', UserSchema);