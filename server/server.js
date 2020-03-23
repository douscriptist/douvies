const express = require('express');
const connectDB = require('./utils/Database');
const app = express();

// cors?

// DB CONNECTION
connectDB();

// INIT MIDDLEWARES
app.use(express.json());

// TEST ROUTE
app.get('/', (req, res) => {
	res.status(202).json({ msg: 'Main' });
});

// ROUTES
app.use('/douvies/users', require('./routes/douvies/users'));
app.use('/douvies/movies', require('./routes/douvies/movies'));
app.use('/douvies/series', require('./routes/douvies/series'));
app.use('/douvies/profile', require('./routes/douvies/profile'));
app.use('/douvies/search-list', require('./routes/douvies/search-list'));
app.use('/douvies/auth', require('./routes/douvies/auth'));

// LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
