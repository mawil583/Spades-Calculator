import { createStore } from 'redux';
import rootReducer from './rootReducer';

const reduxDevtools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(rootReducer, reduxDevtools);

// store gets imported in client/src/index.js and gets passed to the <App /> component via the <Provider />
export default store;