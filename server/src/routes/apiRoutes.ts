import { Router } from 'express';
import { cropController } from '../controllers/cropController.js';
import { recommendationController } from '../controllers/recommendationController.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'AgroSmart AI Backend API'
  });
});

// App metadata & sample scenarios
router.get('/metadata', recommendationController.getMetadata);
router.get('/sample-input', recommendationController.getSampleScenarios);
router.get('/weather', recommendationController.getWeather);

// Crop catalog & comparison
router.get('/crops', cropController.getAllCrops);
router.get('/crops/:id', cropController.getCropById);
router.post('/crops/compare', cropController.compareCrops);

// Recommendation engine & history
router.post('/recommendations', recommendationController.createRecommendation);
router.get('/recommendations/history', recommendationController.getHistory);
router.get('/recommendations/:id', recommendationController.getRecommendationById);
router.delete('/recommendations/:id', recommendationController.deleteRecommendation);

export default router;
