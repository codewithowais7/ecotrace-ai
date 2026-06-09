/**
 * Emission categories configuration for UI rendering and grouping
 */

export const CATEGORIES = {
  transport: {
    id: 'transport',
    label: 'Transport',
    icon: '🚗',
    color: '#3b82f6',
    description: 'Flights, driving, public transit',
    subcategories: [
      { id: 'car_petrol', label: 'Petrol Car', unit: 'km' },
      { id: 'car_diesel', label: 'Diesel Car', unit: 'km' },
      { id: 'car_electric', label: 'Electric Car', unit: 'km' },
      { id: 'car_hybrid', label: 'Hybrid Car', unit: 'km' },
      { id: 'motorcycle', label: 'Motorcycle', unit: 'km' },
      { id: 'bus', label: 'Bus', unit: 'km' },
      { id: 'train', label: 'Train', unit: 'km' },
      { id: 'subway', label: 'Subway / Metro', unit: 'km' },
      { id: 'flight_short', label: 'Short-haul Flight', unit: 'km' },
      { id: 'flight_long', label: 'Long-haul Flight', unit: 'km' },
      { id: 'flight_business', label: 'Business Class Flight', unit: 'km' },
      { id: 'walking', label: 'Walking', unit: 'km' },
      { id: 'cycling', label: 'Cycling', unit: 'km' },
    ],
  },
  energy: {
    id: 'energy',
    label: 'Home Energy',
    icon: '⚡',
    color: '#f59e0b',
    description: 'Electricity, heating, cooling',
    subcategories: [
      { id: 'electricity_grid', label: 'Grid Electricity', unit: 'kWh' },
      { id: 'electricity_renewable', label: 'Renewable Electricity', unit: 'kWh' },
      { id: 'natural_gas', label: 'Natural Gas', unit: 'm³' },
      { id: 'heating_oil', label: 'Heating Oil', unit: 'litres' },
      { id: 'lpg', label: 'LPG', unit: 'litres' },
      { id: 'wood_pellets', label: 'Wood Pellets', unit: 'kWh' },
    ],
  },
  food: {
    id: 'food',
    label: 'Food & Diet',
    icon: '🥦',
    color: '#22c55e',
    description: 'What you eat and drink',
    subcategories: [
      { id: 'beef', label: 'Beef', unit: 'kg' },
      { id: 'lamb', label: 'Lamb', unit: 'kg' },
      { id: 'pork', label: 'Pork', unit: 'kg' },
      { id: 'poultry', label: 'Poultry', unit: 'kg' },
      { id: 'fish', label: 'Fish & Seafood', unit: 'kg' },
      { id: 'dairy', label: 'Dairy', unit: 'kg' },
      { id: 'eggs', label: 'Eggs', unit: 'kg' },
      { id: 'rice', label: 'Rice', unit: 'kg' },
      { id: 'vegetables', label: 'Vegetables', unit: 'kg' },
      { id: 'fruits', label: 'Fruits', unit: 'kg' },
      { id: 'legumes', label: 'Legumes & Pulses', unit: 'kg' },
    ],
  },
  shopping: {
    id: 'shopping',
    label: 'Shopping',
    icon: '🛍️',
    color: '#a855f7',
    description: 'Consumer goods & services',
    subcategories: [
      { id: 'clothing_new', label: 'New Clothing', unit: 'items' },
      { id: 'electronics_phone', label: 'Smartphone', unit: 'units' },
      { id: 'electronics_laptop', label: 'Laptop / Tablet', unit: 'units' },
      { id: 'electronics_tv', label: 'Television', unit: 'units' },
      { id: 'furniture', label: 'Furniture', unit: 'items' },
      { id: 'books', label: 'Books', unit: 'items' },
      { id: 'streaming_hour', label: 'Video Streaming', unit: 'hours' },
    ],
  },
  waste: {
    id: 'waste',
    label: 'Waste',
    icon: '♻️',
    color: '#ef4444',
    description: 'Trash, recycling, composting',
    subcategories: [
      { id: 'landfill_kg', label: 'Landfill Waste', unit: 'kg' },
      { id: 'recycled_kg', label: 'Recycled Waste', unit: 'kg' },
      { id: 'composted_kg', label: 'Composted Waste', unit: 'kg' },
    ],
  },
};

export const CATEGORY_IDS = Object.keys(CATEGORIES);

export const CATEGORY_COLORS = Object.fromEntries(
  Object.entries(CATEGORIES).map(([id, cat]) => [id, cat.color])
);

/** Average global per-capita annual CO2 footprint in kg */
export const GLOBAL_AVERAGE_KG = 4700;

/** Paris Agreement target per-capita annual CO2 footprint in kg */
export const PARIS_TARGET_KG = 2000;
