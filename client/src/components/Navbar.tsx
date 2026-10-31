import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, BarChart3, BookOpen, History, Layers, Info, Sparkles, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t.nav.home, icon: Sprout },
    { to: '/dashboard', label: t.nav.dashboard, icon: BarChart3 },
    { to: '/recommend', label: t.nav.recommend, icon: Sparkles },
    { to: '/compare', label: t.nav.compare, icon: Layers },
    { to: '/library', label: t.nav.library, icon: BookOpen },
    { to: '/history', label: t.nav.history, icon: History },
    { to: '/about', label: t.nav.about, icon: Info }
  ];

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'hi', name: 'हिन्दी' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-agro-border/70 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agro-dark to-agro-primary flex items-center justify-center text-white shadow-md shadow-agro-primary/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold font-sans text-agro-dark tracking-tight">AgroSmart</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-agro-light text-agro-dark border border-agro-primary/20">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-0.5">Decision Support</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-agro-dark bg-agro-light/80 font-semibold shadow-xs'
                      : 'text-slate-640 hover:text-agro-dark hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-agro-primary' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Selector & Try Demo CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <Globe className="w-4 h-4 text-slate-400 ml-1.5 mr-1" />
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
                    language === lang.code
                      ? 'bg-white text-agro-dark shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {/* Try Demo Button */}
            <Link
              to="/recommend?demo=true"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-agro-primary to-emerald-600 hover:from-agro-dark hover:to-agro-primary shadow-sm shadow-agro-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-agro-gold" />
              {t.nav.tryDemo}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/recommend?demo=true"
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-agro-primary"
            >
              Demo
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg mb-3">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-md font-medium text-center ${
                  language === lang.code ? 'bg-white text-agro-dark font-bold shadow-xs' : 'text-slate-600'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-agro-light text-agro-dark font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-agro-primary' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
