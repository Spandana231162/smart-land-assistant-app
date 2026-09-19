// pages/farmer/ComplaintsTracker.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import {
  FileText,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Search,
  ExternalLink,
  MessageSquare,
  User,
  Calendar
} from 'lucide-react';

export default function ComplaintsTracker({ setActiveTab }) {
  const { currentUser } = useAuth();
  const { t, lang } = useLanguage();
  const { speak } = useVoice();
  const [complaints, setComplaints] = useState([]);
  const [resurveys, setResurveys] = useState([]);
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'complaints' | 'resurveys'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackerData();
  }, [currentUser]);

  const fetchTrackerData = async () => {
    try {
      setLoading(true);
      const [compRes, resurvRes] = await Promise.all([
        fetch(`/api/complaints?farmer_id=${currentUser?.user_id || 'FAR-101'}`),
        fetch(`/api/resurveys?farmer_id=${currentUser?.user_id || 'FAR-101'}`)
      ]);
      const compData = await compRes.json();
      const resurvData = await resurvRes.json();
      if (compData.success) setComplaints(compData.complaints || []);
      if (resurvData.success) setResurveys(resurvData.resurveys || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
      case 'Request Submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review':
      case 'Assigned to Surveyor':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Field Survey Scheduled':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Verified':
      case 'Approved':
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'te' ? 'డ్యాష్‌బోర్డుకు తిరిగి వెళ్ళండి' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('report')}
            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold hover:bg-rose-100 transition border border-rose-200"
          >
            + New Complaint
          </button>
          <button
            onClick={() => setActiveTab('resurvey')}
            className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-800 text-xs font-bold hover:bg-violet-100 transition border border-violet-200"
          >
            + New Re-Survey
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/30 text-xs font-bold text-emerald-200 uppercase tracking-widest">
          {lang === 'te' ? 'సేవా స్థితి ట్రాకర్' : 'Grievance & Re-Survey Tracking'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight flex items-center gap-2.5">
          <span>📋</span>
          {lang === 'te' ? 'నా ఫిర్యాదులు & పునఃసర్వే స్థితి' : 'My Complaints & Re-Survey Tracker'}
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1">
          Monitor your boundary grievances, official inspection schedules, and surveyor remarks in real-time.
        </p>
      </div>

      {/* Tab Filter buttons */}
      <div className="flex gap-2 p-1.5 bg-slate-200/60 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTabFilter('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTabFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Requests ({complaints.length + resurveys.length})
        </button>
        <button
          onClick={() => setActiveTabFilter('complaints')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTabFilter === 'complaints' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Complaints ({complaints.length})
        </button>
        <button
          onClick={() => setActiveTabFilter('resurveys')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTabFilter === 'resurveys' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Re-Surveys ({resurveys.length})
        </button>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading cases...</div>
        ) : (
          <>
            {/* Show Complaints */}
            {(activeTabFilter === 'all' || activeTabFilter === 'complaints') && complaints.map((cmp) => (
              <div
                key={cmp.complaint_id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                      ⚠️
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">{cmp.complaint_id}</span>
                        <span className="text-xs text-slate-400">• Survey #{cmp.survey_number}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">{cmp.complaint_type}</h4>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(cmp.status)}`}>
                    Status: {cmp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {cmp.description}
                </p>

                {/* Surveyor Remarks Box */}
                {cmp.surveyor_remarks && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900 text-[11px]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Assigned Surveyor Inspection Note:</span>
                    </div>
                    <p className="font-medium leading-relaxed pl-5">
                      "{cmp.surveyor_remarks}"
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1">
                  <span>Filed on: {new Date(cmp.created_date).toLocaleDateString()}</span>
                  <span>Assigned Officer: Srikanth Rao (Cadastral Squad #2)</span>
                </div>
              </div>
            ))}

            {/* Show Re-surveys */}
            {(activeTabFilter === 'all' || activeTabFilter === 'resurveys') && resurveys.map((rsv) => (
              <div
                key={rsv.request_id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
                      📄
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">{rsv.request_id}</span>
                        <span className="text-xs text-slate-400">• Survey #{rsv.survey_number}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">{rsv.problem_type}</h4>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(rsv.status)}`}>
                    Step {rsv.status_step}/8: {rsv.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {rsv.reason}
                </p>

                {/* Scheduled Inspection Banner if scheduled */}
                {rsv.scheduled_date && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-950 font-bold">
                    <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      Field Survey Scheduled: {rsv.scheduled_date} at {rsv.scheduled_time || '10:30 AM'} by Senior Surveyor Srikanth Rao
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1">
                  <span>Requested on: {new Date(rsv.created_date).toLocaleDateString()}</span>
                  <span>Contact: {rsv.contact_phone}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

    </div>
  );
}
