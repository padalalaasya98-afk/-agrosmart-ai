import { Request, Response } from 'express';
import { dbService } from '../services/dbService.js';
import { CropComparisonResponse, CropProfile, GrowingSeason } from '@agrosmart/shared';

export const cropController = {
  // GET /api/crops
  async getAllCrops(req: Request, res: Response) {
    try {
      const { category, season, search } = req.query;
      let crops = await dbService.getCrops();

      if (category && typeof category === 'string') {
        crops = crops.filter(c => c.category.toLowerCase() === category.toLowerCase());
      }

      if (season && typeof season === 'string') {
        crops = crops.filter(c => c.seasons.includes(season as GrowingSeason) || c.seasons.includes('All Season'));
      }

      if (search && typeof search === 'string') {
        const query = search.toLowerCase();
        crops = crops.filter(c => 
          c.name.toLowerCase().includes(query) ||
          c.scientificName.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.suitableSoilTypes.some((s: string) => s.toLowerCase().includes(query))
        );
      }

      return res.json({
        success: true,
        total: crops.length,
        crops
      });
    } catch (err) {
      console.error('Error fetching crops:', err);
      return res.status(500).json({ success: false, error: 'Internal server error while fetching crops.' });
    }
  },

  // GET /api/crops/:id
  async getCropById(req: Request, res: Response) {
    try {
      const crop = await dbService.getCropById(req.params.id);
      if (!crop) {
        return res.status(404).json({ success: false, error: `Crop '${req.params.id}' not found.` });
      }
      return res.json({ success: true, crop });
    } catch (err) {
      console.error('Error fetching crop by ID:', err);
      return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  },

  // POST /api/crops/compare
  async compareCrops(req: Request, res: Response) {
    try {
      const { cropIds } = req.body;
      if (!cropIds || !Array.isArray(cropIds) || cropIds.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Please provide an array of at least 2 crop IDs to compare.'
        });
      }

      const allCrops = await dbService.getCrops();
      const selectedCrops: CropProfile[] = [];

      for (const id of cropIds) {
        const found = allCrops.find(
          c => c.id.toLowerCase() === id.toLowerCase() || c.name.toLowerCase() === id.toLowerCase()
        );
        if (found) {
          selectedCrops.push(found);
        }
      }

      if (selectedCrops.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'At least two valid crops must be found from the provided IDs.'
        });
      }

      // Build Comparison Table Rows
      const comparisonTable = [
        {
          metric: 'Scientific Name',
          category: 'General' as const,
          description: 'Botanical classification of the plant species',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, c.scientificName]))
        },
        {
          metric: 'Crop Category',
          category: 'General' as const,
          description: 'Agronomic utility classification',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, c.category]))
        },
        {
          metric: 'Suitable Soil Types',
          category: 'Soil' as const,
          description: 'Documented viable soil textural orders',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, c.suitableSoilTypes.join(', ')]))
        },
        {
          metric: 'Optimal pH Range',
          category: 'Soil' as const,
          description: 'Target soil reaction for maximal nutrient uptake',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, `${c.optimalPhMin} - ${c.optimalPhMax} (Absolute: ${c.minPh}-${c.maxPh})`]))
        },
        {
          metric: 'Optimal Temperature',
          category: 'Climate' as const,
          description: 'Ideal vegetative and reproductive thermal band',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, `${c.optimalTempMin}°C - ${c.optimalTempMax}°C`]))
        },
        {
          metric: 'Water Requirement',
          category: 'Climate' as const,
          description: 'Overall crop water demand level',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, `${c.waterRequirement} (${c.optimalRainfallMin}-${c.optimalRainfallMax} mm)`]))
        },
        {
          metric: 'Cultivation Seasons',
          category: 'Management' as const,
          description: 'Recommended Indian cropping calendar windows',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, c.seasons.join(', ')]))
        },
        {
          metric: 'Duration to Maturity',
          category: 'Management' as const,
          description: 'Days from sowing to harvest',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, `${c.growingDurationDays.min} - ${c.growingDurationDays.max} days`]))
        },
        {
          metric: 'Nitrogen (N) Need',
          category: 'Nutrients' as const,
          description: 'Recommended Nitrogen application rate',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, `${c.npkRequirement.n.optimalMin}-${c.npkRequirement.n.optimalMax} kg/ha`]))
        },
        {
          metric: 'Phosphorus (P) Need',
          category: 'Nutrients' as const,
          description: 'Recommended Phosphorus application rate',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, `${c.npkRequirement.p.optimalMin}-${c.npkRequirement.p.optimalMax} kg/ha`]))
        },
        {
          metric: 'Potassium (K) Need',
          category: 'Nutrients' as const,
          description: 'Recommended Potassium application rate',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, `${c.npkRequirement.k.optimalMin}-${c.npkRequirement.k.optimalMax} kg/ha`]))
        },
        {
          metric: 'Major Agronomic Advantage',
          category: 'General' as const,
          description: 'Key strength for farm risk management',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, c.majorAdvantages[0] || 'High yield potential']))
        },
        {
          metric: 'Primary Cultivation Challenge',
          category: 'General' as const,
          description: 'Main biological vulnerability to monitor',
          values: Object.fromEntries(selectedCrops.map(c => [c.id, c.commonChallenges[0] || 'Moisture sensitivity']))
        }
      ];

      // Radar Chart Normalization for Visualization (0 - 100 scales)
      const radarChartData = [
        {
          metric: 'Drought Hardiness',
          fullMark: 100,
          ...Object.fromEntries(
            selectedCrops.map(c => [
              c.name,
              c.waterRequirement === 'Low' ? 95 : c.waterRequirement === 'Medium' ? 65 : 35
            ])
          )
        },
        {
          metric: 'Thermal Tolerance',
          fullMark: 100,
          ...Object.fromEntries(
            selectedCrops.map(c => [
              c.name,
              Math.min(100, Math.round(((c.maxTemperature - c.minTemperature) / 25) * 100))
            ])
          )
        },
        {
          metric: 'Soil Versatility',
          fullMark: 100,
          ...Object.fromEntries(
            selectedCrops.map(c => [c.name, Math.min(100, c.suitableSoilTypes.length * 25)])
          )
        },
        {
          metric: 'Nutrient Efficiency',
          fullMark: 100,
          ...Object.fromEntries(
            selectedCrops.map(c => [
              c.name,
              c.category === 'Pulse' || c.category === 'Oilseed' ? 90 : c.category === 'Cereal' ? 70 : 50
            ])
          )
        },
        {
          metric: 'Crop Duration (Shortness)',
          fullMark: 100,
          ...Object.fromEntries(
            selectedCrops.map(c => [
              c.name,
              Math.max(20, Math.min(100, Math.round(100 - (c.growingDurationDays.max - 70) * 0.4)))
            ])
          )
        }
      ];

      const response: CropComparisonResponse = {
        crops: selectedCrops,
        comparisonTable,
        radarChartData
      };

      return res.json({
        success: true,
        ...response
      });
    } catch (err) {
      console.error('Error in crop comparison:', err);
      return res.status(500).json({ success: false, error: 'Failed to generate crop comparison.' });
    }
  }
};
