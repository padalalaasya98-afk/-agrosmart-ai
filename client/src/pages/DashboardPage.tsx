import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getGuestHistory, GuestHistoryRecord } from '../services/api';
import {
  Sprout,
  BarChart3,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  History,
  Droplets,
  Thermometer,
  Layers,
  FlaskConical,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [history, setHistory] = useState<GuestHistoryRecord[]>([]);

  useEffect(() => {
    setHistory(getGuestHistory());
  }, []);

  const totalAnalyses = history.length;
  const recentRecord = history[0];

  // Prepare chart data for most frequently recommended crops
  const cropCounts: Record<string, { count: number; avgScore: number; totalScore: number }> = {};
  history.forEach(item => {
    item.data.recommendations.slice(0, 3).forEach(r => {
      if (!cropCounts[r.crop.name]) {
        cropCounts[r.crop.name] = { count: 0, avgScore: 0, totalScore: 0 };
      }
      cropCounts[r.crop.name].count += 1;
      cropCounts[r.crop.name].totalScore += r.suitabilityScore;
      cropCounts[r.crop.name].avgScore = Math.round(
        cropCounts[r.crop.name].totalScore / cropCounts[r.crop.name].count
      );
    });
  });

  const chartData = Object.entries(cropCounts)
    .map(([name, val]) => ({
      name,
      occurrences: val.count,
      avgSuitability: val.avgScore
    }))
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-agro-dark to-agro-primary rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-agro-light">
            <Sparkles className="w-3.5 h-3.5 text-agro-gold" /> Farmer Decision Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sans">{t.dashboard.welcome}</h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">{t.dashboard.greeting}</p>
        </div>

        <Link
          to="/recommend"
          className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white text-agro-dark hover:bg-slate-100 shadow-md transition-all hover:scale-105 shrink-0 flex items-center gap-2"
        >
          <Sprout className="w-4 h-4 text-agro-primary" />
          {t.dashboard.newAnalysisBtn}
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Evaluations</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{totalAnalyses}</span>
            <div className="p-2 rounded-xl bg-agro-light text-agro-primary">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Stored in local session memory</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Documented Crops</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-agro-primary">15</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">ICAR & FAO benchmark library</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Recommended</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900 truncate">
              {recentRecord?.data.recommendations[0]?.crop.name || 'None yet'}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            {recentRecord ? `${recentRecord.data.recommendations[0]?.suitabilityScore}% Suitability match` : 'Run an assessment'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Season</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">Kharif / Rabi</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Transition & sowing calendar</p>
        </div>
      </div>

      {/* Main Grid: Soil Summary & Recommendation Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Soil Profile or Empty State */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-agro-primary" />
                {t.dashboard.soilProfileTitle}
              </h2>
              {recentRecord && (
                <span className="text-[11px] text-slate-400">
                  {new Date(recentRecord.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {recentRecord ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-0.5">Soil Texture</span>
                    <span className="font-bold text-slate-900">{recentRecord.input.soilType || 'Unspecified'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-0.5">Soil pH</span>
                    <span className="font-bold text-slate-900">{recentRecord.input.soilPh ?? 'Unspecified'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-0.5">Season</span>
                    <span className="font-bold text-slate-900">{recentRecord.input.season || 'Unspecified'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-0.5">Temperature</span>
                    <span className="font-bold text-slate-900">
                      {recentRecord.input.temperature ? `${recentRecord.input.temperature}°C` : 'N/A'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-0.5">Rainfall</span>
                    <span className="font-bold text-slate-900">
                      {recentRecord.input.rainfall ? `${recentRecord.input.rainfall} mm` : 'N/A'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-0.5">NPK Tested</span>
                    <span className="font-bold text-slate-900">
                      {recentRecord.input.nitrogen != null ? 'Yes' : 'Not tested'}
                    </span>
                  </div>
                </div>

                {/* Top Recommended from this test */}
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Top Recommended Crops From This Profile:
                  </span>
                  <div className="space-y-2">
                    {recentRecord.data.recommendations.slice(0, 3).map(r => (
                      <div
                        key={r.crop.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-agro-light/40 border border-agro-primary/20"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={r.crop.imageUrl}
                            alt={r.crop.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{r.crop.name}</h4>
                            <p className="text-[10px] text-slate-500">{r.category}</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-agro-dark">{r.suitabilityScore}% Match</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Meaningful Empty State */
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FlaskConical className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">No Soil Measurements Saved</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">{t.dashboard.emptyState}</p>
                </div>
                <Link
                  to="/recommend"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-agro-primary hover:bg-agro-dark transition-colors"
                >
                  <Sprout className="w-4 h-4" /> Start First Assessment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Crop Suitability Chart */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Crop Recommendation Frequency & Scores
                </h2>
                <p className="text-[11px] text-slate-500">Based on evaluated scenarios</p>
              </div>
            </div>

            {chartData.length > 0 ? (
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} angle={-25} textAnchor="end" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="avgSuitability" name="Avg Suitability %" fill="#2E7D32" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Trends and suitability graphs will automatically visualize here once you analyze field conditions or launch demo mode!
                </p>
                <Link
                  to="/recommend?demo=true"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-agro-primary hover:underline"
                >
                  Load Demo Data &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
