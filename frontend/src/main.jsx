import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// This is the actual first line of code that runs in the browser.
// Everything else — routes, stores, pages — only exists because this
// file mounts <App /> into the <div id="root"> defined in index.html.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
