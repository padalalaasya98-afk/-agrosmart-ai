import React, { useState, useEffect } from 'react';
import { RecommendationInput, CropRecommendationResult, AgroSuitabilityEngine, CROPS_DATASET } from '@agrosmart/shared';
import { Sliders, RefreshCw, Thermometer, Droplets, FlaskConical, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WhatIfSimulatorProps {
  baseInput: RecommendationInput;
  initialResults: CropRecommendationResult[];
  onApplySimulation?: (updatedInput: RecommendationInput, updatedResults: CropRecommendationResult[]) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  baseInput,
  initialResults,
  onApplySimulation
}) => {
  const [temp, setTemp] = useState<number>(baseInput.temperature ?? 26);
  const [rainfall, setRainfall] = useState<number>(baseInput.rainfall ?? 800);
  const [ph, setPh] = useState<number>(baseInput.soilPh ?? 6.5);
  const [simulatedResults, setSimulatedResults] = useState<CropRecommendationResult[]>(initialResults);

  // Local client-side instance of AgroSuitabilityEngine for instant 0ms slider responsiveness!
  useEffect(() => {
    const engine = new AgroSuitabilityEngine(CROPS_DATASET);
    const updatedInput: RecommendationInput = {
      ...baseInput,
      temperature: temp,
      rainfall: rainfall,
      soilPh: ph
    };

    const newRes = CROPS_DATASET.map(crop => engine.evaluateSingleCrop(crop, updatedInput));
    newRes.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    newRes.forEach((r, idx) => {
      r.rank = idx + 1;
    });

    setSimulatedResults(newRes);
    if (onApplySimulation) {
      onApplySimulation(updatedInput, newRes);
    }
  }, [temp, rainfall, ph]);

  // Reset to original values
  const handleReset = () => {
    setTemp(baseInput.temperature ?? 26);
    setRainfall(baseInput.rainfall ?? 800);
    setPh(baseInput.soilPh ?? 6.5);
  };

  // Helper to compare ranking with baseline
  const getRankDelta = (cropId: string, currentRank: number) => {
    const baseline = initialResults.find(r => r.crop.id === cropId);
    if (!baseline) return 0;
    return baseline.rank - currentRank; // Positive means rank improved (e.g. from 3 to 1: 3-1 = +2)
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-agro-light text-agro-dark">
              <Sliders className="w-5 h-5 text-agro-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-sans">What-If Climate & Soil Simulator</h3>
              <p className="text-xs text-slate-500">
                Adjust sliders to model drought, unseasonal warming, or soil liming in real time.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Baseline
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Temperature Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-600" /> Temperature
            </span>
            <span className="text-sm font-extrabold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
              {temp}°C
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={45}
            step={0.5}
            value={temp}
            onChange={e => setTemp(parseFloat(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Cool (10°C)</span>
            <span>Moderate (28°C)</span>
            <span>Extreme (45°C)</span>
          </div>
        </div>

        {/* Rainfall Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-600" /> Rainfall
            </span>
            <span className="text-sm font-extrabold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
              {rainfall} mm
            </span>
          </div>
          <input
            type="range"
            min={150}
            max={2500}
            step={25}
            value={rainfall}
            onChange={e => setRainfall(parseInt(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Arid (150mm)</span>
            <span>Balanced (1000mm)</span>
            <span>Heavy (2500mm)</span>
          </div>
        </div>

        {/* Soil pH Slider */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-emerald-600" /> Soil pH
            </span>
            <span className="text-sm font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              pH {ph.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={4.0}
            max={9.0}
            step={0.1}
            value={ph}
            onChange={e => setPh(parseFloat(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Acidic (4.0)</span>
            <span>Neutral (6.8)</span>
            <span>Alkaline (9.0)</span>
          </div>
        </div>
      </div>

      {/* Real-time Re-ranking Preview */}
      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
          Simulated Crop Ranking Dynamics (Top 5)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {simulatedResults.slice(0, 5).map(res => {
            const delta = getRankDelta(res.crop.id, res.rank);
            return (
              <div
                key={res.crop.id}
                className="bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl p-3 border border-slate-200/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-agro-dark">#{res.rank}</span>
                    {delta > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                        <TrendingUp className="w-3 h-3" /> +{delta}
                      </span>
                    ) : delta < 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                        <TrendingDown className="w-3 h-3" /> {delta}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] text-slate-400">
                        <Minus className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-slate-800 text-sm">{res.crop.name}</h5>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200/50">
                  <span className="text-slate-500 text-[11px]">Score</span>
                  <span className="font-extrabold text-agro-primary">{res.suitabilityScore}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
