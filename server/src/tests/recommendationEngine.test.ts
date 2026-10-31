import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CropRecommendationResult } from '@agrosmart/shared';
import { RecommendationEngine } from '../services/recommendationEngine.js';
import { CROPS_DATASET } from '../data/cropDataset.js';
import { assessInputQuality, recommendationInputSchema } from '../validators/recommendationValidator.js';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios.js';

describe('AgroSmart AI Recommendation Engine & Validation Suite', () => {
  const engine = new RecommendationEngine(CROPS_DATASET);

  test('1. Input Validation: Validates correct agronomic input schemas', () => {
    const validInput = {
      soilType: 'Loamy',
      soilPh: 6.5,
      nitrogen: 120,
      phosphorus: 50,
      potassium: 60,
      temperature: 24,
      rainfall: 800,
      humidity: 70,
      season: 'Kharif'
    };
    const parsed = recommendationInputSchema.safeParse(validInput);
    assert.strictEqual(parsed.success, true);
  });

  test('2. Input Validation: Rejects impossible soil pH values (<3.0 or >11.0)', () => {
    const invalidLowPh = { soilPh: 1.5 };
    const parsedLow = recommendationInputSchema.safeParse(invalidLowPh);
    assert.strictEqual(parsedLow.success, false);

    const invalidHighPh = { soilPh: 13.5 };
    const parsedHigh = recommendationInputSchema.safeParse(invalidHighPh);
    assert.strictEqual(parsedHigh.success, false);
  });

  test('3. Repeatability: Engine produces identical results for identical inputs', async () => {
    const scenario = SAMPLE_SCENARIOS[0].input;
    const run1 = await engine.evaluate(scenario);
    const run2 = await engine.evaluate(scenario);

    assert.strictEqual(run1.recommendations.length, run2.recommendations.length);
    assert.strictEqual(run1.recommendations[0].crop.id, run2.recommendations[0].crop.id);
    assert.strictEqual(run1.recommendations[0].suitabilityScore, run2.recommendations[0].suitabilityScore);
    assert.strictEqual(run1.inputCompletenessScore, run2.inputCompletenessScore);
  });

  test('4. Score Boundaries: All crop suitability scores must remain within [0, 100]', async () => {
    // Extreme environmental stress
    const extremeInput = {
      soilType: 'Sandy' as const,
      soilPh: 3.5,
      temperature: 52,
      rainfall: 20,
      humidity: 10,
      season: 'Rabi' as const
    };
    const res = await engine.evaluate(extremeInput);

    for (const r of res.recommendations) {
      assert.ok(r.suitabilityScore >= 0, `Score ${r.suitabilityScore} was below 0`);
      assert.ok(r.suitabilityScore <= 100, `Score ${r.suitabilityScore} exceeded 100`);
    }
  });

  test('5. Missing Inputs: Safely handles unknown or unspecified factors with confidence degradation', async () => {
    // Scenario 5: Missing NPK
    const incompleteInput = SAMPLE_SCENARIOS[4].input;
    const res = await engine.evaluate(incompleteInput);

    assert.ok(res.inputCompletenessScore < 100, 'Completeness should reflect missing NPK weights');
    assert.ok(res.inputCompletenessScore >= 60, 'Completeness should be around 70%');
    assert.ok(res.recommendations.length > 0, 'Should still produce ranked recommendations');
    
    // Check that missing inputs are captured in explanation
    const topCrop = res.recommendations[0];
    assert.ok(topCrop.explanation.missingInputs.length >= 3, 'Should list missing N, P, and K');
  });

  test('6. Scenario Consistency: High rainfall & clay soil favors Rice over drought crops', async () => {
    const wetScenario = SAMPLE_SCENARIOS[0].input; // Warm & Humid
    const res = await engine.evaluate(wetScenario);

    const rice = res.recommendations.find((r: CropRecommendationResult) => r.crop.name === 'Rice');
    const pearlMillet = res.recommendations.find((r: CropRecommendationResult) => r.crop.name === 'Pearl Millet');

    assert.ok(rice, 'Rice must be evaluated');
    assert.ok(pearlMillet, 'Pearl Millet must be evaluated');
    assert.ok(
      rice.suitabilityScore > pearlMillet.suitabilityScore,
      `Rice (${rice.suitabilityScore}) should score higher than Pearl Millet (${pearlMillet.suitabilityScore}) under high rainfall flood conditions`
    );
  });

  test('7. Scenario Consistency: Cool Rabi winter favors Wheat over tropical crops', async () => {
    const coolScenario = SAMPLE_SCENARIOS[1].input; // Cool Season
    const res = await engine.evaluate(coolScenario);

    const wheat = res.recommendations.find((r: CropRecommendationResult) => r.crop.name === 'Wheat');
    const cotton = res.recommendations.find((r: CropRecommendationResult) => r.crop.name === 'Cotton');

    assert.ok(wheat, 'Wheat must be evaluated');
    assert.ok(cotton, 'Cotton must be evaluated');
    assert.ok(
      wheat.suitabilityScore > cotton.suitabilityScore,
      `Wheat (${wheat.suitabilityScore}) should score higher than Cotton (${cotton.suitabilityScore}) in cool winter Rabi conditions`
    );
  });

  test('8. Input Quality Checker: Correctly detects acidity and missing values', () => {
    const quality = assessInputQuality({
      soilPh: 4.2,
      temperature: 25,
      season: 'Kharif'
    });

    assert.strictEqual(quality.isValid, true);
    assert.ok(quality.warnings.some(w => w.includes('acidic')), 'Should warn about acidic soil');
    assert.ok(quality.warnings.some(w => w.includes('NPK nutrients')), 'Should warn about missing NPK');
    assert.ok(quality.completenessPercentage < 50, 'Completeness should be low');
  });
});
