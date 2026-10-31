import React from 'react';
import { CropRecommendationResult } from '@agrosmart/shared';
import { CheckCircle2, AlertTriangle, Droplets, Thermometer, Sparkles, Scale, Info, ArrowUpRight } from 'lucide-react';

interface CropCardProps {
  result: CropRecommendationResult;
  onViewDetails: (result: CropRecommendationResult) => void;
  onCompare?: (cropId: string) => void;
  isComparing?: boolean;
}

export const CropCard: React.FC<CropCardProps> = ({
  result,
  onViewDetails,
  onCompare,
  isComparing = false
}) => {
  const { crop, suitabilityScore, category, rank, explanation, warnings } = result;

  // Badge styling according to suitability category
  const categoryConfig = {
    'Highly Suitable': { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
    'Moderately Suitable': { bg: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500' },
    'Marginally Suitable': { bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
    'Not Recommended': { bg: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500' }
  }[category];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Top Banner with Image & Score Badge */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={crop.imageUrl}
          alt={crop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        
        {/* Rank Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
          <span className="text-agro-primary">#{rank}</span> Rank
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs ${categoryConfig.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${categoryConfig.dot}`} />
            {category}
          </span>
        </div>

        {/* Crop Name & Scientific Name in Image Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <h3 className="text-xl font-bold font-sans tracking-tight text-white drop-shadow-sm">{crop.name}</h3>
            <p className="text-xs text-slate-200 italic drop-shadow-sm">{crop.scientificName}</p>
          </div>
          {/* Circular Score Badge */}
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg text-center border border-white">
            <span className="text-xl font-extrabold text-agro-dark">{suitabilityScore}%</span>
            <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-500 -mt-1">Match</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1 mb-0.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-600" /> Season
            </span>
            <span className="font-semibold text-slate-800">{crop.seasons.join(', ')}</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-500 flex items-center gap-1 mb-0.5">
              <Droplets className="w-3.5 h-3.5 text-blue-600" /> Water Need
            </span>
            <span className="font-semibold text-slate-800">{crop.waterRequirement} ({crop.optimalRainfallMin}-{crop.optimalRainfallMax}mm)</span>
          </div>
        </div>

        {/* Compatibility Breakdown Bars */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-640">
            <span className="font-medium text-slate-600">Soil Compatibility</span>
            <span className="font-semibold text-slate-900">{result.soilCompatibility}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-agro-primary h-full rounded-full transition-all duration-700"
              style={{ width: `${result.soilCompatibility}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-640">
            <span className="font-medium text-slate-600">Climate & Thermal</span>
            <span className="font-semibold text-slate-900">{result.climateCompatibility}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${result.climateCompatibility}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-640">
            <span className="font-medium text-slate-600">Nutrient Harmony</span>
            <span className="font-semibold text-slate-900">{result.nutrientCompatibility}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${result.nutrientCompatibility}%` }}
            />
          </div>
        </div>

        {/* Agronomic Summary Explanation */}
        <div className="bg-agro-light/50 border border-agro-primary/20 rounded-xl p-3 text-xs text-slate-700">
          <p className="font-medium leading-relaxed">
            {explanation.geminiExplanation || explanation.summary}
          </p>

          {/* Highlight top positive factor */}
          {explanation.positiveFactors.length > 0 && (
            <div className="mt-2 flex items-start gap-1.5 text-[11px] text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{explanation.positiveFactors[0]}</span>
            </div>
          )}

          {/* Highlight top warning / limitation if any */}
          {warnings.length > 0 && (
            <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{warnings[0]}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onViewDetails(result)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            View Details
          </button>

          {onCompare && (
            <button
              onClick={() => onCompare(crop.id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isComparing
                  ? 'bg-agro-primary text-white shadow-xs'
                  : 'text-agro-primary bg-agro-light/80 hover:bg-agro-light'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              {isComparing ? 'Selected' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
