import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import ThemeContext from '../../theme/theme-context';

import Nav from './Nav';

import { dark, light } from '../../theme/theme-context';

const Landing = ({ theme: { theme } }) => {
	const [mode, setMode] = useState(light);

	useEffect(() => {
		if (theme === 'dark') {
			setMode(light);
		} else {
			setMode(dark);
		}
	}, [theme]);

	// theme.theme === 'dark' ? dark : light;

	return (
		<div style={mode}>
			<h1>Landing</h1>
			<Nav />
			<p>{JSON.stringify(theme)}</p>
		</div>
	);
};

Landing.propTypes = {
	theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	theme: state.theme,
});

export default connect(mapStateToProps, {})(Landing);
