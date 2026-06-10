/**
 * @fileoverview Activity logging form with validation, sanitization, and screen-reader announcements.
 * @module components/forms/ActivityForm
 */

import { useState } from 'react';
import PropTypes from 'prop-types';

import { useCalculator } from '../../hooks/useCalculator';
import { useAccessibility } from '../../hooks/useAccessibility';
import { ACTIVITY_CATEGORIES } from '../../constants/categories';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';

// ─── Activity option maps per category ──────────────────────────────────────

const TRANSPORT_OPTIONS = [
  { value: 'car_petrol', label: 'Car (Petrol)' },
  { value: 'car_diesel', label: 'Car (Diesel)' },
  { value: 'car_electric', label: 'Car (Electric)' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'bus', label: 'Bus' },
  { value: 'train', label: 'Train' },
  { value: 'flight_domestic', label: 'Domestic Flight' },
  { value: 'flight_international', label: 'International Flight' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'walking', label: 'Walking' },
];

const FOOD_OPTIONS = [
  { value: 'vegan_meal', label: 'Vegan Meal' },
  { value: 'vegetarian_meal', label: 'Vegetarian Meal' },
  { value: 'meat_meal', label: 'Meat Meal' },
  { value: 'beef', label: 'Beef' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'pork', label: 'Pork' },
  { value: 'fish', label: 'Fish' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'dairy', label: 'Dairy' },
];

const ENERGY_OPTIONS = [
  { value: 'electricity_india', label: 'Electricity (India grid)' },
  { value: 'lpg', label: 'LPG' },
  { value: 'natural_gas', label: 'Natural Gas' },
];

const SHOPPING_OPTIONS = [
  { value: 'clothing', label: 'Clothing (per item)' },
  { value: 'electronics', label: 'Electronics (per item)' },
  { value: 'furniture', label: 'Furniture (per item)' },
];

const OPTIONS_MAP = {
  transport: TRANSPORT_OPTIONS,
  food: FOOD_OPTIONS,
  energy: ENERGY_OPTIONS,
  shopping: SHOPPING_OPTIONS,
};

// ─── Unit labels per category ────────────────────────────────────────────────

const UNIT_MAP = {
  transport: 'km',
  food: 'kg / meals',
  energy: 'kWh / kg / m³',
  shopping: 'items',
};

const UNIT_VALUE_MAP = {
  transport: 'km',
  food: 'kg',
  energy: 'kWh',
  shopping: 'items',
};

// ─── Category select options ─────────────────────────────────────────────────

const CATEGORY_OPTIONS = ACTIVITY_CATEGORIES.map((c) => ({
  value: c.id,
  label: `${c.icon} ${c.label}`,
}));

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Form for logging a new carbon emission activity.
 * On successful submission, resets state and calls the optional onSuccess callback.
 *
 * @param {Object} props
 * @param {Function} [props.onSuccess] - Optional callback invoked with the logged Activity on success
 * @returns {JSX.Element} The rendered activity logging form
 */
export default function ActivityForm({ onSuccess = undefined }) {
  const { logActivity } = useCalculator();
  const { announceToScreenReader } = useAccessibility();

  const [category, setCategory] = useState('');
  const [activityType, setActivityType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dynamicOptions = OPTIONS_MAP[category] ?? [];
  const unitLabel = `Quantity (${UNIT_MAP[category] ?? 'units'})`;
  const unitValue = UNIT_VALUE_MAP[category] ?? 'units';

  function resetForm() {
    setCategory('');
    setActivityType('');
    setQuantity('');
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = {
      category,
      activityType,
      quantity: parseFloat(quantity) || quantity,
      unit: unitValue,
    };

    const { success, errors: validationErrors, activity } = logActivity(formData);

    if (!success) {
      setErrors(validationErrors);
      announceToScreenReader('Form has errors. Please review and correct them.', 'assertive');
    } else {
      resetForm();
      announceToScreenReader('Activity logged successfully.');
      if (onSuccess) onSuccess(activity);
    }

    setIsSubmitting(false);
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Log a new activity"
      noValidate
      className="flex flex-col gap-4"
    >
      {/* Error summary — announced assertively to screen readers */}
      {hasErrors && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-900/30 border border-red-500/50 rounded-lg px-4 py-3 text-sm text-red-300"
        >
          <p className="font-medium mb-1">Please fix these errors:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Category select */}
      <Select
        id="category"
        name="category"
        label="Category"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setActivityType('');
          setErrors((prev) => ({ ...prev, category: undefined }));
        }}
        options={CATEGORY_OPTIONS}
        placeholder="Select a category"
        error={errors.category}
        required
      />

      {/* Activity type — only shown once a category is selected */}
      {category && (
        <Select
          id="activityType"
          name="activityType"
          label="Activity Type"
          value={activityType}
          onChange={(e) => {
            setActivityType(e.target.value);
            setErrors((prev) => ({ ...prev, activityType: undefined }));
          }}
          options={dynamicOptions}
          placeholder="Select activity type"
          error={errors.activityType}
          required
        />
      )}

      {/* Quantity — only shown once a category is selected */}
      {category && (
        <Input
          id="quantity"
          name="quantity"
          label={unitLabel}
          type="number"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            setErrors((prev) => ({ ...prev, quantity: undefined }));
          }}
          placeholder="Enter amount"
          error={errors.quantity}
          hint={`Enter the amount in ${UNIT_MAP[category]}`}
          required
        />
      )}

      {/* Submit */}
      <Button type="submit" loading={isSubmitting} className="w-full mt-1">
        Log Activity
      </Button>
    </form>
  );
}

ActivityForm.propTypes = {
  onSuccess: PropTypes.func,
};

ActivityForm.displayName = 'ActivityForm';


