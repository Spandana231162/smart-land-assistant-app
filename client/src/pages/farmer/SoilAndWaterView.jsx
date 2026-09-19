// pages/farmer/SoilAndWaterView.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import {
  Sprout,
  Droplets,
  ArrowLeft,
  Volume2,
  Gauge,
  Thermometer,
  ShieldCheck,
  Cpu,
  Waves,
  Calendar,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';

export default function SoilAndWaterView({ setActiveTab }) {
  const { activeLandId } = useAuth();
  const { t, lang } = useLanguage();
  const { speak } = useVoice();
  const [soil, setSoil] = useState(null);
  const [water, setWater] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSoilAndWater();
  }, [activeLandId]);

  const fetchSoilAndWater = async () => {
    try {
      setLoading(true);
      const [soilRes, waterRes] = await Promise.all([
        fetch(`/api/soil/${activeLandId || 'LAND-TG-501'}`),
        fetch(`/api/water/${activeLandId || 'LAND-TG-501'}`)
      ]);
      const soilData = await soilRes.json();
      const waterData = await waterRes.json();
      if (soilData.success) setSoil(soilData.data);
      if (waterData.success) setWater(waterData.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!soil || !water) return;
    const speech = lang === 'te'
      ? `నేల మరియు నీటి సమాచారం. నేల రకం: ${soil.soil_type}. నేల తేమ శాతం: ${soil.soil_moisture_percentage} శాతం, మంచి స్థితిలో ఉంది. భూగర్భ జలాలు: ${water.groundwater_depth_meters} మీటర్ల లోతులో పుష్కలంగా ఉన్నాయి.`
      : `Soil and water status. Soil type: ${soil.soil_type}. Moisture percentage: ${soil.soil_moisture_percentage} percent, in good status. Groundwater depth: ${water.groundwater_depth_meters} meters in safe zone.`;
    speak(speech);
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto py-12 text-center text-slate-500">Loading Soil and Water telemetry...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>{t('listen_audio')}</span>
          </button>
          <DataProvenanceBadge type="sensor" text="IoT Tensiometer Sync" />
        </div>
      </div>

      {/* ================= SECTION 13: SOIL INFORMATION ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        
        {/* Soil Banner */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-950/70 border border-amber-400/30 text-xs font-bold text-amber-200 uppercase tracking-widest">
                {lang === 'te' ? 'నేల ఆరోగ్య కార్డు' : 'Soil Health & Moisture Card'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight flex items-center gap-2">
                <span>🌱</span>
                {lang === 'te' ? 'నేల సమాచారం (Soil Information)' : 'Soil Information & Moisture'}
              </h2>
              <p className="text-amber-100 text-xs sm:text-sm mt-1">
                Land #{soil?.survey_number} • {soil?.soil_type}
              </p>
            </div>

            {/* Moisture Gauge Visual */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-amber-200 font-bold block">
                {lang === 'te' ? 'నేల తేమ శాతం' : 'Soil Moisture'}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-300 mt-0.5">
                {soil?.soil_moisture_percentage}%
              </div>
              <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-white text-xs font-bold">
                <span>🟢 {soil?.moisture_status} Range</span>
              </div>
            </div>
          </div>
        </div>

        {/* Soil Metrics */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Visual Soil Moisture Status Explanation */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Moisture Status Gauge: <span className="text-emerald-700 font-extrabold">🟢 Good (62%)</span>
              </h4>
              <p className="text-xs text-amber-900 mt-1">
                Optimal moisture percentage for vegetative stage. Continuous soil tensiometer readings indicate root-zone hydration is sufficient.
              </p>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-3 shrink-0 text-xs font-bold">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                🟢 Good (60-80%)
              </span>
              <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-1 rounded-lg opacity-50">
                🟡 Moderate (40-60%)
              </span>
              <span className="flex items-center gap-1 text-rose-700 bg-rose-100 px-2 py-1 rounded-lg opacity-50">
                🔴 Low (&lt;40%)
              </span>
            </div>
          </div>

          {/* Key Parameters: pH, N, P, K */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 block uppercase">Soil pH</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{soil?.ph_level}</div>
              <span className="text-xs font-bold text-emerald-600">{soil?.ph_status}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 block uppercase">Nitrogen (N)</span>
              <div className="text-xl font-black text-slate-900 mt-1">{soil?.nitrogen_kg_ha} kg/ha</div>
              <span className="text-xs font-bold text-amber-600">{soil?.nitrogen_status} Level</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 block uppercase">Phosphorus (P)</span>
              <div className="text-xl font-black text-slate-900 mt-1">{soil?.phosphorus_kg_ha} kg/ha</div>
              <span className="text-xs font-bold text-emerald-600">{soil?.phosphorus_status} Level</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 block uppercase">Potassium (K)</span>
              <div className="text-xl font-black text-slate-900 mt-1">{soil?.potassium_kg_ha} kg/ha</div>
              <span className="text-xs font-bold text-emerald-600">{soil?.potassium_status} Level</span>
            </div>

          </div>

          {/* Soil Recommendations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              {lang === 'te' ? 'నేల ఆరోగ్య సిఫార్సులు' : 'Soil Fertility Recommendations'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {soil?.recommendations?.map((rec, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span>Last Tested: {soil?.last_tested}</span>
            <DataProvenanceBadge type="sensor" text="IoT Probe #TEL-771" />
          </div>

        </div>
      </div>

      {/* ================= SECTION 14: WATER STATUS ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        
        {/* Water Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-cyan-800 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-blue-950/70 border border-blue-400/30 text-xs font-bold text-blue-200 uppercase tracking-widest">
                {lang === 'te' ? 'జల వనరుల స్థితి' : 'Hydrological & Groundwater Status'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight flex items-center gap-2">
                <span>💧</span>
                {lang === 'te' ? 'నీటి సమాచారం (Water Status)' : 'Water Availability & Groundwater'}
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                Groundwater Table Depth: <span className="font-bold text-cyan-200">{water?.groundwater_depth_meters} meters</span> ({water?.groundwater_status})
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold block">
                Water Availability
              </span>
              <span className="text-base font-black text-cyan-300 block mt-0.5">
                {water?.water_availability?.split('(')[0]}
              </span>
              <span className="text-xs text-blue-100">Optimal Supply</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Key Hydrological Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
              <span className="text-xs font-bold uppercase text-blue-800">Primary Water Source</span>
              <p className="text-sm font-bold text-slate-900">{water?.primary_source}</p>
              <p className="text-xs text-blue-700 mt-1">Schedule: {water?.canal_schedule}</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
              <span className="text-xs font-bold uppercase text-blue-800">Secondary Source / Borewell</span>
              <p className="text-sm font-bold text-slate-900">{water?.secondary_source}</p>
              <p className="text-xs text-blue-700 mt-1">Discharge Rate: {water?.borewell_discharge_rate}</p>
            </div>

          </div>

          {/* Water Conservation & Irrigation Guidance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>💡</span> Water Conservation Suggestion
              </h4>
              <ul className="text-xs text-emerald-950 space-y-1.5 font-medium">
                {water?.conservation_tips?.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
              <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>📢</span> Water & Canal Release Alerts
              </h4>
              <ul className="text-xs text-sky-950 space-y-1.5 font-medium">
                {water?.water_alerts?.map((alert, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-sky-600 font-bold">•</span>
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span>Water Salinity (EC): {water?.water_quality_ec}</span>
            <DataProvenanceBadge type="official" text="SGWB Hydrological Station" />
          </div>

        </div>

      </div>

    </div>
  );
}
