import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { StateProvider } from './helpers';
import * as serviceWorkerRegistration from './services/serviceWorkerRegistration';

import './index.css';
import HomePage from './pages/HomePage';
import SpadesCalculator from './pages/SpadesCalculator';
import { customTheme } from './customTheme';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ChakraProvider theme={customTheme}>
    <StateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="spades-calculator" element={<SpadesCalculator />} />
        </Routes>
      </BrowserRouter>
    </StateProvider>
  </ChakraProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
