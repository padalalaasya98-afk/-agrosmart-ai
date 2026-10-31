import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { RecommendationResponse, CropRecommendationResult, CropProfile } from '@agrosmart/shared';
import { CropCard } from '../components/CropCard';
import { CropDetailModal } from '../components/CropDetailModal';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { exportRecommendationPDF } from '../utils/pdfGenerator';
import { api, getGuestHistory } from '../services/api';
import {
  Sparkles,
  Download,
  Scale,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [resultData, setResultData] = useState<RecommendationResponse | null>(null);
  const [selectedCropModal, setSelectedCropModal] = useState<{ crop: CropProfile; result?: CropRecommendationResult } | null>(null);
  const [selectedCropIdsForCompare, setSelectedCropIdsForCompare] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check if state was passed via navigation
    if (location.state?.resultData) {
      setResultData(location.state.resultData);
      setLoading(false);
      return;
    }

    // 2. Check query param id
    const id = searchParams.get('id');
    if (id) {
      // Check local guest history first for 0ms loading
      const localHistory = getGuestHistory();
      const match = localHistory.find(r => r.id === id);
      if (match) {
        setResultData(match.data);
        setLoading(false);
        return;
      }
    }

    // 3. Fallback: load latest item from guest history if available
    const history = getGuestHistory();
    if (history.length > 0) {
      setResultData(history[0].data);
    }
    setLoading(false);
  }, [location.state, searchParams]);

  const handleToggleCompare = (cropId: string) => {
    setSelectedCropIdsForCompare(prev => {
      if (prev.includes(cropId)) {
        return prev.filter(id => id !== cropId);
      } else {
        if (prev.length >= 4) return prev; // Limit comparison to 4
        return [...prev, cropId];
      }
    });
  };

  const handleExportPDF = () => {
    if (resultData) {
      exportRecommendationPDF(resultData);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-agro-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-640">{t.common.loading}</p>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Assessment Results Found</h2>
        <p className="text-xs text-slate-500">
          Run an analysis on your farm plot or load our demonstration scenario to view crop suitability recommendations.
        </p>
        <div className="pt-2">
          <Link
            to="/recommend"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-agro-primary hover:bg-agro-dark"
          >
            Start Assessment Form
          </Link>
        </div>
      </div>
    );
  }

  const topRecommendations = resultData.recommendations.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-agro-light text-agro-dark border border-agro-primary/20">
              Evaluation #{resultData.requestId.substring(0, 10)}
            </span>
            <span className="text-xs text-slate-400">
              Input Completeness: <strong className="text-slate-700">{resultData.inputCompletenessScore}%</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 tracking-tight">
            {t.results.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.results.subtitle}
          </p>
        </div>

        {/* Global Result Actions: PDF Export & Compare Selected */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-xs transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-agro-primary" />
            {t.results.exportPdfBtn}
          </button>

          {selectedCropIdsForCompare.length >= 2 ? (
            <button
              onClick={() => navigate(`/compare?ids=${selectedCropIdsForCompare.join(',')}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-agro-primary text-white shadow-sm hover:bg-agro-dark transition-all animate-pulse"
            >
              <Scale className="w-4 h-4" />
              Compare ({selectedCropIdsForCompare.length}) Crops &rarr;
            </button>
          ) : (
            <Link
              to={`/compare?ids=${topRecommendations.slice(0, 2).map(r => r.crop.id).join(',')}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-agro-light text-agro-dark hover:bg-agro-light/80 transition-all"
            >
              <Scale className="w-4 h-4 text-agro-primary" />
              Compare Top 2
            </Link>
          )}

          <Link
            to="/recommend"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" /> New Assessment
          </Link>
        </div>
      </div>

      {/* Top Recommendations Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-agro-gold" />
            {t.results.topMatches}
          </h2>
          <span className="text-xs text-slate-400">Ranked by agronomic weighted score</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRecommendations.map(result => (
            <CropCard
              key={result.crop.id}
              result={result}
              onViewDetails={res => setSelectedCropModal({ crop: res.crop, result: res })}
              onCompare={handleToggleCompare}
              isComparing={selectedCropIdsForCompare.includes(result.crop.id)}
            />
          ))}
        </div>
      </section>

      {/* What-If Simulator Section */}
      <section className="pt-4">
        <WhatIfSimulator
          baseInput={resultData.inputSummary}
          initialResults={resultData.recommendations}
        />
      </section>

      {/* Advisory Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>{t.common.disclaimerTitle}:</strong> {resultData.disclaimer}
        </p>
      </div>

      {/* Detail Modal if requested */}
      {selectedCropModal && (
        <CropDetailModal
          crop={selectedCropModal.crop}
          result={selectedCropModal.result}
          onClose={() => setSelectedCropModal(null)}
          onCompare={handleToggleCompare}
        />
      )}
    </div>
  );
};
