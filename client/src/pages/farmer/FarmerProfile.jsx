// pages/farmer/FarmerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileSpreadsheet,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';

export default function FarmerProfile({ setActiveTab }) {
  const { currentUser } = useAuth();
  const { t, lang } = useLanguage();
  const [lands, setLands] = useState([]);

  useEffect(() => {
    fetchLands();
  }, [currentUser]);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'te' ? 'డ్యాష్‌బోర్డుకు తిరిగి వెళ్ళండి' : 'Back to Dashboard'}</span>
        </button>

        <DataProvenanceBadge type="official" text="Pattedar ROR Identity" />
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl shadow-md border border-white/20">
            {currentUser?.avatar || '👨‍🌾'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-xs font-bold text-emerald-200 uppercase tracking-widest">
              Verified Farmer Account
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">{currentUser?.name}</h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Farmer ID: <span className="font-mono font-bold text-emerald-300">{currentUser?.user_id}</span>
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase block">Phone Number</span>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                {currentUser?.phone}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase block">Email Address</span>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                {currentUser?.email}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase block">Pattadar Passbook No.</span>
              <p className="text-sm font-bold text-slate-900 font-mono">
                {currentUser?.passbook_number}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase block">Registered Village Location</span>
              <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                {currentUser?.location}
              </p>
            </div>

          </div>

          {/* Registered Land Holdings */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-slate-900">
              Registered Agricultural Land Parcels ({lands.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lands.map((land) => (
                <div
                  key={land.land_id}
                  className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono font-black text-emerald-950 block">
                      Survey #{land.survey_number}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">{land.area_name}</p>
                    <p className="text-[11px] text-slate-500 font-bold">{land.total_area_acres} Acres</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold">
                    {land.survey_status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Authorized Officer */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-blue-900 uppercase block">Assigned Revenue & Survey Authority</span>
              <p className="text-slate-700 mt-0.5">Srikanth Rao, Senior Cadastral Surveyor • Ranga Reddy Sub-Division</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold">
              Circle-IV Office
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
