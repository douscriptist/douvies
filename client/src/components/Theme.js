import React from 'react';
import { connect } from 'react-redux';

import themes from '../theme/theme';
import { setTheme } from '../redux/actions/theme';

const Theme = ({ onSelectTheme }) => {
	return (
		<>
			<p>Themes</p>
			<Themes themes={themes} onSelect={(theme) => onSelectTheme(theme)} />
		</>
	);
};

export default connect(
	{},
	{
		onSelectTheme: setTheme,
	}
)(Theme);
