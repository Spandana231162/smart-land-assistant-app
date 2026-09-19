// pages/farmer/DisputedAreaView.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import LeafletMap from '../../components/LeafletMap';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Volume2,
  ShieldAlert,
  Clock,
  MapPin
} from 'lucide-react';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';

const DISPUTE_STATUSES = [
  { key: "Reported", color: "bg-amber-100 text-amber-800" },
  { key: "Under Review", color: "bg-blue-100 text-blue-800" },
  { key: "Survey Required", color: "bg-purple-100 text-purple-800" },
  { key: "Verified", color: "bg-emerald-100 text-emerald-800" },
  { key: "Resolved", color: "bg-teal-100 text-teal-800" },
  { key: "Rejected", color: "bg-rose-100 text-rose-800" }
];

export default function DisputedAreaView({ setActiveTab }) {
  const { currentUser, activeLandId } = useAuth();
  const { t, lang } = useLanguage();
  const { speak } = useVoice();
  const [land, setLand] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [markingMode, setMarkingMode] = useState(false);
  const [savedDisputeMsg, setSavedDisputeMsg] = useState(null);

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

  const handleMarkDispute = async () => {
    if (!land) return;
    try {
      // Create approximate disputed polygon slightly offset on eastern edge
      const approxDisputePolygon = [
        [17.4518, 78.6868],
        [17.4523, 78.6873],
        [17.4507, 78.6871],
        [17.4504, 78.6866]
      ];

      const res = await fetch(`/api/lands/${land.land_id}/dispute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.user_id || 'FAR-101'
        },
        body: JSON.stringify({
          disputed_polygon: approxDisputePolygon,
          remarks: remarks || "Approximate disputed ridge marked by farmer for surveyor verification."
        })
      });

      const data = await res.json();
      if (data.success) {
        setLand(data.land);
        setSavedDisputeMsg("Disputed area boundary marked and recorded for surveyor inspection.");
        setMarkingMode(false);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to record dispute.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'te' ? 'డ్యాష్‌బోర్డుకు తిరిగి వెళ్ళండి' : 'Back to Dashboard'}</span>
        </button>

        <DataProvenanceBadge type="official" text="Cadastral Dispute Ledger" />
      </div>

      {/* Disputed Area Title Banner */}
      <div className="bg-gradient-to-r from-red-700 to-rose-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-red-950/70 border border-red-400/30 text-xs font-bold text-red-200 uppercase tracking-widest">
              Section 6: Disputed Area Feature
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight flex items-center gap-2.5">
              <span>⚠️</span>
              {lang === 'te' ? 'వివాదాస్పద ప్రాంతం (Disputed Area Marking)' : 'Disputed Area Management'}
            </h1>
            <p className="text-red-100 text-xs sm:text-sm mt-1">
              Survey #{land?.survey_number} • Mark and track disputed boundary parcels awaiting surveyor adjudication.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-red-200 font-bold block">
              Current Status
            </span>
            <span className="text-lg font-black text-white mt-0.5 block">
              {land?.disputed_polygon ? '⚠️ Dispute Active' : '🟢 No Disputes'}
            </span>
          </div>
        </div>
      </div>

      {savedDisputeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{savedDisputeMsg}</span>
        </div>
      )}

      {/* Interactive Map */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Cadastral Map: Red Striped Area = Disputed Parcel
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Approximate Discrepancy: ~0.25 Acres
          </span>
        </div>

        {land && (
          <LeafletMap
            land={land}
            height="440px"
            showNeighbors={true}
          />
        )}
      </div>

      {/* Dispute Details & Surveyor Workflow Status (Section 6) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">
          Disputed Area Registry Record
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase block">Survey Number</span>
            <span className="text-sm font-black text-slate-900 mt-1 block">{land?.survey_number}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase block">Reported Date</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">02-Sep-2026</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase block">Reported By</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">{land?.present_owner}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase block">Disputed Location</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">East boundary adjacent to Survey 142/2B</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase block">Current Lifecycle Status</span>
            <span className="text-sm font-black text-blue-700 mt-1 block">Under Review / Survey Required</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase block">Assigned Cadastral Surveyor</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">Srikanth Rao (Senior Surveyor)</span>
          </div>
        </div>

        {/* Surveyor Remarks Note */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
          <span className="font-bold uppercase tracking-wider block">Official Surveyor Remarks:</span>
          <p className="font-medium leading-relaxed">
            "Initial GIS overlay matches farmer complaint regarding east ridge deviation. Field DGPS re-measurement scheduled for 18-Sep-2026."
          </p>
        </div>

        {/* Action Button to Mark or Update Dispute */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => setMarkingMode(!markingMode)}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{markingMode ? 'Cancel Marking' : 'Mark / Update Disputed Ridge'}</span>
          </button>

          <button
            onClick={() => setActiveTab('resurvey')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
          >
            Request On-Site Surveyor Demarcation
          </button>
        </div>

        {markingMode && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
            <label className="text-xs font-bold text-slate-700 uppercase block">
              Dispute Notes & Specific Ground Description:
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Neighbor built field bund 12 feet into cotton patch; peg disturbed."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
            />
            <button
              onClick={handleMarkDispute}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
            >
              Confirm & Save Disputed Parcel
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
