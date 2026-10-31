import { GoogleGenerativeAI } from '@google/generative-ai';
import { CropRecommendationResult, FactorScore, RecommendationInput } from '@agrosmart/shared';

let geminiClient: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
  try {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
  } catch (err) {
    console.warn('[Gemini Service] Initialization failed, using deterministic explanations:', err);
  }
}

/**
 * Generates transparent agronomic explanation
 */
export async function generateExplanation(
  res: CropRecommendationResult,
  input: RecommendationInput
): Promise<CropRecommendationResult['explanation']> {
  const positiveFactors: string[] = [];
  const negativeFactors: string[] = [];
  const missingInputs: string[] = [];

  // Inspect factor scores
  for (const f of Object.values(res.factorScores) as FactorScore[]) {
    if (f.status === 'optimal') {
      positiveFactors.push(`${f.factor}: ${f.detail}`);
    } else if (f.status === 'moderate') {
      positiveFactors.push(`${f.factor}: Acceptable level (${f.detail})`);
    } else if (f.status === 'marginal' || f.status === 'unsuitable') {
      negativeFactors.push(`${f.factor}: ${f.detail}`);
    } else if (f.status === 'missing') {
      missingInputs.push(`${f.factor} (unspecified)`);
    }
  }

  // Construct deterministic summary sentence
  let summary = '';
  if (res.suitabilityScore >= 80) {
    summary = `${res.crop.name} is highly recommended (${res.suitabilityScore}% match) because your entered soil and environmental conditions align well with its optimal agronomic growth parameters.`;
  } else if (res.suitabilityScore >= 65) {
    summary = `${res.crop.name} is moderately viable (${res.suitabilityScore}% match). Favorable overall conditions exist, but minor constraints or management interventions (e.g. soil amendments or targeted irrigation) are required.`;
  } else if (res.suitabilityScore >= 50) {
    summary = `${res.crop.name} is marginally suitable (${res.suitabilityScore}% match) due to notable discrepancies in climate, soil texture, or moisture balance. Proceed with caution.`;
  } else {
    summary = `${res.crop.name} is not recommended (${res.suitabilityScore}% match) for the current season and field environment due to significant agronomic incompatibilities.`;
  }

  if (missingInputs.length > 0) {
    summary += ` Note: ${missingInputs.join(', ')} were not supplied, which introduces advisory uncertainty.`;
  }

  let geminiExplanation: string | undefined = undefined;

  // Optional Gemini API enhancement if available
  if (geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are an expert agricultural extension advisor.
Rewrite the following deterministic recommendation summary for a farmer in warm, clear, empowering language:
Crop: ${res.crop.name}
Suitability Score: ${res.suitabilityScore}% (${res.category})
Positive Points: ${positiveFactors.slice(0, 3).join('; ')}
Limiting Factors: ${negativeFactors.slice(0, 2).join('; ') || 'None noted'}
Missing Info: ${missingInputs.join(', ') || 'None'}
Keep the response to 2 concise sentences. Do not alter scores or add unverifiable claims.`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (text && text.trim().length > 10) {
        geminiExplanation = text.trim();
      }
    } catch (apiErr) {
      // Graceful fallback: do not interrupt engine
      console.info('[Gemini API] Skipped or quota exhausted, relying on deterministic templates.');
    }
  }

  return {
    summary,
    positiveFactors,
    negativeFactors,
    missingInputs,
    geminiExplanation
  };
}
