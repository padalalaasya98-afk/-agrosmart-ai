import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { CropProfile, CropComparisonResponse, CROPS_DATASET } from '@agrosmart/shared';
import { CropRadarChart } from '../components/CropRadarChart';
import {
  Scale,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Thermometer,
  ShieldAlert,
  Plus,
  X
} from 'lucide-react';

export const ComparisonPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allCrops, setAllCrops] = useState<CropProfile[]>(CROPS_DATASET);
  const [selectedCropIds, setSelectedCropIds] = useState<string[]>(['crop-rice', 'crop-wheat']);
  const [comparisonData, setComparisonData] = useState<CropComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Parse query params (e.g. ?ids=crop-rice,crop-wheat or ?add=crop-maize)
  useEffect(() => {
    const idsParam = searchParams.get('ids');
    const addParam = searchParams.get('add');

    let initialIds = ['crop-rice', 'crop-wheat'];
    if (idsParam) {
      initialIds = idsParam.split(',').filter(Boolean);
    }
    if (addParam && !initialIds.includes(addParam)) {
      initialIds.push(addParam);
    }

    if (initialIds.length >= 2) {
      setSelectedCropIds(initialIds);
    }
  }, [searchParams]);

  // Load comparison whenever selectedCropIds changes
  useEffect(() => {
    if (selectedCropIds.length < 2) return;
    setLoading(true);

    api.compareCrops(selectedCropIds)
      .then(res => {
        setComparisonData(res);
      })
      .catch(err => {
        console.warn('Comparison API failed, fallback to client comparison:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCropIds]);

  const handleToggleCrop = (cropId: string) => {
    if (selectedCropIds.includes(cropId)) {
      if (selectedCropIds.length <= 2) return; // Must keep at least 2
      setSelectedCropIds(selectedCropIds.filter(id => id !== cropId));
    } else {
      if (selectedCropIds.length >= 4) return; // Cap at 4 for layout readability
      setSelectedCropIds([...selectedCropIds, cropId]);
    }
  };

  const selectedCrops = comparisonData?.crops || allCrops.filter(c => selectedCropIds.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-agro-light text-agro-dark border border-agro-primary/20">
          <Scale className="w-3.5 h-3.5 text-agro-primary" />
          {t.comparison.title}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 tracking-tight">
          Agronomic Side-by-Side Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t.comparison.subtitle} Select up to 4 crops to evaluate tradeoffs.
        </p>
      </div>

      {/* Crop Selector Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-soft space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">{t.comparison.selectCrops}</span>
          <span className="text-slate-400">({selectedCropIds.length}/4 selected)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allCrops.map(crop => {
            const isSelected = selectedCropIds.includes(crop.id);
            return (
              <button
                key={crop.id}
                onClick={() => handleToggleCrop(crop.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-agro-primary text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isSelected ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {crop.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Resilience Radar Chart Section */}
      {comparisonData && comparisonData.radarChartData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-agro-primary" />
                {t.comparison.radarTitle}
              </h2>
              <p className="text-[11px] text-slate-500">
                Comparative resilience metrics: Drought Hardiness, Thermal Tolerance, Soil Versatility, Nutrient Efficiency, and Growing Duration.
              </p>
            </div>
          </div>

          <CropRadarChart
            data={comparisonData.radarChartData}
            cropNames={selectedCrops.map(c => c.name)}
          />
        </div>
      )}

      {/* Side-by-Side Comparison Table Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            {t.comparison.tableTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized agronomic thresholds compiled from ICAR and FAO technical documentation.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80">
                <th className="py-4 px-5 font-bold uppercase tracking-wider text-slate-500 w-1/4">
                  {t.comparison.metric}
                </th>
                {selectedCrops.map(crop => (
                  <th key={crop.id} className="py-4 px-5 font-bold text-slate-900 w-auto">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={crop.imageUrl}
                        alt={crop.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <span className="text-sm font-bold block">{crop.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal italic">{crop.scientificName}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonData?.comparisonTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-700 bg-slate-50/30">
                    <div>{row.metric}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{row.description}</div>
                  </td>
                  {selectedCrops.map(crop => (
                    <td key={crop.id} className="py-3.5 px-5 text-slate-800 font-medium">
                      {row.values[crop.id] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
