/**
 * @fileoverview Emission factors mapping categories and types to their CO2e factors.
 * @module constants/emissionFactors
 */

/**
 * Emission factors in kg CO2e per unit.
 * Sources: IPCC AR6, EPA, Central Electricity Authority (CEA) India 2023.
 *
 * @type {Object.<string, Object.<string, number>>}
 */
export const EMISSION_FACTORS = {
  TRANSPORT: {
    car_petrol: 0.21, // kg CO2e per km
    car_diesel: 0.17, // kg CO2e per km
    car_electric: 0.05, // kg CO2e per km
    motorcycle: 0.11, // kg CO2e per km
    bus: 0.089, // kg CO2e per km
    train: 0.041, // kg CO2e per km
    flight_domestic: 0.255, // kg CO2e per km
    flight_international: 0.195, // kg CO2e per km
    cycling: 0, // kg CO2e per km
    walking: 0, // kg CO2e per km
  },

  FOOD: {
    beef: 27, // kg CO2e per kg food
    lamb: 39.2, // kg CO2e per kg food
    pork: 12.1, // kg CO2e per kg food
    chicken: 6.9, // kg CO2e per kg food
    fish: 6.1, // kg CO2e per kg food
    dairy: 3.2, // kg CO2e per kg food
    eggs: 4.8, // kg CO2e per kg food
    vegetables: 2.0, // kg CO2e per kg food
    fruits: 1.1, // kg CO2e per kg food
    vegan_meal: 0.7, // kg CO2e per meal
    vegetarian_meal: 1.5, // kg CO2e per meal
    meat_meal: 7.4, // kg CO2e per meal
  },

  ENERGY: {
    electricity_india: 0.708, // kg CO2e per kWh (India CEA 2023)
    natural_gas: 2.04, // kg CO2e per cubic metre
    lpg: 1.51, // kg CO2e per kg
    coal: 2.42, // kg CO2e per kg
  },

  SHOPPING: {
    clothing: 33, // kg CO2e per item
    electronics: 300, // kg CO2e per item
    furniture: 90, // kg CO2e per item
  },
};

/**
 * Metadata about the emission factor data sources.
 *
 * @type {{ source: string, year: number }}
 */
export const SOURCE_INFO = {
  source: 'IPCC AR6, EPA, CEA India 2023',
  year: 2023,
};
