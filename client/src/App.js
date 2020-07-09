import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import ThemeContext, { themes } from './theme/theme-context';

const App = () => {
	const [theme, setTheme] = useState(themes.dark);

	const toggleTheme = () => {
		theme === themes.dark ? setTheme(themes.light) : setTheme(themes.dark);
	};

	return (
		<ThemeContext.Provider value={theme}>
			<Router>
				<Route exact path='/' component={Landing} />
				<Switch>
					<Route exact path='/login' component={Login} />
					<Route exact path='/register' component={Register} />
				</Switch>
			</Router>
			<button onClick={toggleTheme}> Change Theme </button>
		</ThemeContext.Provider>
	);
};

export default App;
