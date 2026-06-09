/**
 * @fileoverview JSDoc type definitions for EcoTrace AI domain objects.
 * Import these types in JSDoc @param and @returns annotations across the codebase.
 * @module utils/types
 */

/**
 * A logged emission activity record.
 *
 * @typedef {Object} Activity
 * @property {string} id - Unique identifier (Date.now().toString())
 * @property {'transport'|'food'|'energy'|'shopping'} category - Emission category
 * @property {string} activityType - Specific activity type key (e.g. 'car_petrol')
 * @property {number} quantity - Amount of activity
 * @property {string} unit - Unit of measurement (e.g. 'km', 'kg', 'kWh')
 * @property {string} timestamp - ISO 8601 timestamp of when logged
 */

/**
 * Aggregated emission statistics for a set of activities.
 *
 * @typedef {Object} EmissionStats
 * @property {number} total - Total kg CO2e across all categories
 * @property {{ transport: number, food: number, energy: number, shopping: number }} breakdown
 *   Per-category totals in kg CO2e
 */

/**
 * User profile data set during onboarding.
 *
 * @typedef {Object} UserProfile
 * @property {string} name - User's display name
 * @property {string} location - User's country or region key (e.g. 'india')
 * @property {number} dailyGoal - Daily CO2e goal in kg
 */

/**
 * Named emission level band derived from total kg CO2e.
 *
 * @typedef {'low'|'medium'|'high'|'very-high'} EmissionLevel
 */

/**
 * A single AI-generated carbon reduction tip.
 *
 * @typedef {Object} InsightTip
 * @property {string} tip - The actionable recommendation text
 * @property {'transport'|'food'|'energy'|'shopping'} category - Relevant category
 * @property {'low'|'medium'|'high'} impact - Estimated impact level
 * @property {string} saving - Human-readable estimated CO2e saving
 */
