import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const App = () => (
	<Router>
		<Route exact path='/' component={Landing} />
		<Switch>
			<Route exact path='/login' component={Login} />
			<Route exact path='/register' component={Register} />
		</Switch>
	</Router>
);

export default App;
