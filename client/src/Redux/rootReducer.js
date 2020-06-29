import { combineReducers } from 'redux';

import { counter } from './Counter/reducers';

const rootReducer = combineReducers(
    { counter, }
);

export default rootReducer;