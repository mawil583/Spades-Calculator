
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from './components/ui/provider';
import { StateProvider } from './helpers';


import './index.css';
import HomePage from './pages/HomePage';
import SpadesCalculator from './pages/SpadesCalculator';



import { Toaster } from './components/ui/toaster';


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
  <Provider>
    <StateProvider>
      <RouterProvider router={router} />
      <Toaster />
    </StateProvider>
  </Provider>
);


