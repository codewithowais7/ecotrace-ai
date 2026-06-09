/**
 * @fileoverview Global application context managing activities, user profile, and AI insights.
 * @module context/AppContext
 */

/** @typedef {import('../utils/types').Activity} Activity */
/** @typedef {import('../utils/types').EmissionStats} EmissionStats */
/** @typedef {import('../utils/types').EmissionLevel} EmissionLevel */
/** @typedef {import('../utils/types').UserProfile} UserProfile */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';

import {
  calculateTotalEmissions,
  getEmissionLevel,
  calculateGoalPercentage,
} from '../utils/calculator';
import { sanitizeFormData } from '../utils/sanitizers';
import { getStorageItem, setStorageItem } from '../utils/storage';

// ─── Storage keys ────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  ACTIVITIES: 'ecotrace_activities',
  USER_PROFILE: 'ecotrace_user_profile',
  ONBOARDING: 'ecotrace_onboarding_complete',
  INSIGHTS: 'ecotrace_insights',
};

// ─── Initial state ────────────────────────────────────────────────────────────

const DEFAULT_USER_PROFILE = {
  name: '',
  location: 'india',
  dailyGoal: 13.4,
};

function buildInitialState() {
  return {
    activities: getStorageItem(STORAGE_KEYS.ACTIVITIES, []),
    userProfile: getStorageItem(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER_PROFILE),
    onboardingComplete: getStorageItem(STORAGE_KEYS.ONBOARDING, false),
    insights: getStorageItem(STORAGE_KEYS.INSIGHTS, []),
  };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

const ActionTypes = {
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  REMOVE_ACTIVITY: 'REMOVE_ACTIVITY',
  CLEAR_ACTIVITIES: 'CLEAR_ACTIVITIES',
  UPDATE_USER_PROFILE: 'UPDATE_USER_PROFILE',
  SET_ONBOARDING_COMPLETE: 'SET_ONBOARDING_COMPLETE',
  SET_INSIGHTS: 'SET_INSIGHTS',
};

function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_ACTIVITY:
      return { ...state, activities: [...state.activities, action.payload] };

    case ActionTypes.REMOVE_ACTIVITY:
      return {
        ...state,
        activities: state.activities.filter((a) => a.id !== action.payload),
      };

    case ActionTypes.CLEAR_ACTIVITIES:
      return { ...state, activities: [] };

    case ActionTypes.UPDATE_USER_PROFILE:
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };

    case ActionTypes.SET_ONBOARDING_COMPLETE:
      return { ...state, onboardingComplete: action.payload };

    case ActionTypes.SET_INSIGHTS:
      return { ...state, insights: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AppContext = createContext(null);

/**
 * Application-wide context provider.
 * Wraps the entire app to provide shared state and actions.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, buildInitialState);

  // ── Persist state slices to localStorage on change ─────────────────────────

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTIVITIES, state.activities);
  }, [state.activities]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.USER_PROFILE, state.userProfile);
  }, [state.userProfile]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ONBOARDING, state.onboardingComplete);
  }, [state.onboardingComplete]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.INSIGHTS, state.insights);
  }, [state.insights]);

  // ── Computed values ────────────────────────────────────────────────────────

  const dailyStats = useMemo(() => calculateTotalEmissions(state.activities), [state.activities]);

  const emissionLevel = useMemo(() => getEmissionLevel(dailyStats.total), [dailyStats.total]);

  const goalProgress = useMemo(
    () => calculateGoalPercentage(dailyStats.total, state.userProfile.dailyGoal),
    [dailyStats.total, state.userProfile.dailyGoal]
  );

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Sanitize, stamp, and add an activity to state.
   *
   * @param {Object} activityData - Raw form data for the activity.
   */
  const addActivity = useCallback((activityData) => {
    const sanitized = sanitizeFormData(activityData);
    const activity = {
      ...sanitized,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: ActionTypes.ADD_ACTIVITY, payload: activity });
  }, []);

  /**
   * Remove an activity by its id.
   *
   * @param {string} id - The activity id to remove.
   */
  const removeActivity = useCallback((id) => {
    dispatch({ type: ActionTypes.REMOVE_ACTIVITY, payload: id });
  }, []);

  /**
   * Clear all activities for the current day.
   */
  const clearActivities = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ACTIVITIES });
  }, []);

  /**
   * Merge partial updates into the user profile.
   *
   * @param {Partial<{ name: string, location: string, dailyGoal: number }>} updates
   */
  const updateUserProfile = useCallback((updates) => {
    dispatch({ type: ActionTypes.UPDATE_USER_PROFILE, payload: updates });
  }, []);

  /**
   * Mark onboarding as complete or incomplete.
   *
   * @param {boolean} val
   */
  const setOnboardingComplete = useCallback((val) => {
    dispatch({ type: ActionTypes.SET_ONBOARDING_COMPLETE, payload: Boolean(val) });
  }, []);

  /**
   * Replace the AI insights cache with a new set of tips.
   *
   * @param {Array} tips
   */
  const setInsights = useCallback((tips) => {
    dispatch({ type: ActionTypes.SET_INSIGHTS, payload: Array.isArray(tips) ? tips : [] });
  }, []);

  // ── Context value ──────────────────────────────────────────────────────────

  const contextValue = useMemo(
    () => ({
      // State
      activities: state.activities,
      userProfile: state.userProfile,
      onboardingComplete: state.onboardingComplete,
      insights: state.insights,
      // Computed
      dailyStats,
      emissionLevel,
      goalProgress,
      // Actions
      addActivity,
      removeActivity,
      clearActivities,
      updateUserProfile,
      setOnboardingComplete,
      setInsights,
    }),
    [
      state.activities,
      state.userProfile,
      state.onboardingComplete,
      state.insights,
      dailyStats,
      emissionLevel,
      goalProgress,
      addActivity,
      removeActivity,
      clearActivities,
      updateUserProfile,
      setOnboardingComplete,
      setInsights,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Consume the AppContext. Must be used inside an AppProvider.
 *
 * @returns {Object} The full context value.
 * @throws {Error} When called outside of an AppProvider.
 */
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}

export default AppContext;
