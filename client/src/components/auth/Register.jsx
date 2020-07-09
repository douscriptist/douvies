import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
	return (
		<div>
			<h1>Register</h1>
			<Link to='/'>Mainpage</Link>
			<p>
				Already have an account? <Link to='login'>Login.</Link>
			</p>
		</div>
	);
};

export default Register;
