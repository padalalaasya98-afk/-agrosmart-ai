import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Sprout,
  Sparkles,
  Layers,
  Sliders,
  ShieldCheck,
  ArrowRight,
  Droplets,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Cpu,
  BarChart,
  HelpCircle,
  Play
} from 'lucide-react';
import { CROPS_DATASET, CropProfile } from '@agrosmart/shared';
import { CropDetailModal } from '../components/CropDetailModal';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState<CropProfile | null>(null);

  // Quick feature crops to showcase
  const previewCrops = CROPS_DATASET.slice(0, 6);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-agro-light/60 via-emerald-100/30 to-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-agro-light border border-agro-primary/20 text-agro-dark text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-agro-gold" />
                <span>{t.hero.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans text-slate-900 tracking-tight leading-[1.12]">
                {t.hero.title}{' '}
                <span className="bg-gradient-to-r from-agro-dark via-agro-primary to-emerald-600 bg-clip-text text-transparent">
                  {t.hero.highlight}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-640 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/recommend"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-agro-dark to-agro-primary hover:from-agro-primary hover:to-emerald-600 shadow-md shadow-agro-primary/25 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Sprout className="w-4 h-4 text-agro-light" />
                  {t.hero.getRecommendation}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/recommend?demo=true"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-agro-dark bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:border-agro-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Play className="w-4 h-4 text-agro-gold fill-agro-gold" />
                  {t.nav.tryDemo}
                </Link>

                <Link
                  to="/library"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-600 hover:text-agro-dark hover:bg-agro-light/40 transition-all"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  {t.hero.exploreCrops}
                </Link>
              </div>

              {/* Trust & Scientific Evidence Strip */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl font-black text-slate-900 font-sans">15+</div>
                  <div className="text-xs text-slate-500 font-medium">{t.hero.quickStats.crops}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-agro-primary font-sans">100%</div>
                  <div className="text-xs text-slate-500 font-medium">{t.hero.quickStats.accuracy}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 font-sans">9 Factors</div>
                  <div className="text-xs text-slate-500 font-medium">{t.hero.quickStats.factors}</div>
                </div>
              </div>
            </div>

            {/* Right Visual: Interactive Agriculture Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Card Stack */}
                <div className="bg-white rounded-3xl p-6 shadow-hover border border-slate-200/80 space-y-5 relative z-10">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-agro-light flex items-center justify-center text-agro-dark">
                        <Cpu className="w-5 h-5 text-agro-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Decision Support Engine</h3>
                        <p className="text-[11px] text-slate-500">Live Soil-to-Crop Inference</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Deterministic
                    </span>
                  </div>

                  {/* Sample Live Output Preview */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80"
                          alt="Rice"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Rice (Paddy)</h4>
                          <p className="text-[11px] text-slate-500">Clayey Alluvial • Kharif</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-agro-primary">87%</span>
                        <span className="block text-[9px] uppercase font-bold text-slate-400">Match</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=200&q=80"
                          alt="Maize"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Maize (Corn)</h4>
                          <p className="text-[11px] text-slate-500">Loamy • Kharif/Rabi</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-blue-600">79%</span>
                        <span className="block text-[9px] uppercase font-bold text-slate-400">Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Micro-Features Floating Pills */}
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Transparent Math
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-medium border border-blue-200">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" /> What-If Simulator
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-medium border border-amber-200">
                      <Droplets className="w-3.5 h-3.5 text-amber-600" /> Water Risk Guard
                    </span>
                  </div>
                </div>

                {/* Background Shadow Card Accent */}
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-tr from-agro-dark to-agro-primary rounded-3xl -z-10 opacity-20 transform rotate-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900">
            Engineered for Precision & Transparent Advisory
          </h2>
          <p className="text-sm text-slate-600">
            Unlike black-box models, AgroSmart AI reveals exactly why a crop fits your soil, what limitations exist, and how to mitigate risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-agro-light text-agro-dark flex items-center justify-center">
              <Cpu className="w-6 h-6 text-agro-primary" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Multi-Factor Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Weights 9 core variables (Soil texture, pH, NPK, temperature, rainfall, humidity, and season) against published ICAR/FAO agronomic bands.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Explainable AI (XAI)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every score details positive contributing factors, limiting bottlenecks, and uncertainty warnings for unmeasured inputs.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sliders className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">What-If Simulator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Adjust temperature, rainfall, or pH with instant sliders to test crop climate resilience under drought or delayed monsoon conditions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Layers className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Multi-Crop Comparison</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Side-by-side radar charts and structured tables comparing drought resistance, nutrient demand, duration, and market advantages.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-agro-primary">Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900">
              How AgroSmart AI Delivers Advisory Guidance
            </h2>
            <p className="text-sm text-slate-600">
              Four simple, scientific steps from raw soil observation to actionable farm decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-agro-light text-agro-dark font-black text-xl flex items-center justify-center mx-auto shadow-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Input Soil & Climate</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your soil texture, pH, NPK, seasonal rainfall, and local temperature. Missing values are safely supported.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-agro-light text-agro-dark font-black text-xl flex items-center justify-center mx-auto shadow-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Input Quality Check</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The built-in validator flags extreme pH, abnormal rainfall, or nutrient gaps, providing instant corrective hints.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-agro-light text-agro-dark font-black text-xl flex items-center justify-center mx-auto shadow-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Weighted Scoring</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The deterministic engine evaluates each crop against validated growth curves and ranks top suitable matches.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-agro-light text-agro-dark font-black text-xl flex items-center justify-center mx-auto shadow-sm">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">Compare & Export PDF</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compare crops side-by-side, test What-If scenarios, and download a comprehensive PDF report for offline field use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Crops Preview Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-agro-primary">Crop Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900">
              Supported Agricultural Crops
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Documented with authentic agronomic benchmarks from ICAR and FAO EcoCrop.
            </p>
          </div>
          <Link
            to="/library"
            className="text-xs sm:text-sm font-bold text-agro-primary hover:text-agro-dark hover:underline flex items-center gap-1"
          >
            Explore all 15 crops &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewCrops.map(crop => (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all overflow-hidden cursor-pointer group"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={crop.imageUrl}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 text-slate-800 shadow-sm">
                  {crop.category}
                </span>
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="text-lg font-bold drop-shadow-sm">{crop.name}</h4>
                  <p className="text-xs text-slate-200 italic drop-shadow-sm">{crop.scientificName}</p>
                </div>
              </div>
              <div className="p-4 space-y-2 text-xs">
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{crop.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Season: {crop.seasons.join(', ')}</span>
                  <span className="font-semibold text-agro-primary">View Specs &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Mode Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-agro-dark via-agro-primary to-emerald-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-agro-light backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-agro-gold" /> Quick Evaluation Mode
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-sans">
              Test AgroSmart AI with 1-Click Synthetic Demo
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Explore preloaded field scenarios (Warm & Humid, Cool Rabi, Low Rainfall Arid, Acidic Soil, Incomplete NPK) without entering data manually.
            </p>
          </div>
          <Link
            to="/recommend?demo=true"
            className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white text-agro-dark hover:bg-slate-100 shadow-md transition-all hover:scale-105 shrink-0 flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-agro-gold fill-agro-gold" />
            Launch Instant Demo
          </Link>
        </div>
      </section>

      {/* Crop Detail Modal if clicked */}
      {selectedCrop && (
        <CropDetailModal
          crop={selectedCrop}
          onClose={() => setSelectedCrop(null)}
          onCompare={id => navigate(`/compare?add=${id}`)}
        />
      )}
    </div>
  );
};
