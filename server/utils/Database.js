const mongoose = require('mongoose');
require('dotenv').config();

// FIX: CHECK NODE_ENV ?
const dbURI = process.env.MONGODB_URI_LOCAL;

const connectDB = async () => {
	try {
		await mongoose.connect(dbURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
		console.log('MongoDB connected!');
	} catch (err) {
		console.error(err.message);
		//EXIT PROCESS WITH FAILURE
		process.exit(1);
	}
};

module.exports = connectDB;
