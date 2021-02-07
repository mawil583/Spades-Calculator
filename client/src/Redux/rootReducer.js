import { combineReducers } from "redux";

import { counter } from "./Counter/reducers";
import message from "./HelloWorld/reducers";
import blogPosts from "./BlogPosts/reducers";

const rootReducer = combineReducers({
  counter,
  message,
  blogPosts,
});

export default rootReducer;
