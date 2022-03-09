import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import apiMiddleware from "./apiMiddleware.js";
import rootReducer from "./rootReducer";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(apiMiddleware))
);

// store gets imported in client/src/index.js and gets passed to the <App /> component via the <Provider />
export default store;
