import { z } from 'zod';
import { RecommendationInput } from '@agrosmart/shared';

export const recommendationInputSchema = z.object({
  soilType: z.enum(['Sandy', 'Clay', 'Loamy', 'Silty', 'Black', 'Red', 'Alluvial', 'Unknown']).nullable().optional(),
  soilPh: z.preprocess(
    val => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().min(3.0, 'Soil pH cannot be below 3.0 (extremely acidic / toxic)').max(11.0, 'Soil pH cannot exceed 11.0 (hyper-alkaline / barren)').nullable().optional()
  ),
  nitrogen: z.preprocess(
    val => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().min(0, 'Nitrogen must be positive').max(600, 'Nitrogen value exceeds realistic agronomic limits (max 600 kg/ha)').nullable().optional()
  ),
  phosphorus: z.preprocess(
    val => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().min(0, 'Phosphorus must be positive').max(300, 'Phosphorus value exceeds realistic agronomic limits (max 300 kg/ha)').nullable().optional()
  ),
  potassium: z.preprocess(
    val => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().min(0, 'Potassium must be positive').max(500, 'Potassium value exceeds realistic agronomic limits (max 500 kg/ha)').nullable().optional()
  ),
  temperature: z.preprocess(
    val => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().min(-10, 'Temperature cannot be below -10°C').max(55, 'Temperature cannot exceed 55°C').nullable().optional()
  ),
  humidity: z.preprocess(
    val => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().min(0, 'Humidity cannot be below 0%').max(100, 'Humidity cannot exceed 100%').nullable().optional()
  ),
  rainfall: z.preprocess(
    val => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().min(0, 'Rainfall cannot be negative').max(6000, 'Rainfall exceeds 6000 mm').nullable().optional()
  ),
  season: z.enum(['Kharif', 'Rabi', 'Zaid', 'All Season', 'Unknown']).nullable().optional(),
  state: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  irrigationAvailable: z.boolean().nullable().optional(),
  waterAvailability: z.enum(['Low', 'Medium', 'High', 'Unknown']).nullable().optional(),
  inputUnits: z.object({
    npk: z.enum(['kg/ha', 'ppm']).optional(),
    rainfall: z.string().optional(),
    temperature: z.string().optional(),
    humidity: z.string().optional()
  }).optional()
});

export interface InputQualityAssessment {
  isValid: boolean;
  completenessPercentage: number;
  warnings: string[];
  tips: string[];
}

export function assessInputQuality(data: Partial<RecommendationInput>): InputQualityAssessment {
  const warnings: string[] = [];
  const tips: string[] = [];
  let presentCount = 0;
  const criticalFields: (keyof RecommendationInput)[] = ['soilType', 'soilPh', 'temperature', 'rainfall', 'nitrogen', 'phosphorus', 'potassium', 'season'];

  // Check NPK
  const n = data.nitrogen != null ? Number(data.nitrogen) : null;
  const p = data.phosphorus != null ? Number(data.phosphorus) : null;
  const k = data.potassium != null ? Number(data.potassium) : null;

  if (n === null || p === null || k === null) {
    warnings.push('NPK nutrients are incomplete. Suitability will be estimated based on soil texture and climate alone.');
    tips.push('Get a Soil Health Card test done for your farm plot to unlock precise nutrient-matched recommendations.');
  }

  // Check pH
  if (data.soilPh != null) {
    const ph = Number(data.soilPh);
    if (ph < 4.5) {
      warnings.push(`Soil pH (${ph}) is strongly acidic. Heavy metals and aluminum toxicity may hinder most field crops.`);
      tips.push('Agricultural lime (calcium carbonate) or dolomite application is advised to raise pH towards 6.0.');
    } else if (ph > 8.5) {
      warnings.push(`Soil pH (${ph}) is strongly alkaline/sodic. Micronutrients like Iron and Zinc will be severely locked.`);
      tips.push('Gypsum application and organic green manuring (Dhaincha/Sesbania) helps reclaim alkaline soils.');
    }
  }

  // Check Temperature & Season harmony
  if (data.temperature != null && data.season) {
    const t = Number(data.temperature);
    if (data.season === 'Rabi' && t > 32) {
      warnings.push(`High temperature (${t}°C) for Rabi season: Typical winter crops need cooler conditions (15-25°C).`);
    } else if (data.season === 'Kharif' && t < 16) {
      warnings.push(`Unusually cold temperature (${t}°C) for Kharif monsoon season.`);
    }
  }

  // Count fields
  for (const field of criticalFields) {
    if (data[field] !== null && data[field] !== undefined && data[field] !== 'Unknown' && data[field] !== '') {
      presentCount++;
    }
  }

  const completenessPercentage = Math.round((presentCount / criticalFields.length) * 100);

  return {
    isValid: true,
    completenessPercentage,
    warnings,
    tips
  };
}
