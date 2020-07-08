import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
	return (
		<div>
			<h1>Login</h1>
			<Link to='/'>Mainpage</Link>
			<p>
				Don't have an account? <Link to='register'>Register.</Link>
			</p>
		</div>
	);
};

export default Login;
