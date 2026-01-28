import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { StateProvider } from './helpers';


import './index.css';
import HomePage from './pages/HomePage';
import SpadesCalculator from './pages/SpadesCalculator';
import { customTheme } from './customTheme';



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


