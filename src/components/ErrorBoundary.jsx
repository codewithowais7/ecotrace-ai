/**
 * Error boundary — catches render-tree errors and shows a friendly recovery UI.
 * Must be a class component because React error boundaries require lifecycle methods.
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log to console only — never expose raw error details in the UI
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          aria-live="assertive"
          className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center"
        >
          <span aria-hidden="true" className="text-6xl">
            🌿
          </span>
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="text-slate-400 max-w-sm">
            We had trouble loading this section. Your data is safe — please try reloading.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:outline-none"
          >
            Reload page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
