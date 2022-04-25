/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ChakraProvider, ColorModeScript, Box} from '@chakra-ui/react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import theme from './theme';
import './index.css';

import App from './app';

import store from './store/configureStore';

import reportWebVitals from './reportWebVitals';

import * as serviceWorker from './serviceWorker';

const MOUNT_NODE = document.getElementById('root');


ReactDOM.render(
  // <StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Box>
          <BrowserRouter>
            {/* <Routes>
              <Route path='/*' element={<App />} />
            </Routes> */}
            <App />
          </BrowserRouter>
        </Box>
      </ChakraProvider>
    </Provider>
  // </StrictMode>
  ,
  MOUNT_NODE,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
