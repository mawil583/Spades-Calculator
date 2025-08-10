import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { StateProvider } from './helpers';

import './index.css';
// import * as serviceWorker from './services';
import * as serviceWorkerRegistration from './services/serviceWorkerRegistration';
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
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // This will be called when a new service worker is available
    console.log('New content is available and will be used when all tabs for this page are closed.');
  },
  onSuccess: (registration) => {
    console.log('Content is cached for offline use.');
  },
});
