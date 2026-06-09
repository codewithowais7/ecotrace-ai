import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<div className="min-h-screen flex items-center justify-center">
            <h1 className="text-4xl font-bold text-primary-500">EcoTrace AI</h1>
          </div>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
