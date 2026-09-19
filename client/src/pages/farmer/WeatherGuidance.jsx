// pages/farmer/WeatherGuidance.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  AlertTriangle,
  Calendar,
  ArrowLeft,
  Volume2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';

export default function WeatherGuidance({ setActiveTab }) {
  const { t, lang } = useLanguage();
  const { speak } = useVoice();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/weather');
      const data = await res.json();
      if (data.success) {
        setWeather(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!weather) return;
    const speech = lang === 'te'
      ? `నేటి వాతావరణ సమాచారం. ఉష్ణోగ్రత ${weather.current.temp_c} డిగ్రీలు. వర్షం అవకాశం ${weather.current.rain_probability_pct} శాతం. గాలి వేగం గంటకు ${weather.current.wind_speed_kmh} కిలోమీటర్లు. నీటిపారుదల సలహా: ${weather.agricultural_guidance.irrigation_suitability}`
      : `Weather and rain guidance. Current temperature ${weather.current.temp_c} Celsius. Rain probability ${weather.current.rain_probability_pct} percent. Wind speed ${weather.current.wind_speed_kmh} kilometers per hour. Irrigation advice: ${weather.agricultural_guidance.irrigation_suitability}`;
    speak(speech);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-slate-500">Loading Weather Data...</div>;
  }

  if (!weather) {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center text-slate-500">
      <h2 className="text-xl font-bold mb-2">Demo Weather Data</h2>
      <p>Location: Kondapur Agricultural Region</p>
      <p>Current: 29°C, Partly Cloudy</p>
      <p>💧 Rain Chance: 35%</p>
      <p>🔹 This is placeholder data used when the API is not reachable.</p>
    </div>
  );
}
  return (
    <div className="max-w-4xl mx-auto py-12 text-center text-slate-500">
      <h2 className="text-xl font-bold mb-2">Weather Data Unavailable</h2>
      <p>Location: Kondapur Agricultural Region</p>
      <p>Current: 29°C, Partly Cloudy</p>
      <p>🔹 Showing default demo data.</p>
    </div>
  );
}



  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Bar */}
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span>{t('listen_audio')}</span>
          </button>
          <DataProvenanceBadge type="weather" text="IMD Agromet Grid" />
        </div>
      </div>

      {/* Main Current Weather Display */}
      <div className="bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-sky-100">
              📍 {weather.location_name}
            </span>
            <div className="flex items-baseline gap-4 mt-2">
              <span className="text-5xl sm:text-7xl font-black tracking-tighter">
                {weather.current.temp_c}°C
              </span>
              <span className="text-4xl sm:text-5xl">{weather.current.icon}</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-sky-100">
              {weather.current.condition}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div className="p-2 text-center">
              <CloudRain className="w-5 h-5 mx-auto text-sky-200 mb-1" />
              <span className="text-[11px] text-sky-200 block">Rain Chance</span>
              <span className="text-base font-black text-white">{weather.current.rain_probability_pct}%</span>
            </div>

            <div className="p-2 text-center">
              <Droplets className="w-5 h-5 mx-auto text-sky-200 mb-1" />
              <span className="text-[11px] text-sky-200 block">Humidity</span>
              <span className="text-base font-black text-white">{weather.current.humidity_pct}%</span>
            </div>

            <div className="p-2 text-center">
              <Wind className="w-5 h-5 mx-auto text-sky-200 mb-1" />
              <span className="text-[11px] text-sky-200 block">Wind Speed</span>
              <span className="text-base font-black text-white">{weather.current.wind_speed_kmh} km/h</span>
            </div>

            <div className="p-2 text-center">
              <CloudSun className="w-5 h-5 mx-auto text-sky-200 mb-1" />
              <span className="text-[11px] text-sky-200 block">24h Rainfall</span>
              <span className="text-base font-black text-white">{weather.current.rainfall_24h_mm} mm</span>
            </div>
          </div>

        </div>
      </div>

      {/* Severe Weather Alert Card (Section 12 requirement) */}
      {weather.severe_weather_alert && (
        <div className="bg-amber-50 rounded-3xl border-2 border-amber-300 p-6 shadow-md space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-950">
                {weather.severe_weather_alert.title}
              </h3>
              <p className="text-xs text-amber-800">
                Official Alert Level: <span className="font-bold">{weather.severe_weather_alert.level}</span>
              </p>
            </div>
          </div>
          
          <p className="text-sm text-amber-900 leading-relaxed font-medium">
            {weather.severe_weather_alert.description}
          </p>

          <div className="pt-2 border-t border-amber-200/80">
            <p className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2">
              {lang === 'te' ? 'తక్షణ సూచనలు (Immediate Precautions):' : 'Immediate Precautions:'}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900 font-medium">
              {weather.severe_weather_alert.precautions.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-amber-200">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Agricultural Recommendations (Section 12 requirement) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>🌱</span>
          {lang === 'te' ? 'రైతులకు వాతావరణ ఆధారిత సలహాలు' : 'Actionable Agricultural Weather Guidance'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Irrigation Suitability */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Droplets className="w-4 h-4" />
              <span>{lang === 'te' ? 'నీటిపారుదల సలహా' : 'Irrigation Advisory'}</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">
              {weather.agricultural_guidance.irrigation_suitability}
            </p>
          </div>

          {/* Spraying Advisory */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <Wind className="w-4 h-4" />
              <span>{lang === 'te' ? 'మందుల పిచికారీ సలహా' : 'Foliar Spraying Advisory'}</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {weather.agricultural_guidance.spraying_advisory}
            </p>
          </div>

          {/* Field Work Suitability */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>{lang === 'te' ? 'పొలం పనుల సమయం' : 'Field Work Suitability'}</span>
            </div>
            <p className="text-xs text-blue-950 leading-relaxed font-medium">
              {weather.agricultural_guidance.field_work_suitability}
            </p>
          </div>

        </div>
      </div>

      {/* 5-Day Weather Forecast */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-600" />
          {lang === 'te' ? '5 రోజుల వాతావరణ సూచన' : '5-Day Weather Forecast'}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {weather.forecast.map((fc, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2 hover:bg-sky-50 transition">
              <span className="text-xs font-bold text-slate-700 block">{fc.day}</span>
              <span className="text-3xl block">{fc.icon}</span>
              <div className="text-sm font-black text-slate-900">
                {fc.temp_max}° / <span className="text-xs text-slate-500 font-medium">{fc.temp_min}°</span>
              </div>
              <p className="text-[11px] text-sky-700 font-bold">
                🌧️ {fc.rain_prob}% rain
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {fc.condition}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
