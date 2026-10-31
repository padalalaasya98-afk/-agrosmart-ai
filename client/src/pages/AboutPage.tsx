import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Info,
  Cpu,
  BookOpen,
  ShieldAlert,
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const factorWeights = [
    { factor: 'Soil Texture / Order', weight: '20%', rationale: 'Dictates moisture holding capacity, cation exchange, and root growth aeration.' },
    { factor: 'Soil pH (Reaction)', weight: '15%', rationale: 'Controls micronutrient lockup or heavy metal solubility in soil solution.' },
    { factor: 'Ambient Temperature', weight: '15%', rationale: 'Enzymatic growth, anthesis, vegetative development, and heat stress thresholds.' },
    { factor: 'Seasonal Rainfall / Water', weight: '10%', rationale: 'Primary moisture availability, evapotranspiration balance, and waterlogging risks.' },
    { factor: 'Available Nitrogen (N)', weight: '10%', rationale: 'Vegetative biomass, chlorophyll synthesis, and vegetative tillering.' },
    { factor: 'Available Phosphorus (P)', weight: '10%', rationale: 'Root establishment, early tillering, energy transfer (ATP), and flower initiation.' },
    { factor: 'Available Potassium (K)', weight: '10%', rationale: 'Stomatal regulation, disease/drought resistance, and grain starch accumulation.' },
    { factor: 'Relative Humidity', weight: '5%', rationale: 'Canopy transpiration rates and fungal/bacterial foliar disease predisposition.' },
    { factor: 'Cropping Season', weight: '5%', rationale: 'Photoperiod alignment, monsoon calendar, and winter vernalization compatibility.' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-agro-light text-agro-dark border border-agro-primary/20">
          <Info className="w-3.5 h-3.5 text-agro-primary" />
          Technical & Scientific Methodology
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 tracking-tight">
          How AgroSmart AI Works
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          AgroSmart AI addresses agricultural risk by providing a completely transparent, explainable decision-support engine rooted in ICAR and FAO agronomic benchmarks.
        </p>
      </div>

      {/* Problem Statement Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-agro-primary" />
          The Agricultural Problem We Solve
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Smallholder farmers, students, and extension workers frequently make crop selection decisions based on informal community habits rather than empirical soil and climate suitability. Choosing crops unsuited to soil texture, pH, or local precipitation causes severe yield penalties, excessive fertilizer wastage, and unnecessary financial distress.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          AgroSmart AI acts as an advisory pre-sowing validator, synthesizing complex soil test readings and local seasonal weather into actionable, ranked recommendations accompanied by clear risk warnings.
        </p>
      </section>

      {/* Mathematical Scoring Algorithm */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Mathematical Scoring Formula
          </h2>
          <p className="text-xs text-slate-500">
            Our recommendation algorithm employs a normalized multi-criteria weighted scoring framework with continuous penalty functions.
          </p>
        </div>

        {/* Formula Box */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto shadow-inner">
          <p className="text-emerald-400 font-bold mb-1">// Deterministic Weighted Suitability Formula</p>
          <p>Suitability Score = 100 × [ Σ ( weight_i × factor_score_i ) ] / [ Σ ( applicable_weights ) ]</p>
          <p className="text-slate-400 text-xs mt-2">
            Where factor_score_i ∈ [0.0, 1.0] calculated via trapezoidal continuous suitability curves. Missing inputs are gracefully omitted from applicable weights.
          </p>
        </div>

        {/* Weights Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 font-bold text-slate-700">Agronomic Factor</th>
                <th className="py-3 px-4 font-bold text-slate-700">Default Weight</th>
                <th className="py-3 px-4 font-bold text-slate-700">Agronomic Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {factorWeights.map((w, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-800">{w.factor}</td>
                  <td className="py-3 px-4 font-bold text-agro-primary">{w.weight}</td>
                  <td className="py-3 px-4 text-slate-600">{w.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Data Sources & Citations */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          Documented Reference Datasets
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          All 15 crop profiles in our library are grounded in recognized Indian and global agricultural research publications:
        </p>
        <ul className="space-y-2 text-xs text-slate-700 list-disc pl-5">
          <li><strong>ICAR Handbooks of Agriculture:</strong> Indian Council of Agricultural Research, New Delhi (2020-2023 edition).</li>
          <li><strong>FAO EcoCrop Suitability Database:</strong> Food and Agriculture Organization of the United Nations.</li>
          <li><strong>Tamil Nadu Agricultural University (TNAU) Agritech Portal:</strong> Crop Production and Pest Management Guidelines.</li>
          <li><strong>Central Institutes:</strong> ICAR-IIRR (Rice), ICAR-IIWBR (Wheat), ICAR-CICR (Cotton), ICAR-IIMR (Millets).</li>
        </ul>
      </section>

      {/* Assumptions, Limitations, and Future ML Roadmap */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" /> Current Prototype Assumptions
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-5 leading-relaxed">
            <li>Soil chemical properties (pH, NPK) are assumed to represent the root-zone plow layer (0-15 cm).</li>
            <li>Rainfall corresponds to cumulative seasonal precipitation or assured irrigation equivalents.</li>
            <li>Suitability score reflects ecological compatibility, not expected monetary market price.</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" /> Future Improvements Roadmap
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-5 leading-relaxed">
            <li>IoT Soil Sensor integration via MQTT telemetry.</li>
            <li>Hyper-local satellite NDVI vegetation index monitoring.</li>
            <li>Market Mandi real-time wholesale price forecasting (e-NAM integration).</li>
            <li>Multi-spectral camera leaf disease diagnosis.</li>
          </ul>
        </div>
      </section>

      {/* Prominent Advisory Disclaimer */}
      <section className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 text-amber-950 space-y-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
          <h2 className="text-base sm:text-lg font-bold">Official Agricultural Advisory Disclaimer</h2>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90">
          The recommendations generated by AgroSmart AI are advisory decision-support estimates derived from mathematical suitability rules. They do not represent a commercial guarantee of harvest success or yield quantity. Actual farm yields depend on seed variety quality, localized microclimatic anomalies, drainage conditions, pest occurrences, and agronomic management practices. Farmers are strongly encouraged to consult local Krishi Vigyan Kendras (KVK) and certified agricultural officers before undertaking major planting commitments.
        </p>
      </section>
    </div>
  );
};
