import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import store from './Redux/store';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import SpadesCalculator from './pages/SpadesCalculator';
import SpadesCalculator from './pages/index';

ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SpadesCalculator />} />
          <Route path='spades-calculator' element={<SpadesCalculator />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
