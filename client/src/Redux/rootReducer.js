import { combineReducers } from 'redux';

import { counter } from './Counter/reducers';
import message from './HelloWorld/reducers';

const rootReducer = combineReducers(
    { 
        counter,
        message
    }
);

export default rootReducer;