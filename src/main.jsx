/**
 * @fileoverview Application entry point \u2014 mounts the React app and runs environment checks.
 * @module main
 */
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
