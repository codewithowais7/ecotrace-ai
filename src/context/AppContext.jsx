import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext(null);

const initialState = {
  user: null,
  emissions: [],
  settings: {
    theme: 'dark',
    unit: 'kg',
  },
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_EMISSION':
      return { ...state, emissions: [...state.emissions, action.payload] };
    case 'SET_EMISSIONS':
      return { ...state, emissions: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const stored = localStorage.getItem('ecotrace-state');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.emissions) {
          dispatch({ type: 'SET_EMISSIONS', payload: parsed.emissions });
        }
      } catch {
        // ignore invalid stored state
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecotrace-state', JSON.stringify({ emissions: state.emissions }));
  }, [state.emissions]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
