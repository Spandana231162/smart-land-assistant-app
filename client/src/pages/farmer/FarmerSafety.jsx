// pages/farmer/FarmerSafety.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import {
  ShieldAlert,
  ArrowLeft,
  Volume2,
  CloudRain,
  Sun,
  Zap,
  Wind,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function FarmerSafety({ setActiveTab }) {
  const { t, lang } = useLanguage();
  const { speak } = useVoice();
  const [safetyList, setSafetyList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSafety();
  }, []);

  const fetchSafety = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/safety');
      const data = await res.json();
      if (data.success) {
        setSafetyList(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    const text = lang === 'te'
      ? "రైతు భద్రతా జాగ్రత్తలు. పిడుగులు పడే సమయంలో పొలాల్లో ఎత్తైన చెట్ల కింద ఉండవద్దు. భారీ వర్షంలో మోటారు స్విచ్ బోర్డులను ముట్టుకోవద్దు. తీవ్రమైన ఎండలో మధ్యాహ్నం వేళల్లో తగినంత నీరు త్రాగాలి."
      : "Farmer safety precautions. During thunderstorms, never stand near isolated tall trees. Avoid operating electric pump starter switches in standing water. During extreme heat, drink plenty of water and avoid manual field work in peak afternoon.";
    speak(text);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'te' ? 'డ్యాష్‌బోర్డుకు తిరిగి వెళ్ళండి' : 'Back to Dashboard'}</span>
        </button>

        <button
          onClick={handleSpeak}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-bold hover:bg-red-100 transition shadow-2xs"
        >
          <Volume2 className="w-4 h-4 text-red-600" />
          <span>{t('listen_audio')}</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-800 via-rose-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-400/30 text-xs font-bold text-red-200 uppercase tracking-widest">
          Section 15: Farmer Life & Field Safety
        </span>
        <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight flex items-center gap-2.5">
          <span>🛡️</span>
          {lang === 'te' ? 'రైతు భద్రతా సూచనలు (Farmer Safety)' : 'Farmer Safety Precautions'}
        </h1>
        <p className="text-red-100 text-xs sm:text-sm mt-1">
          Life-saving guidelines based on real-time weather and field terrain conditions.
        </p>
      </div>

      {/* Precautions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {safetyList.map((cat, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <h3 className="text-base font-bold text-slate-900">{cat.category}</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                cat.urgency === 'Critical' ? 'bg-rose-100 text-rose-800' :
                cat.urgency === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {cat.urgency}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              {cat.tips.map((tip, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Emergency Helpline Contacts */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-black text-white flex items-center gap-2">
            <span>🚨</span> Rural Agricultural Emergency Helplines
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Kisan Call Centre Toll Free: 1800-180-1551 • Disaster Management: 1070 • Electricity Emergency: 1912
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-4 py-2 rounded-xl bg-red-600 text-white font-black text-sm">
            Call 108 / 112
          </span>
        </div>
      </div>

    </div>
  );
}
