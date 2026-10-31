import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { RecommendationInput, SoilType, GrowingSeason, WaterAvailability, SampleScenario } from '@agrosmart/shared';
import { SoilQualityChecker } from '../components/SoilQualityChecker';
import {
  Sprout,
  Sparkles,
  FlaskConical,
  CloudSun,
  MapPin,
  HelpCircle,
  Play,
  RotateCcw,
  Search,
  Check,
  AlertTriangle
} from 'lucide-react';

const SOIL_TYPES: SoilType[] = ['Sandy', 'Clay', 'Loamy', 'Silty', 'Black', 'Red', 'Alluvial'];
const SEASONS: GrowingSeason[] = ['Kharif', 'Rabi', 'Zaid'];

export const RecommendationFormPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form State
  const [formData, setFormData] = useState<RecommendationInput>({
    soilType: 'Loamy',
    soilPh: 6.8,
    nitrogen: 110,
    phosphorus: 50,
    potassium: 55,
    temperature: 26.5,
    humidity: 68,
    rainfall: 850,
    season: 'Kharif',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    irrigationAvailable: true,
    waterAvailability: 'Medium',
    inputUnits: {
      npk: 'kg/ha',
      rainfall: 'mm',
      temperature: '°C',
      humidity: '%'
    }
  });

  const [sampleScenarios, setSampleScenarios] = useState<SampleScenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [weatherCityQuery, setWeatherCityQuery] = useState<string>('Guntur');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load Sample Scenarios on mount
  useEffect(() => {
    api.getSampleScenarios()
      .then(res => setSampleScenarios(res))
      .catch(err => console.warn('Could not load sample scenarios from API:', err));

    // If navigated with ?demo=true, auto-load Scenario 1
    if (searchParams.get('demo') === 'true') {
      loadScenarioById('scenario-warm-humid');
    }
  }, [searchParams]);

  const loadScenarioById = (id: string) => {
    const s = sampleScenarios.find(sc => sc.id === id);
    if (s) {
      setFormData(s.input);
      setSelectedScenarioId(id);
      if (s.input.district) setWeatherCityQuery(s.input.district);
    } else {
      // Fallback default demo data
      setFormData({
        soilType: 'Clay',
        soilPh: 6.4,
        nitrogen: 110,
        phosphorus: 48,
        potassium: 55,
        temperature: 28.5,
        humidity: 82,
        rainfall: 1650,
        season: 'Kharif',
        state: 'Andhra Pradesh',
        district: 'East Godavari',
        irrigationAvailable: true,
        waterAvailability: 'High',
        inputUnits: { npk: 'kg/ha', rainfall: 'mm', temperature: '°C', humidity: '%' }
      });
      setSelectedScenarioId('scenario-warm-humid');
      setWeatherCityQuery('East Godavari');
    }
  };

  // Weather lookup handler
  const handleFetchWeather = async () => {
    if (!weatherCityQuery.trim()) return;
    setLoadingWeather(true);
    try {
      const w = await api.getWeather(weatherCityQuery);
      setWeatherData(w);
      // Populate temperature & humidity if user chooses
      setFormData(prev => ({
        ...prev,
        temperature: w.temperature,
        humidity: w.humidity,
        district: weatherCityQuery
      }));
    } catch (e) {
      console.warn('Weather lookup error:', e);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const response = await api.getRecommendations(formData);
      // Navigate to results page with generated record ID
      navigate(`/results?id=${response.recordId}`, { state: { resultData: response.data } });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setFormError(err.message || 'Agronomic evaluation error. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-agro-light text-agro-dark border border-agro-primary/20">
          <Sparkles className="w-3.5 h-3.5 text-agro-gold" />
          Interactive Assessment Form
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 tracking-tight">
          {t.form.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t.form.subtitle}
        </p>
      </div>

      {/* Preset Sample Data Loader Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Play className="w-4 h-4 text-agro-gold fill-agro-gold" />
            Try Pre-Configured Agro-Ecological Test Scenarios:
          </span>
          <span className="text-[11px] font-medium text-slate-500">Synthetic validation benchmarks</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {sampleScenarios.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => loadScenarioById(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedScenarioId === s.id
                  ? 'bg-agro-dark text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {s.title.split(':')[1] || s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Soil Properties */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-agro-primary" />
              {t.form.soilSection}
            </h2>
            <span className="text-xs text-slate-400">Section 1 of 3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Soil Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                {t.form.soilType}
                <span title="Soil texture determines moisture retention, aeration, and root penetration." className="cursor-help text-slate-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </label>
              <select
                value={formData.soilType || 'Unknown'}
                onChange={e => setFormData({ ...formData, soilType: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-agro-primary/20 focus:border-agro-primary"
              >
                <option value="Unknown">-- {t.form.unknown} --</option>
                {SOIL_TYPES.map(soil => (
                  <option key={soil} value={soil}>
                    {soil} Soil
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">e.g. Clay for rice, Black for cotton, Sandy for groundnut</p>
            </div>

            {/* Soil pH */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  {t.form.soilPh}
                  <span title="pH indicates soil acidity or alkalinity. Neutral range is 6.0 to 7.5." className="cursor-help text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </label>
                <span className="text-xs font-mono font-bold text-agro-dark bg-agro-light px-2 py-0.5 rounded">
                  {formData.soilPh != null ? `pH ${formData.soilPh}` : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="3.5"
                  max="10.5"
                  step="0.1"
                  value={formData.soilPh ?? ''}
                  onChange={e => setFormData({ ...formData, soilPh: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="e.g. 6.5"
                  className="w-28 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-agro-primary"
                />
                <input
                  type="range"
                  min="4.0"
                  max="9.0"
                  step="0.1"
                  value={formData.soilPh ?? 6.5}
                  onChange={e => setFormData({ ...formData, soilPh: parseFloat(e.target.value) })}
                  className="flex-1 accent-agro-primary cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Acidic (4.5)</span>
                <span>Neutral (7.0)</span>
                <span>Alkaline (8.5)</span>
              </div>
            </div>
          </div>

          {/* NPK Inputs Grid */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.form.npkTitle}
              </span>
              <span className="text-[11px] text-slate-400 italic">Optional Soil Health Card Values</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Nitrogen */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{t.form.nitrogen}</span>
                  <span className="text-[10px] text-slate-400">kg/ha</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={formData.nitrogen ?? ''}
                  onChange={e => setFormData({ ...formData, nitrogen: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="e.g. 100"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-agro-primary"
                />
                <span className="text-[10px] text-slate-400 block">Normal arable: 80 - 140 kg/ha</span>
              </div>

              {/* Phosphorus */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{t.form.phosphorus}</span>
                  <span className="text-[10px] text-slate-400">kg/ha</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={formData.phosphorus ?? ''}
                  onChange={e => setFormData({ ...formData, phosphorus: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-agro-primary"
                />
                <span className="text-[10px] text-slate-400 block">Normal arable: 30 - 75 kg/ha</span>
              </div>

              {/* Potassium */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{t.form.potassium}</span>
                  <span className="text-[10px] text-slate-400">kg/ha</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="400"
                  value={formData.potassium ?? ''}
                  onChange={e => setFormData({ ...formData, potassium: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-agro-primary"
                />
                <span className="text-[10px] text-slate-400 block">Normal arable: 35 - 80 kg/ha</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Climate & Environmental Parameters */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-amber-500" />
              {t.form.envSection}
            </h2>

            {/* Weather Lookup Assistant */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <input
                type="text"
                value={weatherCityQuery}
                onChange={e => setWeatherCityQuery(e.target.value)}
                placeholder="District or City..."
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-agro-primary w-32 sm:w-40"
              />
              <button
                type="button"
                onClick={handleFetchWeather}
                disabled={loadingWeather}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
              >
                <Search className="w-3 h-3" />
                {loadingWeather ? 'Fetching...' : 'Lookup Climate'}
              </button>
            </div>
          </div>

          {weatherData && (
            <div className="bg-blue-50/70 border border-blue-200/70 p-3 rounded-2xl flex items-center justify-between text-xs text-blue-950">
              <div>
                <span className="font-bold">{weatherData.location}:</span> {weatherData.temperature}°C, {weatherData.humidity}% humidity, {weatherData.weatherCondition}.
                <p className="text-[10px] text-blue-700 mt-0.5">{weatherData.disclaimer}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-blue-800 shrink-0">
                {weatherData.isLive ? 'Live Sensor' : 'Agro-Normal'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Temperature */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                {t.form.temperature}
              </label>
              <input
                type="number"
                min="-5"
                max="52"
                step="0.5"
                value={formData.temperature ?? ''}
                onChange={e => setFormData({ ...formData, temperature: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="e.g. 26.5"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-agro-primary"
                required
              />
              <span className="text-[11px] text-slate-400">Typical seasonal mean</span>
            </div>

            {/* Relative Humidity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                {t.form.humidity}
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.humidity ?? ''}
                onChange={e => setFormData({ ...formData, humidity: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="e.g. 70"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-agro-primary"
              />
              <span className="text-[11px] text-slate-400">Canopy humidity (40-90%)</span>
            </div>

            {/* Rainfall */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                {t.form.rainfall}
              </label>
              <input
                type="number"
                min="50"
                max="4000"
                step="25"
                value={formData.rainfall ?? ''}
                onChange={e => setFormData({ ...formData, rainfall: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="e.g. 850"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-agro-primary"
                required
              />
              <span className="text-[11px] text-slate-400">Seasonal total precipitation</span>
            </div>

            {/* Growing Season */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                {t.form.season}
              </label>
              <select
                value={formData.season || 'Unknown'}
                onChange={e => setFormData({ ...formData, season: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-agro-primary"
                required
              >
                <option value="Unknown">-- {t.form.selectSeason} --</option>
                {SEASONS.map(s => (
                  <option key={s} value={s}>
                    {s} ({s === 'Kharif' ? 'Monsoon' : s === 'Rabi' ? 'Winter' : 'Summer'})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400">Sowing window</span>
            </div>
          </div>
        </div>

        {/* Section 3: Water Availability & Geography (Optional) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              {t.form.optionalSection}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* State */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">{t.form.state}</label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Andhra Pradesh"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-agro-primary"
              />
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">{t.form.district}</label>
              <input
                type="text"
                value={formData.district || ''}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                placeholder="e.g. Guntur"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-agro-primary"
              />
            </div>

            {/* Irrigation Available */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">{t.form.irrigation}</label>
              <select
                value={formData.irrigationAvailable ? 'true' : 'false'}
                onChange={e => setFormData({ ...formData, irrigationAvailable: e.target.value === 'true' })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-agro-primary"
              >
                <option value="true">Yes (Canal / Borewell / Drip)</option>
                <option value="false">No (Purely Rainfed)</option>
              </select>
            </div>

            {/* Water Availability */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">{t.form.waterAvailability}</label>
              <select
                value={formData.waterAvailability || 'Medium'}
                onChange={e => setFormData({ ...formData, waterAvailability: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-agro-primary"
              >
                <option value="High">High (Abundant supply)</option>
                <option value="Medium">Medium (Moderate access)</option>
                <option value="Low">Low (Water-stressed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Input Quality Checker Live Feedback */}
        <SoilQualityChecker input={formData} />

        {/* Error Notification if any */}
        {formError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto min-w-[280px] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-agro-dark to-agro-primary hover:from-agro-primary hover:to-emerald-600 shadow-lg shadow-agro-primary/25 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
          >
            <Sprout className="w-5 h-5 text-agro-gold" />
            {submitting ? t.form.analyzing : t.form.analyzeBtn}
          </button>
        </div>
      </form>
    </div>
  );
};
