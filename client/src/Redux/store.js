import { createStore, applyMiddleware, compose } from 'redux';

import apiMiddleware from './apiMiddleware.js';
import rootReducer from './rootReducer';

// The reduxDevTools browser extension says I have to pass this into createStore to use it
const reduxDevtools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
    rootReducer,
    compose(applyMiddleware(apiMiddleware()), reduxDevtools)
);

// store gets imported in client/src/index.js and gets passed to the <App /> component via the <Provider />
export default store;