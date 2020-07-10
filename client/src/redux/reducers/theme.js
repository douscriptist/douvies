// /redux/reducers/config.js
import { THEME_SET } from '../actions/config';

const defaultState = {
	theme: 'default',
};

export default (state = defaultState, action) => {
	switch (action.type) {
		case THEME_SET:
			return { ...state, theme: action.payload };
		default:
			return state;
	}
};
