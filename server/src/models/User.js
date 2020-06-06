const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required.'],
	},
	username: {
		type: String,
		required: [true, 'Username is required.'],
		unique: true,
	},
	email: {
		type: String,
		required: [true, 'Email is required.'],
		unique: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please add a valid email.',
		],
	},
	password: {
		type: String,
		required: [true, 'Password is required.'],
		minlength: 6,
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Reverse populate with virtuals
UserSchema.virtual('settings', {
	ref: 'Profile',
	localField: '_id',
	foreignField: 'user',
	justOne: true,
});

// Tranforms the first characters of each names
UserSchema.pre('save', function (next) {
	let tempName = '';
	this.name
		.trim()
		.split(' ')
		.forEach(
			(el) => (tempName += el.charAt(0).toUpperCase() + el.slice(1) + ' ')
		);
	this.name = tempName.trim();
	next();
});

// Encrypt password using bcrypt before save
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10); // Generated Salt
	this.password = await bcrypt.hash(this.password, salt); // Hashed password
	next();
});

// Sign JWT and Return Token
UserSchema.methods.getSignedJWTToken = function () {
	// const payload = {
	// 	user: {
	// 		id: this._id,
	// 	},
	// };
	const payload = {
		id: this._id,
	};
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE_TIME,
	});
};

// Match user entered password to hashed password in db
UserSchema.methods.isMatchedPassword = async function (passwordInput) {
	return await bcrypt.compare(passwordInput, this.password);
};

// Generate & Hash password token
UserSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString('hex'); // Generate token

	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex'); // Hash Token & Set to resetPasswordToken field in db

	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Set Expire Time for Token

	return resetToken;
};

module.exports = User = mongoose.model('user', UserSchema);
