import { CropProfile } from './index.js';

export const CROPS_DATASET: CropProfile[] = [
  {
    id: 'crop-rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'Cereal',
    description: 'A primary staple food crop that thrives in waterlogged, clayey or loamy alluvial soils. Critical for food security across South & Southeast Asia.',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Clay', 'Alluvial', 'Loamy', 'Silty'],
    minPh: 5.0,
    maxPh: 8.0,
    optimalPhMin: 5.5,
    optimalPhMax: 6.8,
    minTemperature: 20.0,
    maxTemperature: 38.0,
    optimalTempMin: 24.0,
    optimalTempMax: 32.0,
    minRainfall: 1000.0,
    maxRainfall: 2800.0,
    optimalRainfallMin: 1200.0,
    optimalRainfallMax: 2000.0,
    minHumidity: 65.0,
    maxHumidity: 95.0,
    optimalHumidityMin: 75.0,
    optimalHumidityMax: 88.0,
    seasons: ['Kharif', 'Zaid'],
    waterRequirement: 'High',
    npkRequirement: {
      n: { min: 60, max: 140, optimalMin: 80, optimalMax: 120 },
      p: { min: 30, max: 60, optimalMin: 40, optimalMax: 50 },
      k: { min: 30, max: 70, optimalMin: 40, optimalMax: 60 }
    },
    growingDurationDays: { min: 105, max: 150 },
    majorAdvantages: [
      'High market demand and assured minimum support price (MSP) mechanisms',
      'Excellent tolerance to standing water and flooded soils',
      'Multiple byproduct uses including husk, bran oil, and straw'
    ],
    commonChallenges: [
      'High water consumption requiring canal or assured tube-well irrigation',
      'Vulnerability to blast disease, bacterial leaf blight, and brown planthopper',
      'Methane emissions under prolonged flood-management regimes'
    ],
    sourceReferences: [
      'ICAR - Indian Institute of Rice Research (IIRR) Hyderabad Handbook (2022)',
      'FAO EcoCrop Database: Oryza sativa Suitability Norms',
      'TNAU Agritech Portal - Rice Production Guidelines'
    ],
    economicNotes: 'High return under assured irrigation, but susceptible to input cost escalations.'
  },
  {
    id: 'crop-wheat',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'Cereal',
    description: 'The premier Rabi cereal crop of temperate and subtropical regions, requiring cool winters and dry, sunny conditions during grain ripening.',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Loamy', 'Alluvial', 'Clay', 'Black'],
    minPh: 5.8,
    maxPh: 8.2,
    optimalPhMin: 6.2,
    optimalPhMax: 7.5,
    minTemperature: 10.0,
    maxTemperature: 28.0,
    optimalTempMin: 15.0,
    optimalTempMax: 22.0,
    minRainfall: 350.0,
    maxRainfall: 1100.0,
    optimalRainfallMin: 450.0,
    optimalRainfallMax: 750.0,
    minHumidity: 40.0,
    maxHumidity: 75.0,
    optimalHumidityMin: 50.0,
    optimalHumidityMax: 65.0,
    seasons: ['Rabi'],
    waterRequirement: 'Medium',
    npkRequirement: {
      n: { min: 70, max: 150, optimalMin: 100, optimalMax: 130 },
      p: { min: 40, max: 70, optimalMin: 50, optimalMax: 60 },
      k: { min: 30, max: 60, optimalMin: 40, optimalMax: 50 }
    },
    growingDurationDays: { min: 110, max: 140 },
    majorAdvantages: [
      'Stable winter cash crop with nationwide processing and procurement infrastructure',
      'Well-defined crown root initiation (CRI) irrigation scheduling',
      'High protein and straw fodder value'
    ],
    commonChallenges: [
      'Terminal heat stress during grain filling stage due to early onset of summer',
      'Yellow rust susceptibility in sub-mountainous zones',
      'Waterlogging sensitivity during germination'
    ],
    sourceReferences: [
      'ICAR - Indian Institute of Wheat and Barley Research (IIWBR) Karnal',
      'Directorate of Wheat Development, Ministry of Agriculture & Farmers Welfare',
      'FAO Irrigation and Drainage Paper No. 33: Yield Response to Water'
    ],
    economicNotes: 'Highly dependable returns with stable market procurement in Northern & Central India.'
  },
  {
    id: 'crop-maize',
    name: 'Maize',
    scientificName: 'Zea mays',
    category: 'Cereal',
    description: 'Often known as the "Queen of Cereals", maize exhibits high genetic yield potential, wide adaptability, and dual utility as food, feed, and industrial starch.',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Loamy', 'Alluvial', 'Red', 'Black'],
    minPh: 5.5,
    maxPh: 8.0,
    optimalPhMin: 6.0,
    optimalPhMax: 7.2,
    minTemperature: 18.0,
    maxTemperature: 36.0,
    optimalTempMin: 22.0,
    optimalTempMax: 30.0,
    minRainfall: 500.0,
    maxRainfall: 1400.0,
    optimalRainfallMin: 650.0,
    optimalRainfallMax: 950.0,
    minHumidity: 50.0,
    maxHumidity: 85.0,
    optimalHumidityMin: 60.0,
    optimalHumidityMax: 75.0,
    seasons: ['Kharif', 'Rabi', 'Zaid'],
    waterRequirement: 'Medium',
    npkRequirement: {
      n: { min: 80, max: 160, optimalMin: 110, optimalMax: 140 },
      p: { min: 40, max: 80, optimalMin: 55, optimalMax: 70 },
      k: { min: 35, max: 75, optimalMin: 45, optimalMax: 60 }
    },
    growingDurationDays: { min: 85, max: 120 },
    majorAdvantages: [
      'Grows across all three seasons (Kharif, Rabi, Spring/Zaid)',
      'Robust demand from poultry feed, bio-ethanol, and starch manufacturing industries',
      'Short growing window allowing flexible crop rotations'
    ],
    commonChallenges: [
      'Infestation by Fall Armyworm (Spodoptera frugiperda)',
      'Extreme sensitivity to water stagnation during early vegetative stages',
      'Moisture stress at silking/tasseling severely curtails cob filling'
    ],
    sourceReferences: [
      'ICAR - Indian Institute of Maize Research (IIMR) Ludhiana',
      'CIMMYT Global Maize Program Technical Bulletin',
      'National Food Security Mission (NFSM) Coarse Cereals Handbook'
    ],
    economicNotes: 'High industrial and poultry demand cushions against local grain price slumps.'
  },
  {
    id: 'crop-cotton',
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'Commercial',
    description: 'The "White Gold" cash crop driving the textile industry. Thrives in deep black cotton soils (vertisols) with sunny weather and moderate rainfall.',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Black', 'Alluvial', 'Red', 'Loamy'],
    minPh: 6.0,
    maxPh: 8.5,
    optimalPhMin: 6.5,
    optimalPhMax: 8.0,
    minTemperature: 21.0,
    maxTemperature: 40.0,
    optimalTempMin: 25.0,
    optimalTempMax: 35.0,
    minRainfall: 500.0,
    maxRainfall: 1300.0,
    optimalRainfallMin: 700.0,
    optimalRainfallMax: 1000.0,
    minHumidity: 45.0,
    maxHumidity: 80.0,
    optimalHumidityMin: 55.0,
    optimalHumidityMax: 70.0,
    seasons: ['Kharif'],
    waterRequirement: 'Medium',
    npkRequirement: {
      n: { min: 60, max: 150, optimalMin: 90, optimalMax: 120 },
      p: { min: 30, max: 70, optimalMin: 40, optimalMax: 60 },
      k: { min: 30, max: 80, optimalMin: 45, optimalMax: 65 }
    },
    growingDurationDays: { min: 140, max: 180 },
    majorAdvantages: [
      'High financial returns per hectare compared to standard grain crops',
      'Deep taproot system imparts resilience to intermittent dry spells',
      'Byproducts include cotton seed cake (high protein cattle feed) and cottonseed oil'
    ],
    commonChallenges: [
      'Pink bollworm resistance and whitefly outbreaks',
      'Lengthy duration exposes crop to unpredictable late-season monsoons',
      'Picking is labor-intensive and weather-sensitive'
    ],
    sourceReferences: [
      'ICAR - Central Institute for Cotton Research (CICR) Nagpur',
      'Cotton Corporation of India Agronomic Bulletins (2023)',
      'TNAU Cotton Agronomy & Pest Management Manual'
    ],
    economicNotes: 'High capital investment and pest management cost, with high commercial upside.'
  },
  {
    id: 'crop-sugarcane',
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'Commercial',
    description: 'A perennial high-biomass cash crop producing sugar, ethanol, and jaggery. Requires heavy nutrients, warm sunny climate, and extensive irrigation.',
    imageUrl: 'https://images.unsplash.com/photo-1598030304671-5aa1d6f21128?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Alluvial', 'Loamy', 'Black', 'Clay'],
    minPh: 5.8,
    maxPh: 8.4,
    optimalPhMin: 6.5,
    optimalPhMax: 7.8,
    minTemperature: 20.0,
    maxTemperature: 42.0,
    optimalTempMin: 27.0,
    optimalTempMax: 36.0,
    minRainfall: 1100.0,
    maxRainfall: 2600.0,
    optimalRainfallMin: 1400.0,
    optimalRainfallMax: 2000.0,
    minHumidity: 55.0,
    maxHumidity: 90.0,
    optimalHumidityMin: 65.0,
    optimalHumidityMax: 82.0,
    seasons: ['All Season', 'Kharif'],
    waterRequirement: 'High',
    npkRequirement: {
      n: { min: 150, max: 300, optimalMin: 200, optimalMax: 250 },
      p: { min: 60, max: 120, optimalMin: 75, optimalMax: 100 },
      k: { min: 60, max: 150, optimalMin: 80, optimalMax: 120 }
    },
    growingDurationDays: { min: 300, max: 365 },
    majorAdvantages: [
      'Assured mill off-take with statutory Fair and Remunerative Price (FRP)',
      'Ratoon cropping potential saves seed bed preparation costs for successive seasons',
      'Ethanol blending mandates are expanding biofuel procurement'
    ],
    commonChallenges: [
      'Heavy irrigation dependency over 10 to 14 months duration',
      'Delayed payments from sugar mills in some regions',
      'Red rot disease and pyrilla insect vulnerability'
    ],
    sourceReferences: [
      'ICAR - Indian Institute of Sugarcane Research (IISR) Lucknow',
      'ICAR - Sugarcane Breeding Institute (SBI) Coimbatore',
      'Commission for Agricultural Costs and Prices (CACP) Sugarcane Reports'
    ],
    economicNotes: 'Long cycle investment requiring deep cash flow planning and assured irrigation.'
  },
  {
    id: 'crop-groundnut',
    name: 'Groundnut',
    scientificName: 'Arachis hypogaea',
    category: 'Oilseed',
    description: 'A major oilseed and food legume that fixes atmospheric nitrogen and produces protein-rich kernels and high-quality vegetable oil.',
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Sandy', 'Red', 'Loamy', 'Alluvial'],
    minPh: 5.5,
    maxPh: 7.8,
    optimalPhMin: 6.0,
    optimalPhMax: 7.0,
    minTemperature: 20.0,
    maxTemperature: 35.0,
    optimalTempMin: 24.0,
    optimalTempMax: 30.0,
    minRainfall: 450.0,
    maxRainfall: 1100.0,
    optimalRainfallMin: 550.0,
    optimalRainfallMax: 800.0,
    minHumidity: 45.0,
    maxHumidity: 80.0,
    optimalHumidityMin: 55.0,
    optimalHumidityMax: 70.0,
    seasons: ['Kharif', 'Rabi', 'Zaid'],
    waterRequirement: 'Low',
    npkRequirement: {
      n: { min: 15, max: 40, optimalMin: 20, optimalMax: 30 },
      p: { min: 35, max: 70, optimalMin: 45, optimalMax: 60 },
      k: { min: 30, max: 65, optimalMin: 40, optimalMax: 50 }
    },
    growingDurationDays: { min: 95, max: 130 },
    majorAdvantages: [
      'Atmospheric nitrogen fixation reduces synthetic urea requirements by 60%',
      'Thrives in loose, well-drained sandy loam soils unsuitable for heavy cereals',
      'Residue serves as premium nutritious cattle fodder'
    ],
    commonChallenges: [
      'Tikka leaf spot and collar rot diseases',
      'Hard pan soil crusting prevents peg penetration into the ground',
      'Aflatoxin contamination risks under damp post-harvest storage'
    ],
    sourceReferences: [
      'ICAR - Directorate of Groundnut Research (DGR) Junagadh',
      'ICRISAT Groundnut Production Technologies Compendium',
      'TNAU Oilseeds Advisory Guidelines'
    ],
    economicNotes: 'Strong domestic edible oil market; excellent rotation crop before Rabi wheat.'
  },
  {
    id: 'crop-soybean',
    name: 'Soybean',
    scientificName: 'Glycine max',
    category: 'Oilseed',
    description: 'The "Miracle Bean" containing 40% protein and 20% oil. Essential for human food, poultry feeds, and industrial bio-products.',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Black', 'Loamy', 'Clay', 'Alluvial'],
    minPh: 6.0,
    maxPh: 7.8,
    optimalPhMin: 6.3,
    optimalPhMax: 7.2,
    minTemperature: 18.0,
    maxTemperature: 35.0,
    optimalTempMin: 23.0,
    optimalTempMax: 30.0,
    minRainfall: 600.0,
    maxRainfall: 1300.0,
    optimalRainfallMin: 700.0,
    optimalRainfallMax: 950.0,
    minHumidity: 55.0,
    maxHumidity: 85.0,
    optimalHumidityMin: 65.0,
    optimalHumidityMax: 78.0,
    seasons: ['Kharif'],
    waterRequirement: 'Medium',
    npkRequirement: {
      n: { min: 20, max: 50, optimalMin: 25, optimalMax: 35 },
      p: { min: 50, max: 90, optimalMin: 60, optimalMax: 80 },
      k: { min: 30, max: 60, optimalMin: 40, optimalMax: 50 }
    },
    growingDurationDays: { min: 85, max: 110 },
    majorAdvantages: [
      'High protein and oil concentration with rapid international liquidity',
      'Strong symbiotic nitrogen fixation improves subsequent soil fertility',
      'Short Kharif duration enables timely sowing of Rabi crops like wheat and mustard'
    ],
    commonChallenges: [
      'Yellow mosaic virus transmitted by whitefly',
      'Severe yield loss if moisture stress occurs during pod-filling stage',
      'Rapid loss of seed germination viability in humid storage'
    ],
    sourceReferences: [
      'ICAR - Indian Institute of Soybean Research (IISR) Indore',
      'Soybean Processors Association of India (SOPA) Annual Bulletins',
      'FAO Crop Production and Protection Series: Soybean'
    ],
    economicNotes: 'Quick liquidity and vital for central Indian rainfed farming systems.'
  },
  {
    id: 'crop-potato',
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    category: 'Vegetable',
    description: 'A major cool-season tuber vegetable producing high caloric nutrition per unit land and water. Demands loose, friable soils and balanced potassium.',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Loamy', 'Sandy', 'Alluvial', 'Silty'],
    minPh: 5.0,
    maxPh: 7.2,
    optimalPhMin: 5.5,
    optimalPhMax: 6.5,
    minTemperature: 12.0,
    maxTemperature: 28.0,
    optimalTempMin: 16.0,
    optimalTempMax: 22.0,
    minRainfall: 400.0,
    maxRainfall: 900.0,
    optimalRainfallMin: 500.0,
    optimalRainfallMax: 700.0,
    minHumidity: 50.0,
    maxHumidity: 85.0,
    optimalHumidityMin: 60.0,
    optimalHumidityMax: 75.0,
    seasons: ['Rabi'],
    waterRequirement: 'Medium',
    npkRequirement: {
      n: { min: 100, max: 200, optimalMin: 120, optimalMax: 160 },
      p: { min: 60, max: 120, optimalMin: 80, optimalMax: 100 },
      k: { min: 80, max: 180, optimalMin: 100, optimalMax: 140 }
    },
    growingDurationDays: { min: 80, max: 115 },
    majorAdvantages: [
      'Exceptional dry matter and dietary yield per hectare',
      'Readily fits between Kharif paddy and late spring crops in intensive rotations',
      'Strong cold-storage and processing chips industry demand'
    ],
    commonChallenges: [
      'Late blight disease caused by Phytophthora infestans under cool damp conditions',
      'High seed tuber procurement cost (constituting 40% of total input cost)',
      'High sensitivity to waterlogging and soil compaction'
    ],
    sourceReferences: [
      'ICAR - Central Potato Research Institute (CPRI) Shimla',
      'Horticultural Statistics at a Glance, Ministry of Agriculture',
      'FAO International Year of the Potato Technical Series'
    ],
    economicNotes: 'High upfront cost with high potential profit; cold storage link is essential.'
  },
  {
    id: 'crop-tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetable',
    description: 'A versatile, high-value horticultural vegetable crop cultivated worldwide for fresh markets and processing into paste and sauces.',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Loamy', 'Red', 'Alluvial', 'Sandy'],
    minPh: 5.8,
    maxPh: 7.8,
    optimalPhMin: 6.0,
    optimalPhMax: 7.0,
    minTemperature: 16.0,
    maxTemperature: 35.0,
    optimalTempMin: 20.0,
    optimalTempMax: 28.0,
    minRainfall: 450.0,
    maxRainfall: 1100.0,
    optimalRainfallMin: 600.0,
    optimalRainfallMax: 850.0,
    minHumidity: 45.0,
    maxHumidity: 80.0,
    optimalHumidityMin: 55.0,
    optimalHumidityMax: 70.0,
    seasons: ['Rabi', 'Kharif', 'Zaid'],
    waterRequirement: 'Medium',
    npkRequirement: {
      n: { min: 70, max: 150, optimalMin: 90, optimalMax: 120 },
      p: { min: 50, max: 100, optimalMin: 60, optimalMax: 80 },
      k: { min: 60, max: 130, optimalMin: 75, optimalMax: 100 }
    },
    growingDurationDays: { min: 90, max: 130 },
    majorAdvantages: [
      'Continuous multiple harvest flushes generate frequent cash flow',
      'High responsive yields under drip fertigation and staking systems',
      'Year-round consumption and steady culinary demand'
    ],
    commonChallenges: [
      'Extreme farmgate price volatility between glut and lean seasons',
      'Bacterial wilt, tomato leaf curl virus, and fruit borer damage',
      'High post-harvest perishability requiring rapid transit'
    ],
    sourceReferences: [
      'ICAR - Indian Institute of Horticultural Research (IIHR) Bengaluru',
      'ICAR - Indian Institute of Vegetable Research (IIVR) Varanasi',
      'TNAU Horticulture Portal: Tomato Cultivation Guide'
    ],
    economicNotes: 'Frequent harvests provide running liquidity, but price volatility requires market planning.'
  },
  {
    id: 'crop-onion',
    name: 'Onion',
    scientificName: 'Allium cepa',
    category: 'Vegetable',
    description: 'An indispensable commercial bulb vegetable with culinary and medicinal value. Requires friable soil, moderate moisture, and good curing conditions.',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Loamy', 'Alluvial', 'Red', 'Silty'],
    minPh: 5.8,
    maxPh: 7.6,
    optimalPhMin: 6.2,
    optimalPhMax: 7.0,
    minTemperature: 13.0,
    maxTemperature: 34.0,
    optimalTempMin: 18.0,
    optimalTempMax: 26.0,
    minRainfall: 400.0,
    maxRainfall: 950.0,
    optimalRainfallMin: 500.0,
    optimalRainfallMax: 750.0,
    minHumidity: 45.0,
    maxHumidity: 75.0,
    optimalHumidityMin: 55.0,
    optimalHumidityMax: 68.0,
    seasons: ['Rabi', 'Kharif'],
    waterRequirement: 'Medium',
    npkRequirement: {
      n: { min: 60, max: 130, optimalMin: 80, optimalMax: 100 },
      p: { min: 35, max: 70, optimalMin: 45, optimalMax: 60 },
      k: { min: 45, max: 90, optimalMin: 55, optimalMax: 75 }
    },
    growingDurationDays: { min: 110, max: 145 },
    majorAdvantages: [
      'Exceptional storage potential under ventilated conditions for Rabi bulbs',
      'Vital kitchen vegetable maintaining consistent nationwide commercial volume',
      'High revenue per acre during festive market windows'
    ],
    commonChallenges: [
      'Purple blotch and Stemphylium blight in high humidity',
      'Premature bolting if temperature drops drastically during vegetative stage',
      'Thrips infestation during dry spells'
    ],
    sourceReferences: [
      'ICAR - Directorate of Onion and Garlic Research (DOGR) Rajgurunagar',
      'NHRDF - National Horticultural Research and Development Foundation',
      'APEDA Horticultural Export Manuals'
    ],
    economicNotes: 'Rabi harvest allows 4-5 months storage to capture favorable off-season prices.'
  },
  {
    id: 'crop-chickpea',
    name: 'Chickpea',
    scientificName: 'Cicer arietinum',
    category: 'Pulse',
    description: 'The premier Rabi pulse crop (Bengal Gram) in India, rich in protein, fixing soil nitrogen, and exceptionally resilient to drought.',
    imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Black', 'Loamy', 'Alluvial', 'Clay'],
    minPh: 6.0,
    maxPh: 8.5,
    optimalPhMin: 6.5,
    optimalPhMax: 7.8,
    minTemperature: 10.0,
    maxTemperature: 30.0,
    optimalTempMin: 16.0,
    optimalTempMax: 24.0,
    minRainfall: 300.0,
    maxRainfall: 750.0,
    optimalRainfallMin: 350.0,
    optimalRainfallMax: 550.0,
    minHumidity: 30.0,
    maxHumidity: 65.0,
    optimalHumidityMin: 40.0,
    optimalHumidityMax: 55.0,
    seasons: ['Rabi'],
    waterRequirement: 'Low',
    npkRequirement: {
      n: { min: 15, max: 35, optimalMin: 20, optimalMax: 25 },
      p: { min: 35, max: 70, optimalMin: 45, optimalMax: 60 },
      k: { min: 20, max: 50, optimalMin: 25, optimalMax: 40 }
    },
    growingDurationDays: { min: 95, max: 125 },
    majorAdvantages: [
      'Thrives on residual soil moisture with minimal external irrigation',
      'Biological nitrogen fixation boosts subsequent soil microbial vitality',
      'Essential source of dietary protein with strong culinary demand'
    ],
    commonChallenges: [
      'Fusarium wilt and dry root rot in warm early soils',
      'Pod borer (Helicoverpa armigera) causing severe reproductive damage',
      'Cloudy weather and high humidity during flowering cause flower drop'
    ],
    sourceReferences: [
      'ICAR - Indian Institute of Pulses Research (IIPR) Kanpur',
      'ICRISAT Grain Legumes and Dryland Cereals Bulletin',
      'NFSM National Pulses Development Strategy'
    ],
    economicNotes: 'Low input cost and drought tolerance make it an ideal risk mitigation crop.'
  },
  {
    id: 'crop-mustard',
    name: 'Mustard',
    scientificName: 'Brassica juncea',
    category: 'Oilseed',
    description: 'An indispensable winter oilseed crop of Northern and Central India, offering high oil recovery, frost resistance, and low water consumption.',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Alluvial', 'Loamy', 'Sandy', 'Silty'],
    minPh: 5.8,
    maxPh: 8.2,
    optimalPhMin: 6.2,
    optimalPhMax: 7.5,
    minTemperature: 10.0,
    maxTemperature: 28.0,
    optimalTempMin: 14.0,
    optimalTempMax: 22.0,
    minRainfall: 250.0,
    maxRainfall: 650.0,
    optimalRainfallMin: 350.0,
    optimalRainfallMax: 500.0,
    minHumidity: 35.0,
    maxHumidity: 70.0,
    optimalHumidityMin: 45.0,
    optimalHumidityMax: 60.0,
    seasons: ['Rabi'],
    waterRequirement: 'Low',
    npkRequirement: {
      n: { min: 50, max: 110, optimalMin: 70, optimalMax: 90 },
      p: { min: 25, max: 50, optimalMin: 35, optimalMax: 45 },
      k: { min: 20, max: 45, optimalMin: 25, optimalMax: 35 }
    },
    growingDurationDays: { min: 100, max: 135 },
    majorAdvantages: [
      'Requires only 1 to 2 protective irrigations throughout its lifecycle',
      'High oil content (38-42%) with strong processing demand across northern states',
      'Mustard cake is a valued organic fertilizer and animal meal'
    ],
    commonChallenges: [
      'Mustard aphid (Lipaphis erysimi) infestation during overcast spells',
      'White rust (Albugo candida) and Alternaria blight',
      'Severe frost damage if winter cold snaps occur at flowering'
    ],
    sourceReferences: [
      'ICAR - Directorate of Rapeseed-Mustard Research (DRMR) Bharatpur',
      'National Mission on Edible Oils - Oilseeds (NMEO-OS)',
      'TNAU Rapeseed & Mustard Agronomy Reference'
    ],
    economicNotes: 'One of the most cost-effective winter cash crops for water-stressed soils.'
  },
  {
    id: 'crop-sorghum',
    name: 'Sorghum',
    scientificName: 'Sorghum bicolor',
    category: 'Cereal',
    description: 'The "Camel of Crops", Jowar is a climate-smart, drought-hardy coarse grain that delivers staple food and high-biomass fodder with minimal water.',
    imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Black', 'Loamy', 'Red', 'Alluvial'],
    minPh: 5.5,
    maxPh: 8.5,
    optimalPhMin: 6.2,
    optimalPhMax: 7.8,
    minTemperature: 18.0,
    maxTemperature: 40.0,
    optimalTempMin: 25.0,
    optimalTempMax: 34.0,
    minRainfall: 350.0,
    maxRainfall: 1000.0,
    optimalRainfallMin: 450.0,
    optimalRainfallMax: 700.0,
    minHumidity: 30.0,
    maxHumidity: 75.0,
    optimalHumidityMin: 40.0,
    optimalHumidityMax: 60.0,
    seasons: ['Kharif', 'Rabi'],
    waterRequirement: 'Low',
    npkRequirement: {
      n: { min: 40, max: 100, optimalMin: 60, optimalMax: 80 },
      p: { min: 25, max: 55, optimalMin: 35, optimalMax: 45 },
      k: { min: 25, max: 50, optimalMin: 30, optimalMax: 40 }
    },
    growingDurationDays: { min: 95, max: 120 },
    majorAdvantages: [
      'Extremely high water use efficiency and dormancy during severe dry spells',
      'Gluten-free super-cereal gaining premium demand in health food sectors',
      'Dual-purpose varieties yield superior dry fodder for dairy cattle'
    ],
    commonChallenges: [
      'Grain mold if unseasonal showers coincide with maturity',
      'Shoot fly and stem borer attacks during early seedling stage',
      'Striga parasitic weed infestation in degraded soils'
    ],
    sourceReferences: [
      'ICAR - Indian Institute of Millets Research (IIMR) Hyderabad',
      'ICRISAT Dryland Cereals Agronomic Bulletin',
      'International Year of Millets (IYM) Knowledge Compendium'
    ],
    economicNotes: 'Excellent climate resilience; growing institutional procurement for health foods.'
  },
  {
    id: 'crop-pearl-millet',
    name: 'Pearl Millet',
    scientificName: 'Pennisetum glaucum',
    category: 'Cereal',
    description: 'Bajra is the champion dryland crop of arid and semi-arid agro-ecologies. Tolerates high temperatures, drought, and sandy low-fertility soils.',
    imageUrl: 'https://images.unsplash.com/photo-1628102491329-a791a826477b?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Sandy', 'Red', 'Loamy', 'Alluvial'],
    minPh: 5.5,
    maxPh: 8.5,
    optimalPhMin: 6.2,
    optimalPhMax: 7.8,
    minTemperature: 22.0,
    maxTemperature: 45.0,
    optimalTempMin: 28.0,
    optimalTempMax: 38.0,
    minRainfall: 200.0,
    maxRainfall: 750.0,
    optimalRainfallMin: 300.0,
    optimalRainfallMax: 500.0,
    minHumidity: 25.0,
    maxHumidity: 70.0,
    optimalHumidityMin: 35.0,
    optimalHumidityMax: 55.0,
    seasons: ['Kharif', 'Zaid'],
    waterRequirement: 'Low',
    npkRequirement: {
      n: { min: 40, max: 90, optimalMin: 50, optimalMax: 75 },
      p: { min: 20, max: 45, optimalMin: 25, optimalMax: 35 },
      k: { min: 20, max: 45, optimalMin: 25, optimalMax: 35 }
    },
    growingDurationDays: { min: 70, max: 95 },
    majorAdvantages: [
      'Fast maturing (70-85 days), perfect for short rainy windows in arid tracts',
      'Highest tolerance to atmospheric heat and low soil fertility among major cereals',
      'Iron- and zinc-dense grain addressing micronutrient malnutrition'
    ],
    commonChallenges: [
      'Downy mildew (green ear disease) during wet rainy spells',
      'Ergot and smut diseases under prolonged drizzle at flowering',
      'Fast bird depredation during grain filling'
    ],
    sourceReferences: [
      'ICAR - All India Coordinated Research Project on Pearl Millet (Jodhpur)',
      'ICRISAT Pearl Millet Breeding & Adaptation Series',
      'Food and Agriculture Organization (FAO) Desert Agriculture Reports'
    ],
    economicNotes: 'Lowest input cost and shortest growing period; reliable insurance against drought.'
  },
  {
    id: 'crop-sunflower',
    name: 'Sunflower',
    scientificName: 'Helianthus annuus',
    category: 'Oilseed',
    description: 'A photo-insensitive commercial oilseed with wide adaptability across seasons. Yields premium heart-healthy vegetable oil high in polyunsaturated fatty acids.',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    suitableSoilTypes: ['Black', 'Loamy', 'Alluvial', 'Red'],
    minPh: 6.0,
    maxPh: 8.0,
    optimalPhMin: 6.5,
    optimalPhMax: 7.5,
    minTemperature: 15.0,
    maxTemperature: 36.0,
    optimalTempMin: 20.0,
    optimalTempMax: 28.0,
    minRainfall: 450.0,
    maxRainfall: 1000.0,
    optimalRainfallMin: 550.0,
    optimalRainfallMax: 800.0,
    minHumidity: 40.0,
    maxHumidity: 80.0,
    optimalHumidityMin: 50.0,
    optimalHumidityMax: 70.0,
    seasons: ['Rabi', 'Kharif', 'Zaid'],
    waterRequirement: 'Medium',
    npkRequirement: {
      n: { min: 50, max: 100, optimalMin: 60, optimalMax: 80 },
      p: { min: 40, max: 80, optimalMin: 50, optimalMax: 65 },
      k: { min: 30, max: 65, optimalMin: 40, optimalMax: 50 }
    },
    growingDurationDays: { min: 85, max: 110 },
    majorAdvantages: [
      'Day-length neutral (photo-insensitive): can be sown in Kharif, Rabi, or Summer',
      'Extensive root system scavenges nutrients and moisture from deeper horizons',
      'High market price driven by consumer preference for refined sunflower oil'
    ],
    commonChallenges: [
      'Sunflower necrosis virus transmitted by thrips',
      'Poor seed setting in capitulum center if pollinating bees are lacking',
      'Parrot damage during ripening stage'
    ],
    sourceReferences: [
      'ICAR - Indian Institute of Oilseeds Research (IIOR) Hyderabad',
      'National Oilseeds and Vegetable Oils Development Board (NOVOD)',
      'FAO Sunflower Production Field Guide'
    ],
    economicNotes: 'Flexible sowing calendar makes it an ideal catch crop when primary sowing fails.'
  }
];
