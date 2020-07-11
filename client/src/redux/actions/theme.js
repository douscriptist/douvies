// /redux/actions/config.js
export const THEME_SET = 'THEME_SET';

export const SET_THEME_DARK = 'SET_THEME_DARK';
export const SET_THEME_LIGHT = 'SET_THEME_LIGHT';

const initialState = [];

export const setTheme = (theme) => (dispatch) => {
	dispatch({
		type: SET_THEME_LIGHT,
		payload: { theme },
	});
};
