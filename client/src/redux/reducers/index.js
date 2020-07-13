import { combineReducers } from 'redux';
import theme from './theme';
import alert from './alert';

export default combineReducers({
	theme,
	alert,
});
