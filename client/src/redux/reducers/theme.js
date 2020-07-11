// /redux/reducers/config.js
import { THEME_SET } from '../actions/config';

export const SET_THEME_DARK = 'SET_THEME_DARK';
export const SET_THEME_LIGHT = 'SET_THEME_LIGHT';

const defaultState = {
	theme: 'default',
};

// const initialState = [];

export default (state = defaultState, action) => {
	const { type, payload } = action;

	switch (type) {
		case SET_THEME_DARK:
			return { ...state, theme: payload };

		case SET_THEME_LIGHT:
			return { ...state, theme: payload };

		default:
			return state;
	}
};
