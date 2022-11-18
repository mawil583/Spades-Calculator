import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { StateProvider } from './helpers/GlobalContext';

import './index.css';
import * as serviceWorker from './serviceWorker';
import LandingPage from './pages/LandingPage';
import SpadesCalculator from './pages/SpadesCalculator';

// const theme = extendTheme({
//   styles: {
//     global: {
//       // styles for the `body`
//       Button: {
//         // _hover & _active do not work here as expected even though its written according to their documentation. However other properties like bg: 'white.400' work as expected. Reach out for bug report.
//         // https://chakra-ui.com/docs/styled-system/style-props
//         // https://chakra-ui.com/docs/styled-system/customize-theme
//         _hover: {
//           textDecoration: 'underline',
//         },
//         _active: {
//           bgColor: 'transparent',
//         }
//       },
//     },
//   },
// })

ReactDOM.render(
  <ChakraProvider /*theme={theme}*/>
    <StateProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='spades-calculator' element={<SpadesCalculator />} />
        </Routes>
      </BrowserRouter>
    </StateProvider>
  </ChakraProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
