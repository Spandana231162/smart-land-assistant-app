// pages/farmer/FarmerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import {
  MapPin,
  Compass,
  CloudSun,
  Sprout,
  Droplets,
  AlertTriangle,
  Users,
  FileSpreadsheet,
  UploadCloud,
  FileCheck,
  Bell,
  User,
  ShieldAlert,
  ChevronRight,
  Volume2,
  Sparkles
} from 'lucide-react';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';

export default function FarmerDashboard({ setActiveTab }) {
  const { currentUser, activeLandId, setActiveLandId } = useAuth();
  const { t, lang } = useLanguage();
  const { speak } = useVoice();
  const [lands, setLands] = useState([]);
  const [activeLand, setActiveLand] = useState(null);
  const [weatherSnippet, setWeatherSnippet] = useState(null);

  useEffect(() => {
    fetchLands();
    fetchWeather();
  }, [currentUser]);

  useEffect(() => {
    if (lands.length > 0) {
      const selected = lands.find(l => l.land_id === activeLandId) || lands[0];
      setActiveLand(selected);
    }
  }, [lands, activeLandId]);

  const fetchLands = async () => {
    try {
      const res = await fetch(`/api/lands?user_id=${currentUser?.user_id || 'FAR-101'}`);
      const data = await res.json();
      if (data.success) {
        setLands(data.lands || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWeather = async () => {
    try {
      const res = await fetch('/api/weather');
      const data = await res.json();
      if (data.success) {
        setWeatherSnippet(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCardVoice = (text) => {
    speak(text);
  };

  const dashboardModules = [
    {
      id: 'my_land',
      tab: 'my_land',
      title: t('my_land'),
      subtitle: lang === 'te' ? 'భూమి యాజమాన్యం & విస్తీర్ణం' : 'Ownership & Acreage Record',
      icon: '🏡',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/80',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
      badge: activeLand ? `Survey #${activeLand.survey_number}` : 'Loading...',
      voiceText: lang === 'te' 
        ? `నా భూమి. సర్వే నంబర్ ${activeLand?.survey_number || ''}. విస్తీర్ణం ${activeLand?.total_area_acres || ''} ఎకరాలు.` 
        : `My land details. Survey number ${activeLand?.survey_number}. Area ${activeLand?.total_area_acres} acres.`
    },
    {
      id: 'land_survey',
      tab: 'map',
      title: t('land_survey'),
      subtitle: lang === 'te' ? 'హద్దులు, జీపీఎస్ కొలతలు & మ్యాప్' : 'Verified Cadastral Map & GPS Markers',
      icon: '🗺️',
      bgColor: 'bg-teal-50 hover:bg-teal-100/80',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-600 text-white',
      badge: activeLand?.survey_status === 'Verified' ? '✅ Verified' : '⏳ Pending',
      voiceText: lang === 'te'
        ? 'భూమి సర్వే మ్యాప్. అధికారిక సరిహద్దులు మరియు గుర్తులు చూడండి.'
        : 'Land survey map. View official GPS boundaries and stones.'
    },
    {
      id: 'weather',
      tab: 'weather',
      title: t('weather'),
      subtitle: lang === 'te' ? 'నేటి వర్ష సూచన & నీటిపారుదల సమయం' : 'Rain Forecast & Irrigation Advice',
      icon: '🌦️',
      bgColor: 'bg-sky-50 hover:bg-sky-100/80',
      borderColor: 'border-sky-200',
      iconBg: 'bg-sky-600 text-white',
      badge: weatherSnippet ? `${weatherSnippet.current.temp_c}°C • Rain ${weatherSnippet.current.rain_probability_pct}%` : '29°C',
      voiceText: lang === 'te'
        ? `నేటి ఉష్ణోగ్రత ${weatherSnippet?.current?.temp_c || 29} డిగ్రీలు. వర్షం అవకాశం ${weatherSnippet?.current?.rain_probability_pct || 35} శాతం.`
        : `Current temperature ${weatherSnippet?.current?.temp_c || 29} degrees. Rain probability ${weatherSnippet?.current?.rain_probability_pct || 35} percent.`
    },
    {
      id: 'soil_info',
      tab: 'soil_water',
      title: t('soil_info'),
      subtitle: lang === 'te' ? 'నేల తేమ శాతం (62%), పోషకాలు & ఎరువులు' : 'Soil Moisture % (62%), NPK & pH',
      icon: '🌱',
      bgColor: 'bg-amber-50 hover:bg-amber-100/80',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-600 text-white',
      badge: '🟢 Moisture 62% (Good)',
      voiceText: lang === 'te'
        ? 'నేల సమాచారం. నేల తేమ 62 శాతం ఉంది. పంట పెరుగుదలకు అనుకూలం.'
        : 'Soil information. Moisture is 62 percent, in good healthy range.'
    },
    {
      id: 'water_info',
      tab: 'soil_water',
      title: t('water_info'),
      subtitle: lang === 'te' ? 'భూగర్భ జలాలు (6.8 మీటర్లు) & కాలువ నీరు' : 'Groundwater Level & Canal Schedule',
      icon: '💧',
      bgColor: 'bg-blue-50 hover:bg-blue-100/80',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      badge: 'Safe Zone (6.8m depth)',
      voiceText: lang === 'te'
        ? 'నీటి లభ్యత. భూగర్భ నీరు 6.8 మీటర్ల లోతులో పుష్కలంగా ఉంది.'
        : 'Water information. Groundwater table is safe at 6.8 meters.'
    },
    {
      id: 'report_problem',
      tab: 'report',
      title: t('report_problem'),
      subtitle: lang === 'te' ? 'హద్దు లేదా విస్తీర్ణం సమస్య ఫిర్యాదు చేయండి' : 'Report Boundary Shift or Wrong Area',
      icon: '⚠️',
      bgColor: 'bg-rose-50 hover:bg-rose-100/80',
      borderColor: 'border-rose-200',
      iconBg: 'bg-rose-600 text-white',
      badge: 'Fast Resolution',
      voiceText: lang === 'te'
        ? 'సర్వే సమస్య ఫిర్యాదు. హద్దు లేదా విస్తీర్ణం లోపం ఉంటే ఇక్కడ ఫిర్యాదు చేయండి.'
        : 'Report survey problem. Submit complaints regarding shifted boundaries or wrong measurements.'
    },
    {
      id: 'neighbor_lands',
      tab: 'neighbors',
      title: t('neighbor_lands'),
      subtitle: lang === 'te' ? 'చుట్టుపక్కల సర్వే నంబర్లు & హద్దులు' : 'Surrounding Survey Plots & Legal Boundaries',
      icon: '📍',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100/80',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-600 text-white',
      badge: '4 Neighbor Plots',
      voiceText: lang === 'te'
        ? 'పొరుగు భూములు. మీ చుట్టూ ఉన్న సర్వే నంబర్లు మరియు హద్దులు చూడండి.'
        : 'Neighboring lands. View adjacent survey plots and authorized borders.'
    },
    {
      id: 'request_resurvey',
      tab: 'resurvey',
      title: t('request_resurvey'),
      subtitle: lang === 'te' ? 'కొత్త సర్వే లేదా హద్దు రాళ్ళు నాటడం' : 'Official Re-Demarcation & Peg Replacement',
      icon: '📄',
      bgColor: 'bg-violet-50 hover:bg-violet-100/80',
      borderColor: 'border-violet-200',
      iconBg: 'bg-violet-600 text-white',
      badge: '8-Stage Tracking',
      voiceText: lang === 'te'
        ? 'పునఃసర్వే దరఖాస్తు. ప్రభుత్వ సర్వేయర్ ద్వారా క్షేత్ర స్థాయి కొలతలు కోరండి.'
        : 'Request re-survey. Apply for on-site boundary measurement by official surveyor.'
    },
    {
      id: 'upload_evidence',
      tab: 'report',
      title: t('upload_evidence'),
      subtitle: lang === 'te' ? 'ఫోటోలు, పట్టాదార్ పాస్‌బుక్ కాపీలు' : 'Upload Boundary Photos & Documents',
      icon: '📤',
      bgColor: 'bg-orange-50 hover:bg-orange-100/80',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-600 text-white',
      badge: 'Secure Storage',
      voiceText: lang === 'te'
        ? 'ఆధారాలు అప్‌లోడ్ చేయండి. ఫోటోలు మరియు పత్రాలు జతచేయండి.'
        : 'Upload evidence photos and land records.'
    },
    {
      id: 'my_complaints',
      tab: 'complaints',
      title: t('my_complaints'),
      subtitle: lang === 'te' ? 'ఫిర్యాదుల స్థితి & సర్వేయర్ వివరణ' : 'Live Timeline & Surveyor Remarks',
      icon: '📋',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/80',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-700 text-white',
      badge: '2 Active Cases',
      voiceText: lang === 'te'
        ? 'నా ఫిర్యాదులు మరియు పునఃసర్వే స్థితిని ట్రాక్ చేయండి.'
        : 'Track your complaints and re-survey applications.'
    },
    {
      id: 'farmer_safety',
      tab: 'safety',
      title: t('farmer_safety'),
      subtitle: lang === 'te' ? 'పిడుగులు, భారీ వర్షం & తీవ్ర ఎండ జాగ్రత్తలు' : 'Lightning, Heat, Heavy Rain Precautions',
      icon: '🛡️',
      bgColor: 'bg-red-50 hover:bg-red-100/80',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-600 text-white',
      badge: 'Safety Alert Active',
      voiceText: lang === 'te'
        ? 'రైతు భద్రతా జాగ్రత్తలు. పిడుగులు మరియు ఉరుములతో కూడిన వర్షం నుండి రక్షణ సూచనలు.'
        : 'Farmer safety precautions. Guidance on lightning and heavy rain protection.'
    },
    {
      id: 'my_profile',
      tab: 'profile',
      title: t('my_profile'),
      subtitle: lang === 'te' ? 'రైతు వివరాలు & పట్టాదార్ పాస్‌బుక్' : 'Pattadar Passbook & Contact Info',
      icon: '👤',
      bgColor: 'bg-slate-50 hover:bg-slate-100/80',
      borderColor: 'border-slate-200',
      iconBg: 'bg-slate-700 text-white',
      badge: currentUser?.passbook_number || 'TG-RR-142',
      voiceText: lang === 'te'
        ? `రైతు ప్రొఫైల్. పేరు ${currentUser?.name || ''}.`
        : `Farmer profile. Name ${currentUser?.name}.`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Farmer Welcome & Land Selector Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <span className="text-9xl">🌾</span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/40 text-xs font-bold text-emerald-200 uppercase tracking-wider">
                {lang === 'te' ? 'రైతు డ్యాష్‌బోర్డు' : 'Farmer Dashboard'}
              </span>
              <DataProvenanceBadge type="official" text="Telangana Dharani Linked" className="bg-white/10 text-white border-white/20" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {lang === 'te' ? `నమస్తే, ${currentUser?.name}` : `Welcome, ${currentUser?.name}`}
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl">
              {lang === 'te'
                ? 'మీ భూమి సమాచారం, అధికారిక సర్వే హద్దులు, వాతావరణం మరియు వ్యవసాయ సలహాలు క్రింద చూడండి.'
                : 'Access your verified land records, cadastral boundaries, weather forecasts, and agricultural safety guidance.'}
            </p>
          </div>

          {/* Land Switcher (if multiple lands) */}
          {lands.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 min-w-[280px]">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider block mb-1.5">
                {lang === 'te' ? 'ఎంచుకున్న భూమి (Select Land)' : 'Active Land Record'}
              </label>
              <select
                value={activeLandId}
                onChange={(e) => setActiveLandId(e.target.value)}
                className="w-full bg-emerald-900/80 border border-emerald-400/50 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-white"
              >
                {lands.map((l) => (
                  <option key={l.land_id} value={l.land_id} className="text-slate-900 bg-white">
                    Survey #{l.survey_number} - {l.area_name} ({l.total_area_acres} Acres)
                  </option>
                ))}
              </select>

              {activeLand && (
                <div className="mt-2 text-xs text-emerald-100 flex items-center justify-between font-medium">
                  <span>📍 {activeLand.village}, {activeLand.mandal}</span>
                  <span className="font-bold text-emerald-300">
                    {activeLand.survey_status === 'Verified' ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Severe Weather Alert Ribbon (if active) */}
      {weatherSnippet?.severe_weather_alert && (
        <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 sm:p-5 flex items-start justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">⛈️</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {weatherSnippet.severe_weather_alert.title}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase">
                  IMD Advisory
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                {weatherSnippet.severe_weather_alert.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('safety')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
          >
            {lang === 'te' ? 'జాగ్రత్తలు చూడండి' : 'View Safety Guide'}
          </button>
        </div>
      )}

      {/* Section 2: Large Visual Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>🌾</span> {lang === 'te' ? 'రైతు సేవలు (Farmer Services)' : 'Farmer Core Services'}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {lang === 'te' ? 'పెద్ద బటన్లు • సులభమైన వినియోగం' : 'Large Touch Cards • Simple & Farmer Friendly'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {dashboardModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => setActiveTab(mod.tab)}
              className={`group relative rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${mod.bgColor} ${mod.borderColor}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${mod.iconBg}`}>
                    {mod.icon}
                  </div>
                  
                  {/* Voice Button on Card */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardVoice(mod.voiceText);
                    }}
                    title="వినండి / Listen"
                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-emerald-700 flex items-center justify-center shadow-xs border border-slate-200 transition"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/80 text-slate-700 border border-slate-200/60 mb-1">
                    {mod.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {mod.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-emerald-700">
                <span>{t('view_details')}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
