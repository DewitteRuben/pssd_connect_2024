import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  BrowserRouter,
} from "react-router-dom";

import { ChakraProvider, Container } from '@chakra-ui/react'
import App from './pages/App/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Container maxW='1600px' minHeight='100vh'>
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
      </Container>
    </ChakraProvider>
  </React.StrictMode>

)
