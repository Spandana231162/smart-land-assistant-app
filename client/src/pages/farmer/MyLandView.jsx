// pages/farmer/MyLandView.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import {
  FileText,
  ShieldCheck,
  Calendar,
  MapPin,
  Maximize2,
  Users,
  Compass,
  ArrowLeft,
  CheckCircle2,
  Volume2,
  AlertCircle
} from 'lucide-react';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';

export default function MyLandView({ setActiveTab }) {
  const { currentUser, activeLandId } = useAuth();
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
      ? `భూమి వివరాలు. ప్రాంతం పేరు: ${land.area_name}. సర్వే నంబర్: ${land.survey_number}. ప్రస్తుత యజమాని: ${land.present_owner}. పూర్వ యజమాని: ${land.previous_owner}. మొత్తం విస్తీర్ణం: ${land.total_area_acres} ఎకరాలు. సర్వే స్థితి: ${land.survey_status}.`
      : `Land Information. Area Name: ${land.area_name}. Survey Number: ${land.survey_number}. Present Owner: ${land.present_owner}. Previous Owner: ${land.previous_owner}. Total Area: ${land.total_area_acres} Acres. Survey Status: ${land.survey_status}.`;
    speak(speech);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-slate-500">Loading Land Record...</div>;
  }

  if (!land) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-slate-500">Land record not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Breadcrumb & Actions */}
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>{t('listen_audio')}</span>
          </button>
          <DataProvenanceBadge type="official" />
        </div>
      </div>

      {/* Main Official Land Certificate Style Card */}
      <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-xl overflow-hidden">
        
        {/* Certificate Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-xs font-bold text-emerald-200 uppercase tracking-widest">
                {lang === 'te' ? 'అధికారిక రెవెన్యూ రికార్డు' : 'Official Revenue Record'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
                {lang === 'te' ? 'భూమి వివరాలు (Land Information)' : 'Land Information'}
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                Pattadar Passbook: <span className="font-mono font-bold text-emerald-200">{land.passbook_number}</span>
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
                {lang === 'te' ? 'సర్వే స్థితి' : 'Survey Status'}
              </span>
              <span className="text-lg font-black text-emerald-300 flex items-center justify-center sm:justify-end gap-1.5 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                {land.survey_status === 'Verified' ? '✅ Verified' : '⏳ Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Formatted Key-Value Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            
            {/* Area Name */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {lang === 'te' ? 'ప్రాంతం పేరు (Area Name)' : 'Area Name'}
              </span>
              <p className="text-lg font-extrabold text-slate-900 mt-1">
                {land.area_name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {land.village} Village, {land.mandal} Mandal, {land.district}
              </p>
            </div>

            {/* Land Number / Survey Number */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                {lang === 'te' ? 'భూమి / సర్వే నంబర్ (Land / Survey Number)' : 'Land Number / Survey Number'}
              </span>
              <p className="text-2xl font-black text-emerald-950 mt-1 font-mono">
                {land.survey_number}
              </p>
              <p className="text-xs text-emerald-700 mt-0.5 font-medium">
                Sub-Division: {land.sub_division} • Revenue Circle: {land.revenue_circle}
              </p>
            </div>

            {/* Present Owner */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {lang === 'te' ? 'ప్రస్తుత భూమి యజమాని (Present Land Owner)' : 'Present Land Owner Name'}
              </span>
              <p className="text-lg font-extrabold text-slate-900 mt-1">
                {land.present_owner}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Title Holder Verified under ROR Act
              </p>
            </div>

            {/* Previous Owner */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {lang === 'te' ? 'పూర్వ భూమి యజమాని (Previous Land Owner)' : 'Previous Land Owner Name'}
              </span>
              <p className="text-base font-bold text-slate-800 mt-1">
                {land.previous_owner}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Historical cadastral succession ledger entry
              </p>
            </div>

            {/* Total Land Area */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {lang === 'te' ? 'మొత్తం భూమి విస్తీర్ణం (Total Land Area)' : 'Total Land Area in Acres'}
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {land.total_area_acres} <span className="text-base font-bold text-slate-600">{t('acres')}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Cultivated: {land.cultivated_area_acres} Acres • Nature: {land.land_nature}
              </p>
            </div>

            {/* Last Survey Date & Verification Status */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {lang === 'te' ? 'చివరి సర్వే తేదీ & ధృవీకరణ' : 'Last Survey & Verification Status'}
              </span>
              <p className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {land.last_survey_date}
              </p>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                ✅ {land.verification_status}
              </p>
            </div>

          </div>

          {/* Cadastral Boundary Points Overview */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              {lang === 'te' ? 'హద్దు రాళ్ళు మరియు జీపీఎస్ గుర్తులు' : 'Cadastral Boundary Stones & GPS Coordinates'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {land.boundary_points?.map((pt) => (
                <div
                  key={pt.id}
                  className={`p-3 rounded-xl border text-xs ${
                    pt.verified ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>Corner {pt.id}</span>
                    <span className={`px-1.5 py-0.5 rounded-sm text-[10px] ${pt.verified ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}`}>
                      {pt.status}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900">{pt.name}</p>
                  <p className="font-mono text-[11px] text-slate-500 mt-1">
                    {pt.lat.toFixed(4)}° N, {pt.lng.toFixed(4)}° E
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('map')}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              {lang === 'te' ? 'మ్యాప్‌లో హద్దులు చూడండి' : 'View on Land Survey Map'}
            </button>

            <button
              onClick={() => setActiveTab('neighbors')}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-slate-600" />
              {lang === 'te' ? 'పొరుగు భూముల వివరాలు' : 'View Neighboring Lands'}
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className="px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-sm transition flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              {lang === 'te' ? 'సర్వే సమస్య ఫిర్యాదు చేయండి' : 'Report Survey Problem'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
