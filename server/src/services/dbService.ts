import { PrismaClient } from '@prisma/client';
import {
  CropProfile,
  GrowingSeason,
  RecommendationInput,
  RecommendationResponse,
  SoilType,
  WaterAvailability,
  WaterRequirement
} from '@agrosmart/shared';
import { CROPS_DATASET } from '../data/cropDataset.js';

let prisma: PrismaClient | null = null;
let isPrismaConnected = false;

// Initialize Prisma safely without crashing server if DB is unreachable
export async function initDatabase() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql://')) {
    try {
      prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
      });
      await prisma.$connect();
      isPrismaConnected = true;
      console.log('✅ PostgreSQL database connected via Prisma');
    } catch (err) {
      console.warn('⚠️ PostgreSQL connection failed, switching to high-performance local store fallback:', (err as Error).message);
      isPrismaConnected = false;
      prisma = null;
    }
  } else {
    console.log('ℹ️ Running with embedded high-performance agricultural database (PostgreSQL connection optional)');
  }
}

// In-Memory / File Fallback Store
interface StoredRecord {
  id: string;
  userId?: string | null;
  createdAt: string;
  input: RecommendationInput;
  results: RecommendationResponse | null;
}

const memoryStore: StoredRecord[] = [];
const savedRecords: { id: string; userId?: string | null; recordId: string; createdAt: string }[] = [];

export const dbService = {
  // Get all crops
  async getCrops(): Promise<CropProfile[]> {
    if (isPrismaConnected && prisma) {
      try {
        const dbCrops = await prisma.cropProfile.findMany();
        if (dbCrops.length > 0) {
          return dbCrops.map(c => ({
            id: c.id,
            name: c.name,
            scientificName: c.scientificName || '',
            category: c.category as CropProfile['category'],
            description: c.description,
            imageUrl: c.imageUrl,
            suitableSoilTypes: c.soilTypes as SoilType[],
            minPh: c.minPh,
            maxPh: c.maxPh,
            optimalPhMin: c.optimalPhMin,
            optimalPhMax: c.optimalPhMax,
            minTemperature: c.minTemperature,
            maxTemperature: c.maxTemperature,
            optimalTempMin: c.optimalTempMin,
            optimalTempMax: c.optimalTempMax,
            minRainfall: c.minRainfall,
            maxRainfall: c.maxRainfall,
            optimalRainfallMin: c.optimalRainfallMin,
            optimalRainfallMax: c.optimalRainfallMax,
            minHumidity: c.minHumidity,
            maxHumidity: c.maxHumidity,
            optimalHumidityMin: c.optimalHumidityMin,
            optimalHumidityMax: c.optimalHumidityMax,
            seasons: c.seasons as GrowingSeason[],
            waterRequirement: c.waterRequirement as WaterRequirement,
            npkRequirement: JSON.parse(c.npkRequirementJson || '{}'),
            growingDurationDays: { min: 90, max: 130 },
            majorAdvantages: c.majorAdvantages,
            commonChallenges: c.commonChallenges,
            sourceReferences: c.sourceReferences
          }));
        }
      } catch (err) {
        console.warn('Failed to query crop profiles from DB, using dataset:', err);
      }
    }
    return CROPS_DATASET;
  },

  // Get crop by ID or Name
  async getCropById(idOrSlug: string): Promise<CropProfile | null> {
    const crops = await this.getCrops();
    const query = idOrSlug.toLowerCase().trim();
    return (
      crops.find(c => c.id.toLowerCase() === query || c.name.toLowerCase() === query) || null
    );
  },

  // Save recommendation result
  async saveRecommendationRequest(
    input: RecommendationInput,
    response: RecommendationResponse,
    userId?: string | null
  ): Promise<string> {
    const recordId = response.requestId;
    
    // Always keep in local memory store for instant retrieval
    memoryStore.unshift({
      id: recordId,
      userId: userId || null,
      createdAt: new Date().toISOString(),
      input,
      results: response
    });

    // If PostgreSQL is live, persist to DB as well
    if (isPrismaConnected && prisma) {
      try {
        await prisma.recommendationRequest.create({
          data: {
            id: recordId,
            userId: userId || undefined,
            soilType: input.soilType || undefined,
            soilPh: input.soilPh != null ? Number(input.soilPh) : undefined,
            nitrogen: input.nitrogen != null ? Number(input.nitrogen) : undefined,
            phosphorus: input.phosphorus != null ? Number(input.phosphorus) : undefined,
            potassium: input.potassium != null ? Number(input.potassium) : undefined,
            temperature: input.temperature != null ? Number(input.temperature) : undefined,
            rainfall: input.rainfall != null ? Number(input.rainfall) : undefined,
            humidity: input.humidity != null ? Number(input.humidity) : undefined,
            season: input.season || undefined,
            state: input.state || undefined,
            district: input.district || undefined,
            irrigationAvailable: input.irrigationAvailable ?? undefined,
            waterAvailability: input.waterAvailability || undefined,
            inputUnits: JSON.stringify(input.inputUnits || {})
          }
        });
      } catch (dbErr) {
        console.warn('Failed to save request to PostgreSQL:', dbErr);
      }
    }

    return recordId;
  },

  // Retrieve recommendation by ID
  async getRecommendationById(id: string): Promise<StoredRecord | null> {
    const found = memoryStore.find(r => r.id === id);
    if (found) return found;

    if (isPrismaConnected && prisma) {
      try {
        const req = await prisma.recommendationRequest.findUnique({
          where: { id }
        });
        if (req) {
          // reconstruct stored record
          return {
            id: req.id,
            userId: req.userId,
            createdAt: req.createdAt.toISOString(),
            input: {
              soilType: req.soilType as SoilType,
              soilPh: req.soilPh,
              nitrogen: req.nitrogen,
              phosphorus: req.phosphorus,
              potassium: req.potassium,
              temperature: req.temperature,
              rainfall: req.rainfall,
              humidity: req.humidity,
              season: req.season as GrowingSeason,
              state: req.state,
              district: req.district,
              irrigationAvailable: req.irrigationAvailable,
              waterAvailability: req.waterAvailability as WaterAvailability
            },
            results: null
          };
        }
      } catch (err) {
        console.warn('DB lookup error:', err);
      }
    }

    return null;
  },

  // Get recent recommendations history
  async getHistory(userId?: string | null, limit: number = 20): Promise<StoredRecord[]> {
    if (userId) {
      return memoryStore.filter(r => r.userId === userId).slice(0, limit);
    }
    return memoryStore.slice(0, limit);
  },

  // Delete history item
  async deleteHistory(id: string, userId?: string | null): Promise<boolean> {
    const index = memoryStore.findIndex(r => r.id === id && (!userId || r.userId === userId));
    if (index !== -1) {
      memoryStore.splice(index, 1);
      return true;
    }
    return false;
  },

  // Save / Bookmark recommendation
  async bookmarkRecommendation(recordId: string, userId?: string | null) {
    const bookmarkId = `bm_${Date.now()}`;
    savedRecords.unshift({
      id: bookmarkId,
      userId: userId || null,
      recordId,
      createdAt: new Date().toISOString()
    });
    return bookmarkId;
  },

  // Get bookmarked items
  async getBookmarks(userId?: string | null) {
    const matching = savedRecords.filter(b => (!userId ? true : b.userId === userId));
    return matching.map(b => {
      const rec = memoryStore.find(m => m.id === b.recordId);
      return {
        bookmarkId: b.id,
        createdAt: b.createdAt,
        record: rec
      };
    }).filter(b => b.record != null);
  }
};
