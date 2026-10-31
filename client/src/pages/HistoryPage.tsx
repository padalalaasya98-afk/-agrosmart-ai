import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getGuestHistory, deleteGuestRecommendation, GuestHistoryRecord } from '../services/api';
import { exportRecommendationPDF } from '../utils/pdfGenerator';
import {
  History,
  Trash2,
  Download,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
  FlaskConical,
  Scale
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState<GuestHistoryRecord[]>([]);

  useEffect(() => {
    setHistoryList(getGuestHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteGuestRecommendation(id);
    setHistoryList(prev => prev.filter(item => item.id !== id));
  };

  const handleReopen = (record: GuestHistoryRecord) => {
    navigate(`/results?id=${record.id}`, { state: { resultData: record.data } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-agro-light text-agro-dark border border-agro-primary/20">
          <History className="w-3.5 h-3.5 text-agro-primary" />
          {t.history.title}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 tracking-tight">
          Field Assessment Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t.history.subtitle}
        </p>
      </div>

      {/* Guest Storage Transparency Notice */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3 shadow-2xs">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">{t.history.guestNotice}</strong>
          <p className="text-[11px] text-blue-800/90 mt-0.5">
            Evaluations are stored locally on your device for fast offline access. Clearing browser cache will remove these records. In production with PostgreSQL, assessments are permanently archived under your farmer profile.
          </p>
        </div>
      </div>

      {/* History Items List or Empty State */}
      {historyList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Assessment History Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{t.history.empty}</p>
          <div className="pt-2">
            <Link
              to="/recommend"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-agro-primary hover:bg-agro-dark transition-colors"
            >
              Run Soil Assessment
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>{historyList.length} saved assessment records</span>
          </div>

          <div className="space-y-4">
            {historyList.map(record => {
              const topCrop = record.data.recommendations[0];
              const dateStr = new Date(record.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card hover:shadow-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Left: Input Summary */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-slate-500">ID: {record.id.substring(0, 12)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        Soil: {record.input.soilType || 'Unknown'} (pH {record.input.soilPh ?? 'N/A'})
                      </span>
                      <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        Climate: {record.input.temperature ? `${record.input.temperature}°C` : 'N/A'} • {record.input.rainfall ? `${record.input.rainfall}mm` : 'N/A'}
                      </span>
                      <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        Season: {record.input.season || 'Unknown'}
                      </span>
                    </div>

                    {/* Top Crop Badge */}
                    {topCrop && (
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="text-slate-500 font-medium">Top Match:</span>
                        <span className="font-bold text-agro-dark">{topCrop.crop.name}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-agro-light text-agro-dark">
                          {topCrop.suitabilityScore}% Suitability
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => handleReopen(record)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-agro-primary text-white hover:bg-agro-dark transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      {t.history.viewResults}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => exportRecommendationPDF(record.data)}
                      title="Export PDF Report"
                      className="p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(record.id)}
                      title={t.history.delete}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
