import { createContext } from 'react';

export const themes = {
	dark: {
		color: 'white',
		background: 'black',
	},
	light: {
		color: 'black',
		background: 'white',
	},
};

const ThemeContext = createContext(themes.dark);

export default ThemeContext;
