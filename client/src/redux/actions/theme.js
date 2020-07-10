// /redux/actions/config.js
export const THEME_SET = 'THEME_SET';

export const setTheme = (theme) => ({
	type: THEME_SET,
	payload: theme,
});
