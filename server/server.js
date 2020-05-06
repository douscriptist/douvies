const express = require('express');
const connectDB = require('./utils/Database');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
// cors?

const errorHandler = require('./middlewares/errorHandler');

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

// TEST ROUTE
app.get('/', (req, res) => {
	res.status(202).json({ success: true, msg: 'Main' });
});

// ROUTES
app.use('/douvies/users', require('./routes/douvies/users'));
app.use('/douvies/movies', require('./routes/douvies/movies'));
app.use('/douvies/series', require('./routes/douvies/series'));
app.use('/douvies/profile', require('./routes/douvies/profile'));
app.use('/douvies/auth', require('./routes/douvies/auth'));

// Custom Error Handler for express next()
// app.use(errorHandler);

// LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
// 	console.log(`Error: ${err.message}`.bgRed.bold);
// 	// Close server & exit process
// 	server.close(() => process.exit(1));
// });
