import React from 'react';
import { CropProfile, CropRecommendationResult } from '@agrosmart/shared';
import { X, CheckCircle, AlertTriangle, BookOpen, Droplets, Thermometer, Sparkles, Sprout, ShieldAlert } from 'lucide-react';

interface CropDetailModalProps {
  crop: CropProfile;
  result?: CropRecommendationResult;
  onClose: () => void;
  onCompare?: (cropId: string) => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({
  crop,
  result,
  onClose,
  onCompare
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-slate-700 hover:bg-white shadow-md transition-transform hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Image */}
        <div className="relative h-56 bg-slate-100 shrink-0">
          <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-agro-primary text-white border border-white/20">
                  {crop.category}
                </span>
                <span className="text-xs text-slate-300">Duration: {crop.growingDurationDays.min}-{crop.growingDurationDays.max} days</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight drop-shadow-sm">{crop.name}</h2>
              <p className="text-xs sm:text-sm text-slate-200 italic">{crop.scientificName}</p>
            </div>

            {result && (
              <div className="text-center bg-white/95 px-3 py-1.5 rounded-2xl shadow-lg border border-white text-slate-900">
                <span className="text-2xl font-black text-agro-dark">{result.suitabilityScore}%</span>
                <span className="block text-[9px] font-bold uppercase text-slate-500">Suitability</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Agronomic Overview</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{crop.description}</p>
          </div>

          {/* If Result is attached: Show Calculated Factor Evaluations */}
          {result && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-agro-primary" /> Evaluation Against Your Field Input
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.values(result.factorScores).map(f => (
                  <div key={f.factor} className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                      <span>{f.factor}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.status === 'optimal' ? 'bg-emerald-100 text-emerald-800' :
                        f.status === 'moderate' ? 'bg-blue-100 text-blue-800' :
                        f.status === 'marginal' ? 'bg-amber-100 text-amber-800' :
                        f.status === 'missing' ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {f.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{f.detail}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Optimal: {f.optimalRange}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documented Reference Ranges Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Documented Reference Standards</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Suitable Soils</span>
                <span className="font-semibold text-slate-800">{crop.suitableSoilTypes.join(', ')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Optimal Soil pH</span>
                <span className="font-semibold text-slate-800">{crop.optimalPhMin} - {crop.optimalPhMax}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Temperature Band</span>
                <span className="font-semibold text-slate-800">{crop.optimalTempMin}°C - {crop.optimalTempMax}°C</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Rainfall Requirement</span>
                <span className="font-semibold text-slate-800">{crop.optimalRainfallMin} - {crop.optimalRainfallMax} mm</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Relative Humidity</span>
                <span className="font-semibold text-slate-800">{crop.optimalHumidityMin}% - {crop.optimalHumidityMax}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Target NPK (kg/ha)</span>
                <span className="font-semibold text-slate-800">
                  {crop.npkRequirement.n.optimalMin}:{crop.npkRequirement.p.optimalMin}:{crop.npkRequirement.k.optimalMin}
                </span>
              </div>
            </div>
          </div>

          {/* Advantages & Challenges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Agronomic Advantages
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {crop.majorAdvantages.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Common Field Challenges
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {crop.commonChallenges.map((ch, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500">•</span>
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sources */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Scientific Reference Citations
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-500">
              {crop.sourceReferences.map((ref, idx) => (
                <li key={idx}>• {ref}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-3xl">
          <p className="text-[11px] text-slate-500 italic">Advisory guidance only.</p>
          <div className="flex items-center gap-2">
            {onCompare && (
              <button
                onClick={() => {
                  onCompare(crop.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-agro-light text-agro-dark hover:bg-agro-light/80 transition-colors"
              >
                Add to Comparison
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
