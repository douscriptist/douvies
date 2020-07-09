import React from 'react';
import { Link } from 'react-router-dom';

function Nav({ changeTheme }) {
	return (
		<div>
			<ul>
				<li>
					<Link to='/login'>Login</Link>
				</li>
				<li>
					<Link to='/register'>Register</Link>
				</li>
			</ul>

			<button onClick={changeTheme}> Change Theme </button>
		</div>
	);
}

export default Nav;
