import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadTheme, setTheme } from './redux/actions/theme';
import AlertTry from './components/AlertTry';
// import { loadUser } from './actions/auth';
// import setAuthToken from './utils/setAuthToken';

const App = () => {
	useEffect(() => {
		store.dispatch(loadTheme());
		// store.dispatch(loadUser());
	}, []);

	const setThemeLight = () => {
		store.dispatch(setTheme());
	};

	return (
		<Provider store={store}>
			<Router>
				<Route exact path='/' component={Landing} />
				<Switch>
					<Route exact path='/login' component={Login} />
					<Route exact path='/register' component={Register} />
					<Route exact path='/alert' component={AlertTry} />
				</Switch>
			</Router>
			<button onClick={setThemeLight}> Change Theme </button>
		</Provider>
	);
};

export default App;
