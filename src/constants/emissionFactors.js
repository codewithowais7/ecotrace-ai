/**
 * Emission factors in kg CO2e per unit
 * Sources: IPCC, EPA, DEFRA 2023 emission factor datasets
 */

export const TRANSPORT_FACTORS = {
  car_petrol: 0.192,        // kg CO2e per km
  car_diesel: 0.171,        // kg CO2e per km
  car_electric: 0.053,      // kg CO2e per km (avg grid)
  car_hybrid: 0.111,        // kg CO2e per km
  motorcycle: 0.114,        // kg CO2e per km
  bus: 0.089,               // kg CO2e per km
  train: 0.041,             // kg CO2e per km
  subway: 0.031,            // kg CO2e per km
  flight_short: 0.255,      // kg CO2e per km (< 3700 km)
  flight_long: 0.195,       // kg CO2e per km (> 3700 km)
  flight_business: 0.573,   // kg CO2e per km (business class)
  walking: 0,
  cycling: 0,
};

export const ENERGY_FACTORS = {
  electricity_grid: 0.233,  // kg CO2e per kWh (world avg)
  electricity_coal: 0.820,  // kg CO2e per kWh
  electricity_gas: 0.490,   // kg CO2e per kWh
  electricity_renewable: 0.020, // kg CO2e per kWh
  natural_gas: 2.040,       // kg CO2e per m³
  heating_oil: 2.520,       // kg CO2e per litre
  lpg: 1.510,               // kg CO2e per litre
  wood_pellets: 0.039,      // kg CO2e per kWh
};

export const FOOD_FACTORS = {
  beef: 27.0,               // kg CO2e per kg food
  lamb: 39.2,               // kg CO2e per kg food
  pork: 12.1,               // kg CO2e per kg food
  poultry: 6.9,             // kg CO2e per kg food
  fish: 6.1,                // kg CO2e per kg food
  dairy: 3.2,               // kg CO2e per kg food
  eggs: 4.8,                // kg CO2e per kg food
  rice: 2.7,                // kg CO2e per kg food
  vegetables: 2.0,          // kg CO2e per kg food
  fruits: 1.1,              // kg CO2e per kg food
  legumes: 0.9,             // kg CO2e per kg food
  nuts: 0.3,                // kg CO2e per kg food
};

export const SHOPPING_FACTORS = {
  clothing_new: 33.4,       // kg CO2e per item
  electronics_phone: 70.0,  // kg CO2e per unit
  electronics_laptop: 422.0, // kg CO2e per unit
  electronics_tv: 371.0,    // kg CO2e per unit
  furniture: 100.0,          // kg CO2e per item (approx)
  books: 2.71,               // kg CO2e per book
  streaming_hour: 0.036,     // kg CO2e per hour
};

export const WASTE_FACTORS = {
  landfill_kg: 0.587,       // kg CO2e per kg waste to landfill
  recycled_kg: -0.150,      // kg CO2e saved per kg recycled
  composted_kg: -0.050,     // kg CO2e saved per kg composted
};
