import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { checkRequiredEnvVars } from './utils/security';

// Run environment checks on app mount
checkRequiredEnvVars();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
