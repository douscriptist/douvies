import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import ThemeContext, { themes } from './theme/theme-context';

//Redux
import { Provider } from 'react-redux';
import store from './store';
// import { loadUser } from './actions/auth';
// import setAuthToken from './utils/setAuthToken';

const App = () => {
	const [theme, setTheme] = useState(themes.dark);

	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	const toggleTheme = () => {
		theme === themes.dark ? setTheme(themes.light) : setTheme(themes.dark);
	};

	return (
		<Provider store={store}>
			<Router>
				<Route exact path='/' component={Landing} />
				<Switch>
					<Route exact path='/login' component={Login} />
					<Route exact path='/register' component={Register} />
				</Switch>
			</Router>
			<button onClick={toggleTheme}> Change Theme </button>
		</Provider>
	);
};

export default App;
