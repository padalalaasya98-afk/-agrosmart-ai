import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { CropProfile, CROPS_DATASET } from '@agrosmart/shared';
import { CropDetailModal } from '../components/CropDetailModal';
import {
  BookOpen,
  Search,
  Filter,
  Droplets,
  Thermometer,
  Sparkles,
  Info,
  Scale,
  ArrowRight
} from 'lucide-react';

export const CropLibraryPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [crops, setCrops] = useState<CropProfile[]>(CROPS_DATASET);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<CropProfile | null>(null);

  const categories = ['all', 'Cereal', 'Pulse', 'Oilseed', 'Commercial', 'Vegetable'];
  const seasons = ['all', 'Kharif', 'Rabi', 'Zaid'];

  const filteredCrops = crops.filter(crop => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.suitableSoilTypes.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || crop.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSeason =
      selectedSeason === 'all' ||
      crop.seasons.includes(selectedSeason as any) ||
      crop.seasons.includes('All Season');

    return matchesSearch && matchesCategory && matchesSeason;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-agro-light text-agro-dark border border-agro-primary/20">
          <BookOpen className="w-3.5 h-3.5 text-agro-primary" />
          {t.library.title}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 tracking-tight">
          Agronomic Knowledge Encyclopedia
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t.library.subtitle} Documented from ICAR, FAO EcoCrop, and TNAU agronomy manuals.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.library.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agro-primary/20 focus:border-agro-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-agro-primary"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? t.library.allCategories : cat}
              </option>
            ))}
          </select>

          {/* Season Filter */}
          <select
            value={selectedSeason}
            onChange={e => setSelectedSeason(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-agro-primary"
          >
            {seasons.map(s => (
              <option key={s} value={s}>
                {s === 'all' ? t.library.allSeasons : `${s} Season`}
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-400 font-medium pl-2">
            {filteredCrops.length} crops found
          </span>
        </div>
      </div>

      {/* Crops Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map(crop => (
          <div
            key={crop.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Image banner */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={crop.imageUrl}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-agro-dark shadow-sm">
                  {crop.category}
                </span>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-xl font-bold font-sans drop-shadow-sm">{crop.name}</h3>
                  <p className="text-xs text-slate-200 italic drop-shadow-sm">{crop.scientificName}</p>
                </div>
              </div>

              {/* Specs & Description */}
              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-600 line-clamp-2 leading-relaxed">
                  {crop.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Optimal Temp</span>
                    <span className="font-bold text-slate-800">{crop.optimalTempMin}°C - {crop.optimalTempMax}°C</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Optimal pH</span>
                    <span className="font-bold text-slate-800">{crop.optimalPhMin} - {crop.optimalPhMax}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Water Requirement</span>
                    <span className="font-bold text-slate-800">{crop.waterRequirement}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Seasons</span>
                    <span className="font-bold text-slate-800">{crop.seasons.join(', ')}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Suitable Soils:</span> {crop.suitableSoilTypes.join(', ')}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedCrop(crop)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                Full Profile
              </button>

              <button
                onClick={() => navigate(`/compare?add=${crop.id}`)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-agro-primary bg-agro-light/80 hover:bg-agro-light transition-colors"
              >
                <Scale className="w-3.5 h-3.5" />
                Compare
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal View */}
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
