// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UrlProvider } from './context/UrlContext'; // Import the provider
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UrlProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UrlProvider>
  </React.StrictMode>
);