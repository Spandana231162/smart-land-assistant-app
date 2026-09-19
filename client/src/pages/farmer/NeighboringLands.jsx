// pages/farmer/NeighboringLands.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import LeafletMap from '../../components/LeafletMap';
import {
  Users,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Volume2,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';

export default function NeighboringLands({ setActiveTab }) {
  const { activeLandId } = useAuth();
  const { t, lang } = useLanguage();
  const { speak } = useVoice();
  const [land, setLand] = useState(null);

  useEffect(() => {
    fetchLand();
  }, [activeLandId]);

  const fetchLand = async () => {
    try {
      const res = await fetch(`/api/lands/${activeLandId || 'LAND-TG-501'}`);
      const data = await res.json();
      if (data.success) {
        setLand(data.land);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSpeak = () => {
    if (!land) return;
    const speech = lang === 'te'
      ? `పొరుగు భూముల సమాచారం. మీ సర్వే నంబర్ ${land.survey_number} చుట్టూ 4 సర్వే ప్లాట్లు ఉన్నాయి. ఉత్తరాన సర్వే 142/1, తూర్పున సర్వే 142/2B, దక్షిణాన నీటి కాలువ, పశ్చిమాన సర్వే 141/4 కలవు.`
      : `Neighboring lands. Surrounding your survey number ${land.survey_number}, there are 4 registered parcels. North: Survey 142/1. East: Survey 142/2B. South: Irrigation canal. West: Survey 141/4.`;
    speak(speech);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'te' ? 'డ్యాష్‌బోర్డుకు తిరిగి వెళ్ళండి' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeak}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span>{t('listen_audio')}</span>
          </button>
          <DataProvenanceBadge type="official" text="Public Cadastral Index" />
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-400/30 text-xs font-bold text-indigo-200 uppercase tracking-widest">
              Section 8: Neighbor Identification & Cadastre
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight flex items-center gap-2.5">
              <span>📍</span>
              {lang === 'te' ? 'పొరుగు రైతు భూముల వివరాలు' : 'Neighboring Farmer Land Identification'}
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1">
              Surrounding cadastral plots for Survey #{land?.survey_number}. Authorized public boundary information only.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-indigo-100 font-medium shrink-0">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Privacy Protected by Law</span>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span>Cadastral Context: Blue Polygons = Neighboring Plots</span>
          <span className="text-emerald-700">Green = Your Parcel</span>
        </div>

        {land && (
          <LeafletMap
            land={land}
            height="420px"
            showNeighbors={true}
          />
        )}
      </div>

      {/* Neighboring Land Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <span>Surrounding Parcel Registry</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {land?.neighboring_lands?.map((neighbor, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-extrabold uppercase">
                    Boundary: {neighbor.boundary_direction} Direction
                  </span>
                  <h4 className="text-lg font-black text-slate-900 mt-1">
                    Survey #{neighbor.survey_number}
                  </h4>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {neighbor.status}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Authorized Owner Record:</span>
                  <span className="font-bold text-slate-800">{neighbor.owner_display}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Total Parcel Area:</span>
                  <span className="font-bold text-slate-800">{neighbor.area_acres} Acres</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Access Control Note:</span>
                  <span className="text-[11px] text-slate-500 italic">{neighbor.privacy_note}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveTab('report')}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 transition"
                >
                  Report Boundary Dispute with this plot →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
