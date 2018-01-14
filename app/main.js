import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Cancellation from './containers/cancellation/Cancellation.js';
import { Provider } from 'react-redux';
import { store } from './store.js';

ReactDOM.render((
	<Provider store={ store }>
		<Cancellation />
	</Provider>
), document.getElementById('root'));
