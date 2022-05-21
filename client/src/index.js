import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import './index.css';
import * as serviceWorker from './serviceWorker';
import Names from './pages/Names';
import SpadesCalculator from './pages/SpadesCalculator';

ReactDOM.render(
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Names />} />
        <Route path='spades-calculator' element={<SpadesCalculator />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
