import { SampleScenario } from '@agrosmart/shared';

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'scenario-warm-humid',
    title: 'Scenario 1: Warm & Humid Coastal / River Delta',
    description: 'Typical tropical monsoon floodplain conditions with high rainfall, elevated humidity, and fertile clayey/alluvial soil.',
    tags: ['Kharif', 'High Rainfall', 'Clay / Alluvial'],
    input: {
      soilType: 'Clay',
      soilPh: 6.4,
      nitrogen: 110,
      phosphorus: 48,
      potassium: 55,
      temperature: 28.5,
      humidity: 82,
      rainfall: 1650,
      season: 'Kharif',
      state: 'Andhra Pradesh',
      district: 'East Godavari',
      irrigationAvailable: true,
      waterAvailability: 'High',
      inputUnits: { npk: 'kg/ha', rainfall: 'mm', temperature: '°C', humidity: '%' }
    },
    expectedInsight: 'High suitability for water-loving Kharif staples like Rice and Sugarcane. Dryland cereals and pulses (Chickpea, Mustard) will be heavily penalized due to excess moisture.'
  },
  {
    id: 'scenario-cool-season',
    title: 'Scenario 2: Cool Rabi Northern Plains',
    description: 'Classic North-Indian winter conditions with mild temperatures, moderate humidity, and fertile loamy soil under Rabi cultivation.',
    tags: ['Rabi', 'Cool Temp', 'Loamy / Alluvial'],
    input: {
      soilType: 'Loamy',
      soilPh: 7.1,
      nitrogen: 120,
      phosphorus: 55,
      potassium: 45,
      temperature: 18.0,
      humidity: 58,
      rainfall: 520,
      season: 'Rabi',
      state: 'Punjab',
      district: 'Ludhiana',
      irrigationAvailable: true,
      waterAvailability: 'Medium',
      inputUnits: { npk: 'kg/ha', rainfall: 'mm', temperature: '°C', humidity: '%' }
    },
    expectedInsight: 'Ideal conditions for Wheat, Potato, Mustard, and Chickpea. Warm-season crops like Cotton, Pearl Millet, and Rice will receive poor or zero seasonal compatibility.'
  },
  {
    id: 'scenario-arid-dryland',
    title: 'Scenario 3: Semi-Arid / Low Rainfall Deccan Plateau',
    description: 'Drought-prone, low-rainfall tract with red/sandy-loam soils and high summer/Kharif temperatures.',
    tags: ['Low Water', 'Drought-Resilient', 'Red / Sandy'],
    input: {
      soilType: 'Sandy',
      soilPh: 7.2,
      nitrogen: 65,
      phosphorus: 30,
      potassium: 35,
      temperature: 32.0,
      humidity: 42,
      rainfall: 380,
      season: 'Kharif',
      state: 'Rajasthan',
      district: 'Jodhpur',
      irrigationAvailable: false,
      waterAvailability: 'Low',
      inputUnits: { npk: 'kg/ha', rainfall: 'mm', temperature: '°C', humidity: '%' }
    },
    expectedInsight: 'Pearl Millet (Bajra), Sorghum (Jowar), and Groundnut will score highest due to extreme drought resistance and low water needs. High-water crops will be flagged with severe water deficit warnings.'
  },
  {
    id: 'scenario-acidic-soil',
    title: 'Scenario 4: High Rainfall Acidic Hill Tract',
    description: 'Sub-tropical lateritic / red soils with an acidic pH of 4.9 and moderate-to-high precipitation.',
    tags: ['Acidic pH', 'Specialty Soil', 'Red Soil'],
    input: {
      soilType: 'Red',
      soilPh: 4.9,
      nitrogen: 85,
      phosphorus: 38,
      potassium: 50,
      temperature: 24.0,
      humidity: 74,
      rainfall: 1250,
      season: 'Kharif',
      state: 'Karnataka',
      district: 'Shivamogga',
      irrigationAvailable: true,
      waterAvailability: 'Medium',
      inputUnits: { npk: 'kg/ha', rainfall: 'mm', temperature: '°C', humidity: '%' }
    },
    expectedInsight: 'Acid-tolerant crops like Rice and Groundnut can perform with cautionary advisory. Alkaline-demanding crops (like Cotton, Chickpea) will trigger strong pH limitation warnings and recommend liming.'
  },
  {
    id: 'scenario-incomplete-npk',
    title: 'Scenario 5: Incomplete Soil Nutrient Data (Field Test)',
    description: 'Farmer knows their local climate, season, and soil texture, but lacks a laboratory soil health card (NPK unknown).',
    tags: ['Missing Inputs', 'Confidence Degradation', 'Advisory'],
    input: {
      soilType: 'Black',
      soilPh: 7.4,
      nitrogen: null,
      phosphorus: null,
      potassium: null,
      temperature: 29.0,
      humidity: 62,
      rainfall: 850,
      season: 'Kharif',
      state: 'Maharashtra',
      district: 'Nagpur',
      irrigationAvailable: true,
      waterAvailability: 'Medium',
      inputUnits: { npk: 'kg/ha', rainfall: 'mm', temperature: '°C', humidity: '%' }
    },
    expectedInsight: 'Engine safely excludes unprovided NPK factors from the denominator, adjusts input completeness to ~70%, and recommends Cotton & Soybean based on Black soil and climate, while explicitly flagging nutrient uncertainty.'
  }
];
