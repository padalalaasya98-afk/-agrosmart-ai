import {
  CropProfile,
  CropRecommendationResult,
  FactorScore,
  RecommendationInput
} from './index.js';
import { CROPS_DATASET } from './cropDataset.js';

export const FACTOR_WEIGHTS = {
  soilType: 0.20,
  soilPh: 0.15,
  temperature: 0.15,
  rainfall: 0.10,
  nitrogen: 0.10,
  phosphorus: 0.10,
  potassium: 0.10,
  humidity: 0.05,
  season: 0.05
} as const;

export class AgroSuitabilityEngine {
  protected crops: CropProfile[];

  constructor(cropList: CropProfile[] = CROPS_DATASET) {
    this.crops = cropList;
  }

  public evaluateSingleCrop(crop: CropProfile, input: RecommendationInput): CropRecommendationResult {
    const factorScores: Record<string, FactorScore> = {};
    const warnings: string[] = [];

    let totalWeightedScore = 0;
    let applicableWeightSum = 0;

    // 1. Soil Type
    if (input.soilType && input.soilType !== 'Unknown') {
      const weight = FACTOR_WEIGHTS.soilType;
      applicableWeightSum += weight;
      const isMatch = crop.suitableSoilTypes.includes(input.soilType);
      const score = isMatch ? 1.0 : 0.25;
      const status = isMatch ? 'optimal' : 'marginal';
      const detail = isMatch
        ? `${input.soilType} soil is an ideal, verified texture for ${crop.name}.`
        : `${input.soilType} soil is not typically preferred for ${crop.name} (Prefers: ${crop.suitableSoilTypes.join(', ')}).`;

      if (!isMatch) {
        warnings.push(`Soil texture mismatch: Entered ${input.soilType}, but ${crop.name} thrives in ${crop.suitableSoilTypes.join(', ')}.`);
      }

      factorScores.soilType = {
        factor: 'Soil Type',
        weight,
        score,
        userValue: input.soilType,
        optimalRange: crop.suitableSoilTypes.join(', '),
        status,
        detail
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.soilType = {
        factor: 'Soil Type',
        weight: FACTOR_WEIGHTS.soilType,
        score: 0,
        userValue: null,
        optimalRange: crop.suitableSoilTypes.join(', '),
        status: 'missing',
        detail: 'Soil type was not provided.'
      };
    }

    // 2. Soil pH
    if (input.soilPh !== null && input.soilPh !== undefined && !isNaN(Number(input.soilPh))) {
      const weight = FACTOR_WEIGHTS.soilPh;
      applicableWeightSum += weight;
      const ph = Number(input.soilPh);
      const score = this.calculateRangeScore(ph, crop.minPh, crop.optimalPhMin, crop.optimalPhMax, crop.maxPh);
      
      let status: FactorScore['status'] = 'optimal';
      let detail = `pH ${ph} is within the optimal growth band (${crop.optimalPhMin}-${crop.optimalPhMax}).`;

      if (score >= 0.9) status = 'optimal';
      else if (score >= 0.6) {
        status = 'moderate';
        detail = `pH ${ph} is acceptable, but slightly outside optimal (${crop.optimalPhMin}-${crop.optimalPhMax}).`;
      } else if (score >= 0.3) {
        status = 'marginal';
        detail = `pH ${ph} is marginal for ${crop.name}.`;
        warnings.push(`Marginal pH (${ph}): ${crop.name} performs best in pH ${crop.optimalPhMin}-${crop.optimalPhMax}.`);
      } else {
        status = 'unsuitable';
        detail = `pH ${ph} is severely stressful for ${crop.name}.`;
        warnings.push(`Severe pH limitation (${ph}): Exceeds tolerance band ${crop.minPh}-${crop.maxPh}.`);
      }

      factorScores.soilPh = {
        factor: 'Soil pH',
        weight,
        score,
        userValue: ph,
        optimalRange: `${crop.optimalPhMin} - ${crop.optimalPhMax}`,
        status,
        detail
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.soilPh = {
        factor: 'Soil pH',
        weight: FACTOR_WEIGHTS.soilPh,
        score: 0,
        userValue: null,
        optimalRange: `${crop.optimalPhMin} - ${crop.optimalPhMax}`,
        status: 'missing',
        detail: 'Soil pH was not specified.'
      };
    }

    // 3. Temperature
    if (input.temperature !== null && input.temperature !== undefined && !isNaN(Number(input.temperature))) {
      const weight = FACTOR_WEIGHTS.temperature;
      applicableWeightSum += weight;
      const temp = Number(input.temperature);
      const score = this.calculateRangeScore(temp, crop.minTemperature, crop.optimalTempMin, crop.optimalTempMax, crop.maxTemperature);
      
      let status: FactorScore['status'] = 'optimal';
      let detail = `${temp}°C is within ideal temperature range (${crop.optimalTempMin}°C - ${crop.optimalTempMax}°C).`;

      if (score >= 0.9) status = 'optimal';
      else if (score >= 0.6) {
        status = 'moderate';
        detail = `${temp}°C is viable, though slightly outside peak thermal range.`;
      } else if (score >= 0.3) {
        status = 'marginal';
        detail = `${temp}°C is marginal for normal growth.`;
        warnings.push(`Thermal stress warning: ${temp}°C is near boundary limits (${crop.minTemperature}°C - ${crop.maxTemperature}°C).`);
      } else {
        status = 'unsuitable';
        detail = `${temp}°C exceeds biological tolerance thresholds.`;
        warnings.push(`Unviable temperature: ${temp}°C is outside survivable range.`);
      }

      factorScores.temperature = {
        factor: 'Temperature',
        weight,
        score,
        userValue: `${temp}°C`,
        optimalRange: `${crop.optimalTempMin}°C - ${crop.optimalTempMax}°C`,
        status,
        detail
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.temperature = {
        factor: 'Temperature',
        weight: FACTOR_WEIGHTS.temperature,
        score: 0,
        userValue: null,
        optimalRange: `${crop.optimalTempMin}°C - ${crop.optimalTempMax}°C`,
        status: 'missing',
        detail: 'Ambient temperature was not specified.'
      };
    }

    // 4. Rainfall
    if (input.rainfall !== null && input.rainfall !== undefined && !isNaN(Number(input.rainfall))) {
      const weight = FACTOR_WEIGHTS.rainfall;
      applicableWeightSum += weight;
      const rain = Number(input.rainfall);
      let effectiveRain = rain;
      if (input.irrigationAvailable && rain < crop.minRainfall) {
        effectiveRain = rain + (input.waterAvailability === 'High' ? 400 : 200);
      }
      const score = this.calculateRangeScore(effectiveRain, crop.minRainfall, crop.optimalRainfallMin, crop.optimalRainfallMax, crop.maxRainfall);

      factorScores.rainfall = {
        factor: 'Rainfall',
        weight,
        score,
        userValue: `${rain} mm`,
        optimalRange: `${crop.optimalRainfallMin} - ${crop.optimalRainfallMax} mm`,
        status: score >= 0.9 ? 'optimal' : score >= 0.6 ? 'moderate' : 'marginal',
        detail: score >= 0.9 ? `${rain} mm precipitation aligns with crop requirement.` : `${rain} mm departs from optimal.`
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.rainfall = {
        factor: 'Rainfall',
        weight: FACTOR_WEIGHTS.rainfall,
        score: 0,
        userValue: null,
        optimalRange: `${crop.optimalRainfallMin} - ${crop.optimalRainfallMax} mm`,
        status: 'missing',
        detail: 'Rainfall data was not specified.'
      };
    }

    // 5. Nitrogen
    if (input.nitrogen !== null && input.nitrogen !== undefined && !isNaN(Number(input.nitrogen))) {
      const weight = FACTOR_WEIGHTS.nitrogen;
      applicableWeightSum += weight;
      const n = input.inputUnits?.npk === 'ppm' ? Math.round(Number(input.nitrogen) * 2.24) : Number(input.nitrogen);
      const score = this.calculateNutrientScore(n, crop.npkRequirement.n);
      factorScores.nitrogen = {
        factor: 'Nitrogen (N)',
        weight,
        score,
        userValue: `${input.nitrogen} kg/ha`,
        optimalRange: `${crop.npkRequirement.n.optimalMin}-${crop.npkRequirement.n.optimalMax} kg/ha`,
        status: score >= 0.85 ? 'optimal' : score >= 0.5 ? 'moderate' : 'marginal',
        detail: score >= 0.85 ? 'Nitrogen satisfies vegetative demand.' : 'Nitrogen departs from target range.'
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.nitrogen = {
        factor: 'Nitrogen (N)',
        weight: FACTOR_WEIGHTS.nitrogen,
        score: 0,
        userValue: null,
        optimalRange: `${crop.npkRequirement.n.optimalMin}-${crop.npkRequirement.n.optimalMax} kg/ha`,
        status: 'missing',
        detail: 'Soil Nitrogen was not measured.'
      };
    }

    // 6. Phosphorus
    if (input.phosphorus !== null && input.phosphorus !== undefined && !isNaN(Number(input.phosphorus))) {
      const weight = FACTOR_WEIGHTS.phosphorus;
      applicableWeightSum += weight;
      const p = input.inputUnits?.npk === 'ppm' ? Math.round(Number(input.phosphorus) * 2.24) : Number(input.phosphorus);
      const score = this.calculateNutrientScore(p, crop.npkRequirement.p);
      factorScores.phosphorus = {
        factor: 'Phosphorus (P)',
        weight,
        score,
        userValue: `${input.phosphorus} kg/ha`,
        optimalRange: `${crop.npkRequirement.p.optimalMin}-${crop.npkRequirement.p.optimalMax} kg/ha`,
        status: score >= 0.85 ? 'optimal' : score >= 0.5 ? 'moderate' : 'marginal',
        detail: score >= 0.85 ? 'Phosphorus supports root development.' : 'Phosphorus departs from optimal.'
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.phosphorus = {
        factor: 'Phosphorus (P)',
        weight: FACTOR_WEIGHTS.phosphorus,
        score: 0,
        userValue: null,
        optimalRange: `${crop.npkRequirement.p.optimalMin}-${crop.npkRequirement.p.optimalMax} kg/ha`,
        status: 'missing',
        detail: 'Soil Phosphorus was not measured.'
      };
    }

    // 7. Potassium
    if (input.potassium !== null && input.potassium !== undefined && !isNaN(Number(input.potassium))) {
      const weight = FACTOR_WEIGHTS.potassium;
      applicableWeightSum += weight;
      const k = input.inputUnits?.npk === 'ppm' ? Math.round(Number(input.potassium) * 2.24) : Number(input.potassium);
      const score = this.calculateNutrientScore(k, crop.npkRequirement.k);
      factorScores.potassium = {
        factor: 'Potassium (K)',
        weight,
        score,
        userValue: `${input.potassium} kg/ha`,
        optimalRange: `${crop.npkRequirement.k.optimalMin}-${crop.npkRequirement.k.optimalMax} kg/ha`,
        status: score >= 0.85 ? 'optimal' : score >= 0.5 ? 'moderate' : 'marginal',
        detail: score >= 0.85 ? 'Potassium supports stress resilience.' : 'Potassium departs from optimal.'
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.potassium = {
        factor: 'Potassium (K)',
        weight: FACTOR_WEIGHTS.potassium,
        score: 0,
        userValue: null,
        optimalRange: `${crop.npkRequirement.k.optimalMin}-${crop.npkRequirement.k.optimalMax} kg/ha`,
        status: 'missing',
        detail: 'Soil Potassium was not measured.'
      };
    }

    // 8. Humidity
    if (input.humidity !== null && input.humidity !== undefined && !isNaN(Number(input.humidity))) {
      const weight = FACTOR_WEIGHTS.humidity;
      applicableWeightSum += weight;
      const hum = Number(input.humidity);
      const score = this.calculateRangeScore(hum, crop.minHumidity, crop.optimalHumidityMin, crop.optimalHumidityMax, crop.maxHumidity);
      factorScores.humidity = {
        factor: 'Relative Humidity',
        weight,
        score,
        userValue: `${hum}%`,
        optimalRange: `${crop.optimalHumidityMin}% - ${crop.optimalHumidityMax}%`,
        status: score >= 0.8 ? 'optimal' : 'marginal',
        detail: `Relative humidity of ${hum}%.`
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.humidity = {
        factor: 'Relative Humidity',
        weight: FACTOR_WEIGHTS.humidity,
        score: 0,
        userValue: null,
        optimalRange: `${crop.optimalHumidityMin}% - ${crop.optimalHumidityMax}%`,
        status: 'missing',
        detail: 'Relative humidity was not specified.'
      };
    }

    // 9. Season
    if (input.season && input.season !== 'Unknown') {
      const weight = FACTOR_WEIGHTS.season;
      applicableWeightSum += weight;
      const isSeasonMatch = crop.seasons.includes(input.season) || crop.seasons.includes('All Season');
      const score = isSeasonMatch ? 1.0 : 0.15;
      if (!isSeasonMatch) {
        warnings.push(`Season mismatch: Cultivated typically during ${crop.seasons.join(', ')}.`);
      }
      factorScores.season = {
        factor: 'Growing Season',
        weight,
        score,
        userValue: input.season,
        optimalRange: crop.seasons.join(', '),
        status: isSeasonMatch ? 'optimal' : 'marginal',
        detail: isSeasonMatch ? `Fits ${input.season} season.` : `Unfavorable season.`
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.season = {
        factor: 'Growing Season',
        weight: FACTOR_WEIGHTS.season,
        score: 0,
        userValue: null,
        optimalRange: crop.seasons.join(', '),
        status: 'missing',
        detail: 'Season was not selected.'
      };
    }

    let finalScore = 0;
    if (applicableWeightSum > 0) {
      finalScore = Math.round((totalWeightedScore / applicableWeightSum) * 100);
    }

    let category: CropRecommendationResult['category'] = 'Marginally Suitable';
    if (finalScore >= 80) category = 'Highly Suitable';
    else if (finalScore >= 65) category = 'Moderately Suitable';
    else if (finalScore >= 50) category = 'Marginally Suitable';
    else category = 'Not Recommended';

    const soilScore = this.aggregateSubScore([factorScores.soilType, factorScores.soilPh]);
    const climateScore = this.aggregateSubScore([factorScores.temperature, factorScores.humidity]);
    const nutrientScore = this.aggregateSubScore([factorScores.nitrogen, factorScores.phosphorus, factorScores.potassium]);
    const waterScore = this.aggregateSubScore([factorScores.rainfall]);

    return {
      crop,
      suitabilityScore: Math.max(0, Math.min(100, finalScore)),
      category,
      rank: 0,
      soilCompatibility: soilScore,
      climateCompatibility: climateScore,
      nutrientCompatibility: nutrientScore,
      waterCompatibility: waterScore,
      factorScores,
      explanation: {
        summary: `${crop.name} suitability score: ${finalScore}% (${category}).`,
        positiveFactors: [],
        negativeFactors: [],
        missingInputs: []
      },
      warnings
    };
  }

  protected calculateRangeScore(val: number, min: number, optMin: number, optMax: number, max: number): number {
    if (val >= optMin && val <= optMax) return 1.0;
    if (val >= min && val < optMin) {
      const span = optMin - min;
      return span <= 0 ? 0.5 : 0.5 + 0.5 * ((val - min) / span);
    }
    if (val > optMax && val <= max) {
      const span = max - optMax;
      return span <= 0 ? 0.5 : 0.5 + 0.5 * ((max - val) / span);
    }
    if (val < min) {
      const delta = min - val;
      return Math.max(0.05, 0.45 - Math.min(0.4, (delta / Math.max(1, min)) * 0.4));
    }
    if (val > max) {
      const delta = val - max;
      return Math.max(0.05, 0.45 - Math.min(0.4, (delta / Math.max(1, max)) * 0.4));
    }
    return 0.1;
  }

  protected calculateNutrientScore(val: number, range: CropProfile['npkRequirement']['n']): number {
    if (val >= range.optimalMin && val <= range.optimalMax) return 1.0;
    if (val >= range.min && val <= range.max) return 0.8;
    return val < range.min ? 0.6 : 0.5;
  }

  protected aggregateSubScore(factors: FactorScore[]): number {
    const valid = factors.filter(f => f.status !== 'missing');
    if (valid.length === 0) return 70;
    const total = valid.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round((total / valid.length) * 100);
  }
}
