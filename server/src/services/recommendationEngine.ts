import {
  CropProfile,
  CropRecommendationResult,
  FactorScore,
  RecommendationInput,
  RecommendationResponse
} from '@agrosmart/shared';
import { CROPS_DATASET } from '../data/cropDataset.js';
import { generateExplanation } from './explanationService.js';

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

export class RecommendationEngine {
  private crops: CropProfile[];

  constructor(cropList: CropProfile[] = CROPS_DATASET) {
    this.crops = cropList;
  }

  /**
   * Main recommendation runner
   */
  public async evaluate(input: RecommendationInput): Promise<RecommendationResponse> {
    const completenessScore = this.calculateCompleteness(input);
    const results: CropRecommendationResult[] = [];

    for (const crop of this.crops) {
      const cropResult = this.evaluateSingleCrop(crop, input);
      results.push(cropResult);
    }

    // Sort by suitability score descending
    results.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    // Assign ranking 1, 2, 3...
    results.forEach((r, index) => {
      r.rank = index + 1;
    });

    // Generate explanations for top results
    for (const res of results) {
      res.explanation = await generateExplanation(res, input);
    }

    return {
      requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      inputSummary: input,
      inputCompletenessScore: Math.round(completenessScore),
      recommendations: results,
      appliedWeights: FACTOR_WEIGHTS,
      engineVersion: '1.2.0-deterministic',
      disclaimer: 'AgroSmart AI recommendations are scientific decision-support guidelines based on ICAR/FAO suitability ranges and do not constitute an agronomic guarantee. Local microclimate, pest pressures, and seed varieties may alter field outcomes.'
    };
  }

  /**
   * Evaluates a single crop against inputs
   */
  public evaluateSingleCrop(crop: CropProfile, input: RecommendationInput): CropRecommendationResult {
    const factorScores: Record<string, FactorScore> = {};
    const warnings: string[] = [];

    let totalWeightedScore = 0;
    let applicableWeightSum = 0;

    // 1. Soil Type Evaluation (Weight: 20%)
    if (input.soilType && input.soilType !== 'Unknown') {
      const weight = FACTOR_WEIGHTS.soilType;
      applicableWeightSum += weight;
      const isMatch = crop.suitableSoilTypes.includes(input.soilType);
      
      let score = isMatch ? 1.0 : 0.25;
      const status = isMatch ? 'optimal' : 'marginal';
      const detail = isMatch
        ? `${input.soilType} soil is an ideal, verified texture for ${crop.name}.`
        : `${input.soilType} soil is not typically preferred for ${crop.name} (Prefers: ${crop.suitableSoilTypes.join(', ')}).`;

      if (!isMatch) {
        warnings.push(`Soil texture mismatch: Entered ${input.soilType}, but ${crop.name} thrives best in ${crop.suitableSoilTypes.join(', ')}.`);
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

    // 2. Soil pH Evaluation (Weight: 15%)
    if (input.soilPh !== null && input.soilPh !== undefined && !isNaN(Number(input.soilPh))) {
      const weight = FACTOR_WEIGHTS.soilPh;
      applicableWeightSum += weight;
      const ph = Number(input.soilPh);
      const score = this.calculateRangeScore(ph, crop.minPh, crop.optimalPhMin, crop.optimalPhMax, crop.maxPh);
      
      let status: FactorScore['status'] = 'optimal';
      let detail = `pH ${ph} is within the optimal growth band (${crop.optimalPhMin}-${crop.optimalPhMax}).`;

      if (score >= 0.9) {
        status = 'optimal';
      } else if (score >= 0.6) {
        status = 'moderate';
        detail = `pH ${ph} is acceptable, but slightly outside optimal (${crop.optimalPhMin}-${crop.optimalPhMax}).`;
      } else if (score >= 0.3) {
        status = 'marginal';
        detail = `pH ${ph} is marginal for ${crop.name}. May cause micronutrient lockup.`;
        warnings.push(`Marginal soil pH (${ph}): ${crop.name} performs best in pH ${crop.optimalPhMin}-${crop.optimalPhMax}. Consider soil amendment.`);
      } else {
        status = 'unsuitable';
        detail = `pH ${ph} is severely stressful for ${crop.name}. High risk of nutrient toxicity or deficiency.`;
        warnings.push(`Severe pH limitation (${ph}): Exceeds tolerance band ${crop.minPh}-${crop.maxPh}.`);
      }

      factorScores.soilPh = {
        factor: 'Soil pH',
        weight,
        score,
        userValue: ph,
        optimalRange: `${crop.optimalPhMin} - ${crop.optimalPhMax} (Tolerance: ${crop.minPh}-${crop.maxPh})`,
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
        detail: 'Soil pH was not measured or specified.'
      };
    }

    // 3. Temperature Evaluation (Weight: 15%)
    if (input.temperature !== null && input.temperature !== undefined && !isNaN(Number(input.temperature))) {
      const weight = FACTOR_WEIGHTS.temperature;
      applicableWeightSum += weight;
      const temp = Number(input.temperature);
      const score = this.calculateRangeScore(temp, crop.minTemperature, crop.optimalTempMin, crop.optimalTempMax, crop.maxTemperature);
      
      let status: FactorScore['status'] = 'optimal';
      let detail = `${temp}°C is within ideal temperature range (${crop.optimalTempMin}°C - ${crop.optimalTempMax}°C).`;

      if (score >= 0.9) {
        status = 'optimal';
      } else if (score >= 0.6) {
        status = 'moderate';
        detail = `${temp}°C is viable, though slightly outside the peak vegetative thermal range.`;
      } else if (score >= 0.3) {
        status = 'marginal';
        detail = `${temp}°C is marginal; thermal stress may impact anthesis or germination.`;
        warnings.push(`Thermal stress warning: ${temp}°C is near boundary limits (${crop.minTemperature}°C - ${crop.maxTemperature}°C).`);
      } else {
        status = 'unsuitable';
        detail = `${temp}°C exceeds biological tolerance thresholds. Severe heat/chill injury likely.`;
        warnings.push(`Unviable temperature: ${temp}°C is outside survivable range ${crop.minTemperature}°C - ${crop.maxTemperature}°C.`);
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

    // 4. Rainfall / Water Evaluation (Weight: 10%)
    if (input.rainfall !== null && input.rainfall !== undefined && !isNaN(Number(input.rainfall))) {
      const weight = FACTOR_WEIGHTS.rainfall;
      applicableWeightSum += weight;
      const rain = Number(input.rainfall);
      
      // If farmer has irrigation available and water is high/medium, moderate low rainfall penalty
      let effectiveRain = rain;
      if (input.irrigationAvailable && rain < crop.minRainfall) {
        effectiveRain = rain + (input.waterAvailability === 'High' ? 400 : 200);
      }

      const score = this.calculateRangeScore(effectiveRain, crop.minRainfall, crop.optimalRainfallMin, crop.optimalRainfallMax, crop.maxRainfall);
      
      let status: FactorScore['status'] = 'optimal';
      let detail = `${rain} mm annual/seasonal precipitation aligns with crop requirement (${crop.optimalRainfallMin}-${crop.optimalRainfallMax} mm).`;

      if (score >= 0.9) {
        status = 'optimal';
      } else if (score >= 0.6) {
        status = 'moderate';
        detail = `${rain} mm is adequate, though supplemental irrigation may be required.`;
      } else if (score >= 0.3) {
        status = 'marginal';
        detail = `${rain} mm departs significantly from crop requirements.`;
        if (rain < crop.minRainfall) {
          warnings.push(`Water deficit warning: Rainfall (${rain} mm) is below normal threshold (${crop.minRainfall} mm). Assured irrigation essential.`);
        } else {
          warnings.push(`Excess water warning: Rainfall (${rain} mm) exceeds optimal conditions; effective field drainage needed.`);
        }
      } else {
        status = 'unsuitable';
        detail = `Precipitation (${rain} mm) is severely mismatched with crop water needs.`;
        warnings.push(`Critical water mismatch: ${rain} mm rainfall deviates heavily from crop tolerance.`);
      }

      factorScores.rainfall = {
        factor: 'Rainfall',
        weight,
        score,
        userValue: `${rain} mm`,
        optimalRange: `${crop.optimalRainfallMin} - ${crop.optimalRainfallMax} mm`,
        status,
        detail
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

    // 5. Nitrogen Evaluation (Weight: 10%)
    if (input.nitrogen !== null && input.nitrogen !== undefined && !isNaN(Number(input.nitrogen))) {
      const weight = FACTOR_WEIGHTS.nitrogen;
      applicableWeightSum += weight;
      const n = this.normalizeNutrient(Number(input.nitrogen), input.inputUnits?.npk);
      const score = this.calculateNutrientScore(n, crop.npkRequirement.n);
      
      factorScores.nitrogen = {
        factor: 'Nitrogen (N)',
        weight,
        score,
        userValue: `${input.nitrogen} ${input.inputUnits?.npk || 'kg/ha'}`,
        optimalRange: `${crop.npkRequirement.n.optimalMin} - ${crop.npkRequirement.n.optimalMax} kg/ha`,
        status: score >= 0.85 ? 'optimal' : score >= 0.5 ? 'moderate' : 'marginal',
        detail: score >= 0.85
          ? `Nitrogen level satisfies crop vegetative demand.`
          : `Nitrogen level departs from target range (${crop.npkRequirement.n.optimalMin}-${crop.npkRequirement.n.optimalMax} kg/ha).`
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.nitrogen = {
        factor: 'Nitrogen (N)',
        weight: FACTOR_WEIGHTS.nitrogen,
        score: 0,
        userValue: null,
        optimalRange: `${crop.npkRequirement.n.optimalMin} - ${crop.npkRequirement.n.optimalMax} kg/ha`,
        status: 'missing',
        detail: 'Soil Nitrogen (N) was not measured.'
      };
    }

    // 6. Phosphorus Evaluation (Weight: 10%)
    if (input.phosphorus !== null && input.phosphorus !== undefined && !isNaN(Number(input.phosphorus))) {
      const weight = FACTOR_WEIGHTS.phosphorus;
      applicableWeightSum += weight;
      const p = this.normalizeNutrient(Number(input.phosphorus), input.inputUnits?.npk);
      const score = this.calculateNutrientScore(p, crop.npkRequirement.p);
      
      factorScores.phosphorus = {
        factor: 'Phosphorus (P)',
        weight,
        score,
        userValue: `${input.phosphorus} ${input.inputUnits?.npk || 'kg/ha'}`,
        optimalRange: `${crop.npkRequirement.p.optimalMin} - ${crop.npkRequirement.p.optimalMax} kg/ha`,
        status: score >= 0.85 ? 'optimal' : score >= 0.5 ? 'moderate' : 'marginal',
        detail: score >= 0.85
          ? `Phosphorus is well-suited for root development.`
          : `Phosphorus availability departs from optimal (${crop.npkRequirement.p.optimalMin}-${crop.npkRequirement.p.optimalMax} kg/ha).`
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.phosphorus = {
        factor: 'Phosphorus (P)',
        weight: FACTOR_WEIGHTS.phosphorus,
        score: 0,
        userValue: null,
        optimalRange: `${crop.npkRequirement.p.optimalMin} - ${crop.npkRequirement.p.optimalMax} kg/ha`,
        status: 'missing',
        detail: 'Soil Phosphorus (P) was not measured.'
      };
    }

    // 7. Potassium Evaluation (Weight: 10%)
    if (input.potassium !== null && input.potassium !== undefined && !isNaN(Number(input.potassium))) {
      const weight = FACTOR_WEIGHTS.potassium;
      applicableWeightSum += weight;
      const k = this.normalizeNutrient(Number(input.potassium), input.inputUnits?.npk);
      const score = this.calculateNutrientScore(k, crop.npkRequirement.k);
      
      factorScores.potassium = {
        factor: 'Potassium (K)',
        weight,
        score,
        userValue: `${input.potassium} ${input.inputUnits?.npk || 'kg/ha'}`,
        optimalRange: `${crop.npkRequirement.k.optimalMin} - ${crop.npkRequirement.k.optimalMax} kg/ha`,
        status: score >= 0.85 ? 'optimal' : score >= 0.5 ? 'moderate' : 'marginal',
        detail: score >= 0.85
          ? `Potassium level supports stress resilience and yield quality.`
          : `Potassium availability deviates from optimal (${crop.npkRequirement.k.optimalMin}-${crop.npkRequirement.k.optimalMax} kg/ha).`
      };
      totalWeightedScore += score * weight;
    } else {
      factorScores.potassium = {
        factor: 'Potassium (K)',
        weight: FACTOR_WEIGHTS.potassium,
        score: 0,
        userValue: null,
        optimalRange: `${crop.npkRequirement.k.optimalMin} - ${crop.npkRequirement.k.optimalMax} kg/ha`,
        status: 'missing',
        detail: 'Soil Potassium (K) was not measured.'
      };
    }

    // 8. Humidity Evaluation (Weight: 5%)
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
        status: score >= 0.8 ? 'optimal' : score >= 0.5 ? 'moderate' : 'marginal',
        detail: score >= 0.8
          ? `Relative humidity of ${hum}% is conducive for this crop canopy.`
          : `Humidity (${hum}%) departs from typical crop preferences.`
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

    // 9. Growing Season Evaluation (Weight: 5%)
    if (input.season && input.season !== 'Unknown') {
      const weight = FACTOR_WEIGHTS.season;
      applicableWeightSum += weight;
      const isSeasonMatch = crop.seasons.includes(input.season) || crop.seasons.includes('All Season');
      const score = isSeasonMatch ? 1.0 : 0.15;

      if (!isSeasonMatch) {
        warnings.push(`Season mismatch: Selected season '${input.season}', but ${crop.name} is predominantly cultivated in ${crop.seasons.join(', ')}.`);
      }

      factorScores.season = {
        factor: 'Growing Season',
        weight,
        score,
        userValue: input.season,
        optimalRange: crop.seasons.join(', '),
        status: isSeasonMatch ? 'optimal' : 'marginal',
        detail: isSeasonMatch
          ? `${crop.name} aligns with the ${input.season} cultivation calendar.`
          : `Unfavorable season: typically cultivated during ${crop.seasons.join(', ')}.`
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
        detail: 'Growing season was not selected.'
      };
    }

    // Final Suitability Calculation
    // Suitability Score = 100 * Σ(weight * factor_score) / Σ(applicable_weights)
    let finalScore = 0;
    if (applicableWeightSum > 0) {
      finalScore = Math.round((totalWeightedScore / applicableWeightSum) * 100);
    }

    // Categorization
    let category: CropRecommendationResult['category'] = 'Marginally Suitable';
    if (finalScore >= 80) category = 'Highly Suitable';
    else if (finalScore >= 65) category = 'Moderately Suitable';
    else if (finalScore >= 50) category = 'Marginally Suitable';
    else category = 'Not Recommended';

    // Sub-dimension compatibility aggregations (0 - 100)
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
        summary: '',
        positiveFactors: [],
        negativeFactors: [],
        missingInputs: []
      },
      warnings
    };
  }

  /**
   * Smooth continuous curve scoring for continuous variables
   */
  private calculateRangeScore(
    val: number,
    min: number,
    optMin: number,
    optMax: number,
    max: number
  ): number {
    if (val >= optMin && val <= optMax) {
      return 1.0;
    }
    // Sub-optimal but above minimum
    if (val >= min && val < optMin) {
      const span = optMin - min;
      if (span <= 0) return 0.5;
      const progress = (val - min) / span;
      return 0.5 + 0.5 * progress; // Scales 0.50 to 1.0
    }
    // Sub-optimal but below maximum
    if (val > optMax && val <= max) {
      const span = max - optMax;
      if (span <= 0) return 0.5;
      const progress = (max - val) / span;
      return 0.5 + 0.5 * progress; // Scales 1.0 down to 0.50
    }
    // Outside absolute limits
    if (val < min) {
      const delta = min - val;
      const penalty = Math.min(0.4, (delta / Math.max(1, min)) * 0.4);
      return Math.max(0.05, 0.45 - penalty);
    }
    if (val > max) {
      const delta = val - max;
      const penalty = Math.min(0.4, (delta / Math.max(1, max)) * 0.4);
      return Math.max(0.05, 0.45 - penalty);
    }
    return 0.1;
  }

  /**
   * Nutrient scoring with generous buffer since soil NPK can be adjusted with fertilizer
   */
  private calculateNutrientScore(val: number, range: CropProfile['npkRequirement']['n']): number {
    if (val >= range.optimalMin && val <= range.optimalMax) {
      return 1.0;
    }
    if (val >= range.min && val <= range.max) {
      return 0.8;
    }
    // Fertilizer can always be supplemented, so nutrient deficiency should not be a complete fatal penalty
    if (val < range.min) {
      return 0.6;
    }
    // Excess nutrients might cause vegetative lodging
    return 0.5;
  }

  /**
   * Normalizes nutrient value (e.g. if ppm is chosen, converts to approximate kg/ha)
   */
  private normalizeNutrient(val: number, unit?: string): number {
    if (unit === 'ppm') {
      return Math.round(val * 2.24); // Standard soil science agronomy conversion
    }
    return val;
  }

  /**
   * Aggregates sub-scores (0-100)
   */
  private aggregateSubScore(factors: FactorScore[]): number {
    const validFactors = factors.filter(f => f.status !== 'missing');
    if (validFactors.length === 0) return 70; // Neutral default if not measured
    const total = validFactors.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round((total / validFactors.length) * 100);
  }

  /**
   * Calculates overall input completeness score (0-100)
   */
  private calculateCompleteness(input: RecommendationInput): number {
    let completedWeights = 0;
    if (input.soilType && input.soilType !== 'Unknown') completedWeights += FACTOR_WEIGHTS.soilType;
    if (input.soilPh !== null && input.soilPh !== undefined) completedWeights += FACTOR_WEIGHTS.soilPh;
    if (input.temperature !== null && input.temperature !== undefined) completedWeights += FACTOR_WEIGHTS.temperature;
    if (input.rainfall !== null && input.rainfall !== undefined) completedWeights += FACTOR_WEIGHTS.rainfall;
    if (input.nitrogen !== null && input.nitrogen !== undefined) completedWeights += FACTOR_WEIGHTS.nitrogen;
    if (input.phosphorus !== null && input.phosphorus !== undefined) completedWeights += FACTOR_WEIGHTS.phosphorus;
    if (input.potassium !== null && input.potassium !== undefined) completedWeights += FACTOR_WEIGHTS.potassium;
    if (input.humidity !== null && input.humidity !== undefined) completedWeights += FACTOR_WEIGHTS.humidity;
    if (input.season && input.season !== 'Unknown') completedWeights += FACTOR_WEIGHTS.season;

    return Math.min(100, Math.round(completedWeights * 100));
  }
}
