import React from 'react';
import { Link } from 'react-router-dom';

function Nav() {
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
		</div>
	);
}

export default Nav;
