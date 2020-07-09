import React, { useContext } from 'react';

import ThemeContext from '../../theme/theme-context';

import Nav from './Nav';

const Landing = ({ toggleTheme }) => {
	const theme = useContext(ThemeContext);

	return (
		<div style={theme}>
			<h1>Landing</h1>
			<Nav changeTheme={toggleTheme} />
			<p>{JSON.stringify(theme)}</p>
		</div>
	);
};

export default Landing;
