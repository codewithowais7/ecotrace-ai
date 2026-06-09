/**
 * @fileoverview Root application component with providers, routing, and lazy-loaded feature pages.
 * @module App
 */

import { lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AppProvider, AppContext } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import SkipLink from './components/layout/SkipLink';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// ─── Lazy-loaded feature pages ────────────────────────────────────────────────

const OnboardingPage = lazy(() => import('./features/onboarding/OnboardingPage'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const InsightsPage = lazy(() => import('./features/insights/InsightsPage'));
const CalculatorPage = lazy(() => import('./features/calculator/CalculatorPage'));

// ─── Suspense fallback ────────────────────────────────────────────────────────

/**
 * Full-screen loading spinner rendered during route code-split chunk loads.
 *
 * @returns {JSX.Element} The rendered page-level loading indicator
 */
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <LoadingSpinner message="Loading page..." size="lg" />
    </div>
  );
}

// ─── Protected route ──────────────────────────────────────────────────────────

/**
 * Redirects unauthenticated users (onboarding not complete) to the home page.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content rendered when the user is authenticated
 * @returns {JSX.Element} Children or a redirect to the onboarding page
 */
function ProtectedRoute({ children }) {
  const { onboardingComplete } = useContext(AppContext);
  return onboardingComplete ? children : <Navigate to="/" replace />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// ─── App ──────────────────────────────────────────────────────────────────────

/**
 * Root application component. Sets up global providers, routing, lazy-loaded feature pages,
 * and protected routes requiring completed onboarding.
 *
 * @returns {JSX.Element} The fully-composed application tree
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#1a1a2e] text-white">
            <SkipLink />
            <Header />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public */}
                <Route path="/" element={<OnboardingPage />} />

                {/* Protected */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calculator"
                  element={
                    <ProtectedRoute>
                      <CalculatorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/insights"
                  element={
                    <ProtectedRoute>
                      <InsightsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

PageLoader.displayName = 'PageLoader';
ProtectedRoute.displayName = 'ProtectedRoute';
App.displayName = 'App';

