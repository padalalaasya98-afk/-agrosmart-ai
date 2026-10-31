import { PrismaClient } from '@prisma/client';
import { CROPS_DATASET } from '../src/data/cropDataset.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AgroSmart AI crop catalog into PostgreSQL database...');

  for (const crop of CROPS_DATASET) {
    await prisma.cropProfile.upsert({
      where: { name: crop.name },
      update: {
        scientificName: crop.scientificName,
        category: crop.category,
        description: crop.description,
        imageUrl: crop.imageUrl,
        soilTypes: crop.suitableSoilTypes,
        minPh: crop.minPh,
        maxPh: crop.maxPh,
        optimalPhMin: crop.optimalPhMin,
        optimalPhMax: crop.optimalPhMax,
        minTemperature: crop.minTemperature,
        maxTemperature: crop.maxTemperature,
        optimalTempMin: crop.optimalTempMin,
        optimalTempMax: crop.optimalTempMax,
        minRainfall: crop.minRainfall,
        maxRainfall: crop.maxRainfall,
        optimalRainfallMin: crop.optimalRainfallMin,
        optimalRainfallMax: crop.optimalRainfallMax,
        minHumidity: crop.minHumidity,
        maxHumidity: crop.maxHumidity,
        optimalHumidityMin: crop.optimalHumidityMin,
        optimalHumidityMax: crop.optimalHumidityMax,
        seasons: crop.seasons,
        waterRequirement: crop.waterRequirement,
        npkRequirementJson: JSON.stringify(crop.npkRequirement),
        growingDurationDays: `${crop.growingDurationDays.min}-${crop.growingDurationDays.max}`,
        majorAdvantages: crop.majorAdvantages,
        commonChallenges: crop.commonChallenges,
        sourceReferences: crop.sourceReferences
      },
      create: {
        id: crop.id,
        name: crop.name,
        scientificName: crop.scientificName,
        category: crop.category,
        description: crop.description,
        imageUrl: crop.imageUrl,
        soilTypes: crop.suitableSoilTypes,
        minPh: crop.minPh,
        maxPh: crop.maxPh,
        optimalPhMin: crop.optimalPhMin,
        optimalPhMax: crop.optimalPhMax,
        minTemperature: crop.minTemperature,
        maxTemperature: crop.maxTemperature,
        optimalTempMin: crop.optimalTempMin,
        optimalTempMax: crop.optimalTempMax,
        minRainfall: crop.minRainfall,
        maxRainfall: crop.maxRainfall,
        optimalRainfallMin: crop.optimalRainfallMin,
        optimalRainfallMax: crop.optimalRainfallMax,
        minHumidity: crop.minHumidity,
        maxHumidity: crop.maxHumidity,
        optimalHumidityMin: crop.optimalHumidityMin,
        optimalHumidityMax: crop.optimalHumidityMax,
        seasons: crop.seasons,
        waterRequirement: crop.waterRequirement,
        npkRequirementJson: JSON.stringify(crop.npkRequirement),
        growingDurationDays: `${crop.growingDurationDays.min}-${crop.growingDurationDays.max}`,
        majorAdvantages: crop.majorAdvantages,
        commonChallenges: crop.commonChallenges,
        sourceReferences: crop.sourceReferences
      }
    });
  }

  console.log(`✅ Successfully seeded ${CROPS_DATASET.length} crop profiles!`);
}

main()
  .catch(e => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
