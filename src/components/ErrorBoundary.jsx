/**
 * @fileoverview React error boundary catching render-tree errors with a friendly recovery UI.
 * @module components/ErrorBoundary
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * React error boundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the application.
 */
export default class ErrorBoundary extends React.Component {
  /**
   * Initializes the error boundary component state.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Derives error state from an uncaught render-tree exception.
   *
   * @returns {{ hasError: boolean }} State update mapping
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * Invoked after an error has been thrown by a descendant component.
   *
   * @param {Error} error - The error that was thrown
   * @param {React.ErrorInfo} info - An object containing info about the component stack
   */
  componentDidCatch(error, info) {
    // Log to console only — never expose raw error details in the UI
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  /**
   * Renders fallback UI if an error is caught, otherwise renders children.
   *
   * @returns {React.ReactNode}
   */
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

ErrorBoundary.displayName = 'ErrorBoundary';

