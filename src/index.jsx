import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { StateProvider } from './helpers';
import * as serviceWorkerRegistration from './services/serviceWorkerRegistration';

import './index.css';
import HomePage from './pages/HomePage';
import SpadesCalculator from './pages/SpadesCalculator';
import { customTheme } from './customTheme';

// Create a global event system for service worker updates
window.serviceWorkerUpdateEvent = {
  listeners: {},
  addEventListener: function (event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },
  removeEventListener: function (event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  },
  dispatchEvent: function (event) {
    if (this.listeners[event.type]) {
      this.listeners[event.type].forEach((callback) => callback(event));
    }
  },
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: 'spades-calculator',
    element: <SpadesCalculator />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ChakraProvider theme={customTheme}>
    <StateProvider>
      <RouterProvider router={router} />
    </StateProvider>
  </ChakraProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Dispatch a custom event that UpdateNotification can listen for
    const updateEvent = {
      type: 'serviceWorkerUpdate',
      detail: { registration },
    };
    window.serviceWorkerUpdateEvent.dispatchEvent(updateEvent);
  },
});
