import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';

import NotificationsManager from './NotificationsManager';
import tasksReducer from './store/reducers/tasks';
import AppNavigator from './navigation/AppNavigator';
import { init } from './helpers/db';

init()
	.then(() => {
		console.log('Initialized database');
	})
	.catch((err) => {
		console.log('Initializing db failed.');
		console.log(err);
	});

const rootReducer = combineReducers({
	tasks: tasksReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

/**
 * Funkcja służąca do załadowania czcionek
 * @returns {Promise}
 * @module Czcionki
 */
const fetchFonts = () => {
	return Font.loadAsync({
		'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
		'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
	});
};

/**
 * Główna funkcja aplikacji, która jest kontenerem wszystkich jej elementów.
 * @module Funkcja główna aplikacji
 */
export default function App() {
	const [fontLoaded, setFontLoaded] = useState(false);

	if (!fontLoaded) {
		return (
			<AppLoading
				startAsync={fetchFonts}
				onFinish={() => {
					setFontLoaded(true);
				}}
			/>
		);
	}

	return (
		<Provider store={store}>
			<NotificationsManager>
				<AppNavigator />
			</NotificationsManager>
		</Provider>
	);
}
