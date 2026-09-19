// pages/HomeLanding.jsx
import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Compass, CloudSun, FileCheck, ShieldCheck, MapPin, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import DataProvenanceBadge from '../components/DataProvenanceBadge';

export default function HomeLanding({ onSelectFlow }) {
  const { loginAsRole, switchUser } = useAuth();
  const { t, lang } = useLanguage();
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Background decorative blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/50 via-teal-50/30 to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Prototype disclaimer pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-200 text-xs font-semibold mb-6 shadow-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Digital Land Survey & Smart Agriculture Prototype (Telangana Dharani & Bhoomi Pilot)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-tight">
            {t('hero_title')}
          </h1>
          
          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            {t('hero_subtitle')}
          </p>

          {/* Quick Login Action Cards */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            
            {/* Farmer Login Button */}
            <button
              onClick={() => {
                loginAsRole('farmer');
                onSelectFlow('dashboard');
              }}
              className="w-full sm:w-1/2 group relative p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl shadow-emerald-700/20 hover:shadow-emerald-700/30 transition transform hover:-translate-y-0.5 text-left border border-emerald-500"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">👨‍🌾</span>
                <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition" />
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-extrabold">{t('farmer_login')}</h3>
                <p className="text-xs text-emerald-100 mt-0.5">రైతు పోర్టల్ • My Land, Weather, Survey Map</p>
              </div>
            </button>

            {/* Surveyor Login Button */}
            <button
              onClick={() => {
                loginAsRole('surveyor');
                onSelectFlow('surveyor_dashboard');
              }}
              className="w-full sm:w-1/2 group relative p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 transition transform hover:-translate-y-0.5 text-left border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">📐</span>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-extrabold">{t('surveyor_login')}</h3>
                <p className="text-xs text-slate-300 mt-0.5">సర్వేయర్ పోర్టల్ • Verification, Boundary CAD</p>
              </div>
            </button>

          </div>

          {/* Quick Demo Pre-selected Personas */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Quick Demo Accounts:</span>
            {DEMO_USERS.map(u => (
              <button
                key={u.user_id}
                onClick={() => {
                  switchUser(u.user_id);
                  onSelectFlow(u.role === 'surveyor' ? 'surveyor_dashboard' : 'dashboard');
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 font-medium transition shadow-2xs"
              >
                {u.avatar} {u.name.split(' ')[0]} ({u.role})
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3 Main Benefits Cards */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Transforming Agricultural Land Governance
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Empowering farmers with verified cadastral boundaries and intelligent agricultural guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Benefit 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  🗺️ {t('pillar1_title')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('pillar1_desc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <DataProvenanceBadge type="official" text="Verified Dharani Cadastre" />
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <CloudSun className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  🌦️ {t('pillar2_title')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('pillar2_desc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <DataProvenanceBadge type="weather" text="IMD Agromet & IoT Sensor" />
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  📋 {t('pillar3_title')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('pillar3_desc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <DataProvenanceBadge type="surveyor" text="DGPS Cadastral Workflow" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer & Compliance Note */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌾</span>
            <span className="font-bold text-white">BhoomiSeva (భూమిసేవ)</span>
            <span className="text-slate-500">| Smart Land & Farmer Assistance Platform</span>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            <p>Built for Pair Programming Demonstration • Conforming to Section 24 Prototype Compliance</p>
            <p className="text-slate-500 mt-0.5">Sample Land Data • OpenStreetMap + Leaflet • Telangana Survey Standards</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
