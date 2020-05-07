const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
// cors?

const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');

// Load env file
dotenv.config({ path: './config/config.env' });

// DB CONNECTION
connectDB();

const app = express();

// INIT MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sanitize Data
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS // If API is public
app.use(cors());

// Morgan Logger
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Set static folder for upload images etc.
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/douvies/auth', require('./routes/auth.routes'));
app.use('/douvies/users', require('./routes/users.routes'));
app.use('/douvies/movies', require('./routes/movies.routes'));
app.use('/douvies/series', require('./routes/series.routes'));
app.use('/douvies/profile', require('./routes/profiles.routes'));

// Custom Error Handler for express next()
// app.use(errorHandler);

// LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(
		`Server running in "${process.env.NODE_ENV}" mode on port ${PORT}`.blue.bold
	);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.bgRed.bold);
	// Close server & exit process
	server.close(() => process.exit(1));
});
