import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldAlert, BookOpen, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* Advisory Warning Banner */}
      <div className="bg-amber-950/40 border-b border-amber-800/40 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-agro-gold shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="font-semibold text-agro-gold">{t.common.disclaimerTitle}:</strong> {t.common.disclaimerText}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-agro-primary flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">AgroSmart AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent Crop Recommendation & Agricultural Decision Support System. Developed for Student Hackathon HACK-P302.
            </p>
            <div className="inline-block px-2.5 py-1 rounded bg-slate-800 text-[11px] font-mono text-agro-gold border border-slate-700">
              Problem ID: HACK-P302
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/recommend" className="hover:text-agro-light transition-colors">Crop Assessment Form</Link></li>
              <li><Link to="/recommend?demo=true" className="hover:text-agro-light transition-colors">Interactive Demo Mode</Link></li>
              <li><Link to="/compare" className="hover:text-agro-light transition-colors">Multi-Crop Comparison</Link></li>
              <li><Link to="/library" className="hover:text-agro-light transition-colors">15+ Crop Knowledge Base</Link></li>
              <li><Link to="/dashboard" className="hover:text-agro-light transition-colors">Farmer Dashboard</Link></li>
            </ul>
          </div>

          {/* Scientific Sources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Agronomic Data Sources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-agro-primary shrink-0" />
                <span>ICAR - Research Institutes Handbooks</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-agro-primary shrink-0" />
                <span>FAO EcoCrop Suitability Database</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-agro-primary shrink-0" />
                <span>TNAU Agritech Portal Standards</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-agro-primary shrink-0" />
                <span>National Food Security Mission (NFSM)</span>
              </li>
            </ul>
          </div>

          {/* Methodology & AI Note */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Transparency & AI Ethics</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              100% deterministic mathematical scoring model. All algorithms evaluate published suitability bands without black-box hallucinations.
            </p>
            <Link to="/about" className="text-xs text-agro-light hover:underline font-medium inline-flex items-center gap-1">
              Read Scientific Methodology &rarr;
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AgroSmart AI. Built for Agricultural Innovation.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for sustainable farming communities.
          </p>
        </div>
      </div>
    </footer>
  );
};
