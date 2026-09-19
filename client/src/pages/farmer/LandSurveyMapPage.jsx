// pages/farmer/LandSurveyMapPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import LeafletMap from '../../components/LeafletMap';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowLeft,
  FileQuestion,
  RotateCcw,
  Volume2,
  Info
} from 'lucide-react';
export default function LandSurveyMapPage({ setActiveTab }) {
  const { activeLandId } = useAuth();
  const { t, lang } = useLanguage();
  const { speak } = useVoice();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchLand();
  }, [activeLandId]);
  const fetchLand = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/lands/${activeLandId || 'LAND-TG-501'}`);
      const data = await res.json();
      if (data.success) {
        setLand(data.land);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const handleSpeak = () => {
    if (!land) return;
    const speech = lang === 'te'
      ? `భూమి సర్వే మ్యాప్. సర్వే నంబర్ ${land.survey_number}. అధికారిక హద్దు ఆకుపచ్చ రంగులో చూపబడింది. వివాదాస్పద ప్రాంతం ఎరుపు రంగులో ఉంది. అధికారిక హద్దులను కేవలం ప్రభుత్వ సర్వేయర్ మాత్రమే మార్చగలరు.`
      : `Land Survey Map. Survey number ${land.survey_number}. Official boundary is shown in green. Disputed area is in red. Official boundary data is protected and can only be altered by an authorized surveyor.`;
    speak(speech);
  };
  if (loading) {
    return <div className="max-w-6xl mx-auto py-12 text-center text-slate-500">Loading Cadastral Map...</div>;
  }
  if (!land) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center text-slate-500">
        <h2 className="text-xl font-bold mb-2">Sample Land Record</h2>
        <p>Survey #142/2A • Kondapur North Agricultural Sector (4.75 Acres)</p>
        <p>Status: ✅ VERIFIED SURVEY RECORD</p>
        <p>🔹 This is placeholder data shown when no real record is available.</p>
      </div>
    );
  }
  const isVerified = land.survey_status === 'Verified';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>🗺️</span> {lang === 'te' ? 'అధికారిక భూమి సర్వే మ్యాప్' : 'Official Land Survey Map'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Survey #{land.survey_number} • {land.area_name} ({land.total_area_acres} Acres)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeak}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>{t('listen_audio')}</span>
          </button>
          <DataProvenanceBadge type="official" />
        </div>
      </div>
      {/* Official Status & Protection Banner */}
      <div className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isVerified
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
          : 'bg-amber-50 border-amber-300 text-amber-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
            isVerified ? 'bg-emerald-600' : 'bg-amber-600'
          }`}>
            {isVerified ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-base font-black tracking-tight">
              {isVerified ? '✅ VERIFIED SURVEY RECORD' : '⏳ SURVEY VERIFICATION PENDING'}
            </div>
            <p className="text-xs opacity-80 font-medium">
              {isVerified
                ? 'Official cadastral polygon certified under Dharani Revenue Cadastral System.'
                : 'Survey revision or sub-division demarcation currently pending field verification.'}
            </p>
          </div>
        </div>
        {/* Read-only Security Lock Notice */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200 text-slate-700 text-xs font-bold shrink-0 shadow-2xs">
          <Lock className="w-4 h-4 text-slate-500" />
          <span>{lang === 'te' ? 'అధికారిక హద్దుల రక్షణ (Read-Only)' : 'Official Boundary Protected (Read-Only)'}</span>
        </div>
      </div>
      {/* Main Interactive Leaflet Map */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-md">
        <LeafletMap
          land={land}
          height="520px"
          showNeighbors={true}
          interactiveLegend={true}
        />
      </div>
      {/* Security & Verification Workflow Notice (Section 4 Compliance) */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed space-y-1">
          <p className="font-bold">
            {lang === 'te' ? 'ముఖ్యమైన భద్రతా గమనిక:' : 'Important Boundary Correction Policy:'}
          </p>
          <p>
            {lang === 'te'
              ? 'సాధారణ వినియోగదారులు అధికారిక సర్వే హద్దులను నేరుగా మార్చలేరు. హద్దులలో ఏవైనా తేడాలు లేదా ఆక్రమణలు ఉంటే, క్రింది బటన్ల ద్వారా ఫిర్యాదు లేదా పునఃసర్వే దరఖాస్తు చేయండి. అధీకృత ప్రభుత్వ సర్వేయర్ క్షేత్ర స్థాయి తనిఖీ చేసిన తర్వాత మాత్రమే సరిచేయబడుతుంది.'
              : 'Ordinary users are strictly prohibited from directly altering official boundary data. If you notice an encroachment or displaced boundary stone, please submit a Survey Complaint or Re-Survey Request. Corrections will take effect only after on-site verification by an authorized government surveyor.'}
          </p>
        </div>
      </div>
      {/* Quick Action Footer Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {lang === 'te' ? 'హద్దుల్లో తేడాలు ఉన్నాయా?' : 'Discrepancy in Boundary?'}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('report')}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{lang === 'te' ? 'హద్దు సమస్యను నివేదించండి' : 'Report Incorrect Boundary'}</span>
          </button>
          <button
            onClick={() => setActiveTab('resurvey')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'te' ? 'పునఃసర్వే కోరండి' : 'Request Official Re-Survey'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}