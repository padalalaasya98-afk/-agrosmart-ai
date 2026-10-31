export type SoilType = 'Sandy' | 'Clay' | 'Loamy' | 'Silty' | 'Black' | 'Red' | 'Alluvial';
export type GrowingSeason = 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
export type WaterRequirement = 'Low' | 'Medium' | 'High';
export type WaterAvailability = 'Low' | 'Medium' | 'High';

export interface NPKRange {
  min: number;
  max: number;
  optimalMin: number;
  optimalMax: number;
}

export interface CropProfile {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereal' | 'Pulse' | 'Cash Crop' | 'Vegetable' | 'Oilseed' | 'Commercial';
  description: string;
  imageUrl: string;
  suitableSoilTypes: SoilType[];
  minPh: number;
  maxPh: number;
  optimalPhMin: number;
  optimalPhMax: number;
  minTemperature: number;
  maxTemperature: number;
  optimalTempMin: number;
  optimalTempMax: number;
  minRainfall: number;
  maxRainfall: number;
  optimalRainfallMin: number;
  optimalRainfallMax: number;
  minHumidity: number;
  maxHumidity: number;
  optimalHumidityMin: number;
  optimalHumidityMax: number;
  seasons: GrowingSeason[];
  waterRequirement: WaterRequirement;
  npkRequirement: {
    n: NPKRange;
    p: NPKRange;
    k: NPKRange;
  };
  growingDurationDays: {
    min: number;
    max: number;
  };
  majorAdvantages: string[];
  commonChallenges: string[];
  sourceReferences: string[];
  economicNotes?: string;
}

export interface RecommendationInput {
  soilType?: SoilType | 'Unknown' | null;
  soilPh?: number | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  temperature?: number | null;
  rainfall?: number | null;
  humidity?: number | null;
  season?: GrowingSeason | 'Unknown' | null;
  state?: string | null;
  district?: string | null;
  irrigationAvailable?: boolean | null;
  waterAvailability?: WaterAvailability | 'Unknown' | null;
  inputUnits?: {
    npk?: 'kg/ha' | 'ppm' | string;
    rainfall?: string;
    temperature?: string;
    humidity?: string;
  } | null;
}

export interface FactorScore {
  factor: string;
  weight: number;
  score: number; // 0 to 1
  userValue: string | number | null;
  optimalRange: string;
  status: 'optimal' | 'moderate' | 'marginal' | 'unsuitable' | 'missing';
  detail: string;
}

export interface CropRecommendationResult {
  crop: CropProfile;
  suitabilityScore: number; // 0 - 100
  category: 'Highly Suitable' | 'Moderately Suitable' | 'Marginally Suitable' | 'Not Recommended';
  rank: number;
  soilCompatibility: number; // 0 - 100
  climateCompatibility: number; // 0 - 100
  nutrientCompatibility: number; // 0 - 100
  waterCompatibility: number; // 0 - 100
  factorScores: Record<string, FactorScore>;
  explanation: {
    summary: string;
    positiveFactors: string[];
    negativeFactors: string[];
    missingInputs: string[];
    geminiExplanation?: string;
  };
  warnings: string[];
}

export interface RecommendationResponse {
  requestId: string;
  timestamp: string;
  inputSummary: RecommendationInput;
  inputCompletenessScore: number; // 0 - 100%
  recommendations: CropRecommendationResult[];
  appliedWeights: Record<string, number>;
  engineVersion: string;
  disclaimer: string;
}

export interface CropComparisonItem {
  metric: string;
  category: 'Soil' | 'Climate' | 'Nutrients' | 'Management' | 'General';
  description: string;
  values: Record<string, string | number>;
}

export interface CropComparisonResponse {
  crops: CropProfile[];
  comparisonTable: CropComparisonItem[];
  radarChartData: Array<{
    metric: string;
    fullMark: number;
    [cropIdOrName: string]: string | number;
  }>;
}

export interface SavedRecommendationRecord {
  id: string;
  createdAt: string;
  input: RecommendationInput;
  topCropName: string;
  topScore: number;
  recommendedCrops: Array<{
    name: string;
    score: number;
    category: string;
  }>;
  notes?: string;
}

export interface SampleScenario {
  id: string;
  title: string;
  description: string;
  tags: string[];
  input: RecommendationInput;
  expectedInsight: string;
}

export * from './cropDataset.js';
export * from './engine.js';
