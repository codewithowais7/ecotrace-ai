import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateEmission, formatEmission } from '../utils/calculator';
import { validateQuantity } from '../utils/validators';
import { generateId } from '../utils/security';

/**
 * Hook providing calculator actions for adding/removing emission entries
 */
export function useCalculator() {
  const { state, dispatch } = useAppContext();

  /**
   * Add an emission entry
   * @param {Object} entry
   * @param {string} entry.category
   * @param {string} entry.subcategoryId
   * @param {string} entry.label
   * @param {number} entry.quantity
   * @param {string} entry.unit
   * @param {string} [entry.date]
   * @returns {{ success: boolean, error?: string }}
   */
  const addEntry = useCallback(
    ({ category, subcategoryId, label, quantity, unit, date }) => {
      const validation = validateQuantity(quantity);
      if (!validation.valid) return { success: false, error: validation.error };

      let emissions;
      try {
        emissions = calculateEmission(subcategoryId, parseFloat(quantity));
      } catch (err) {
        return { success: false, error: err.message };
      }

      const entry = {
        id: generateId(),
        category,
        subcategoryId,
        label,
        quantity: parseFloat(quantity),
        unit,
        emissions,
        formattedEmissions: formatEmission(emissions),
        date: date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_EMISSION', payload: entry });
      return { success: true };
    },
    [dispatch]
  );

  /**
   * Remove an emission entry by id
   * @param {string} id
   */
  const removeEntry = useCallback(
    (id) => {
      dispatch({
        type: 'SET_EMISSIONS',
        payload: state.emissions.filter((e) => e.id !== id),
      });
    },
    [dispatch, state.emissions]
  );

  /**
   * Clear all emission entries
   */
  const clearAll = useCallback(() => {
    dispatch({ type: 'SET_EMISSIONS', payload: [] });
  }, [dispatch]);

  const totalEmissions = state.emissions.reduce((sum, e) => sum + e.emissions, 0);

  return {
    entries: state.emissions,
    totalEmissions,
    formattedTotal: formatEmission(totalEmissions),
    addEntry,
    removeEntry,
    clearAll,
  };
}
