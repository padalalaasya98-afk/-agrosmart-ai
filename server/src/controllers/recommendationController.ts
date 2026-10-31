import { Request, Response } from 'express';
import { RecommendationEngine } from '../services/recommendationEngine.js';
import { dbService } from '../services/dbService.js';
import { assessInputQuality, recommendationInputSchema } from '../validators/recommendationValidator.js';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios.js';
import { fetchLocationWeather } from '../services/weatherService.js';
import { RecommendationInput } from '@agrosmart/shared';

const engine = new RecommendationEngine();

export const recommendationController = {
  // POST /api/recommendations
  async createRecommendation(req: Request, res: Response) {
    try {
      // Validate input using Zod
      const parseResult = recommendationInputSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed on recommendation inputs.',
          details: parseResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
      }

      const input = parseResult.data as unknown as RecommendationInput;
      const quality = assessInputQuality(input);

      // Execute recommendation engine
      const recommendationResponse = await engine.evaluate(input);

      // Save to database / memory
      const recordId = await dbService.saveRecommendationRequest(input, recommendationResponse, req.body.userId);

      return res.status(200).json({
        success: true,
        recordId,
        inputQuality: quality,
        data: recommendationResponse
      });
    } catch (err) {
      console.error('Error generating recommendation:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to process crop recommendation.',
        message: (err as Error).message
      });
    }
  },

  // GET /api/recommendations/:id
  async getRecommendationById(req: Request, res: Response) {
    try {
      const record = await dbService.getRecommendationById(req.params.id);
      if (!record) {
        return res.status(404).json({ success: false, error: 'Recommendation record not found.' });
      }
      return res.json({ success: true, record });
    } catch (err) {
      console.error('Error fetching recommendation by ID:', err);
      return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  },

  // GET /api/recommendations/history
  async getHistory(req: Request, res: Response) {
    try {
      const userId = (req.query.userId as string) || null;
      const history = await dbService.getHistory(userId);
      return res.json({
        success: true,
        count: history.length,
        history
      });
    } catch (err) {
      console.error('Error fetching history:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve recommendation history.' });
    }
  },

  // DELETE /api/recommendations/:id
  async deleteRecommendation(req: Request, res: Response) {
    try {
      const userId = (req.query.userId as string) || null;
      const deleted = await dbService.deleteHistory(req.params.id, userId);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Record not found or already deleted.' });
      }
      return res.json({ success: true, message: 'Recommendation record successfully removed.' });
    } catch (err) {
      console.error('Error deleting recommendation:', err);
      return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  },

  // GET /api/sample-input
  async getSampleScenarios(req: Request, res: Response) {
    return res.json({
      success: true,
      scenarios: SAMPLE_SCENARIOS
    });
  },

  // GET /api/weather
  async getWeather(req: Request, res: Response) {
    try {
      const location = (req.query.location as string) || 'Nagpur';
      const weather = await fetchLocationWeather(location);
      return res.json({ success: true, weather });
    } catch (err) {
      console.error('Error fetching weather:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch weather data.' });
    }
  },

  // GET /api/metadata
  async getMetadata(req: Request, res: Response) {
    return res.json({
      success: true,
      appName: 'AgroSmart AI',
      problemId: 'HACK-P302',
      version: '1.2.0',
      tagline: 'Grow Smarter, Farm Better.',
      engine: 'Deterministic Multi-Factor Weighted Agro-Suitability Engine',
      supportedCropsCount: 15,
      supportedSoilTypes: ['Sandy', 'Clay', 'Loamy', 'Silty', 'Black', 'Red', 'Alluvial'],
      supportedSeasons: ['Kharif', 'Rabi', 'Zaid'],
      factorWeights: {
        soilType: '20%',
        soilPh: '15%',
        temperature: '15%',
        rainfall: '10%',
        nitrogen: '10%',
        phosphorus: '10%',
        potassium: '10%',
        humidity: '5%',
        season: '5%'
      },
      referenceSources: [
        'Indian Council of Agricultural Research (ICAR)',
        'Food and Agriculture Organization (FAO) EcoCrop Database',
        'National Food Security Mission (NFSM)',
        'Tamil Nadu Agricultural University (TNAU) Agritech Portal'
      ]
    });
  }
};
