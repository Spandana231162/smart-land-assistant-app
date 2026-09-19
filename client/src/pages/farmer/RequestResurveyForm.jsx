// pages/farmer/RequestResurveyForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import {
  RotateCcw,
  CheckCircle2,
  Calendar,
  Phone,
  Clock,
  ArrowLeft,
  Upload,
  FileCheck,
  X,
  Compass
} from 'lucide-react';

const RESURVEY_STEPS = [
  "Request Submitted",
  "Assigned to Surveyor",
  "Under Review",
  "Field Survey Scheduled",
  "Survey Completed",
  "Verification Pending",
  "Approved/Rejected",
  "Resolved"
];

export default function RequestResurveyForm({ setActiveTab }) {
  const { currentUser, activeLandId } = useAuth();
  const { t, lang } = useLanguage();
  const { speak } = useVoice();
  const [land, setLand] = useState(null);

  const [formData, setFormData] = useState({
    survey_number: "142/2A",
    reason: "Sub-division verification after partition & replacement of displaced boundary stones",
    problem_type: "Cadastral Boundary Demarcation",
    location: "Kondapur East Agriculture sector",
    contact_phone: currentUser?.phone || "+91 98480 12345",
    preferred_time: "Morning (9:00 AM - 12:00 PM)"
  });

  const [evidenceList, setEvidenceList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  useEffect(() => {
    fetchLand();
  }, [activeLandId]);

  const fetchLand = async () => {
    try {
      const res = await fetch(`/api/lands/${activeLandId || 'LAND-TG-501'}`);
      const data = await res.json();
      if (data.success) {
        setLand(data.land);
        setFormData(prev => ({
          ...prev,
          survey_number: data.land.survey_number
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      setEvidenceList(prev => [
        ...prev,
        {
          id: `ev-${Date.now()}-${Math.random()}`,
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`
        }
      ]);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/resurveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.user_id || 'FAR-101'
        },
        body: JSON.stringify({
          land_id: land?.land_id || activeLandId,
          ...formData,
          evidence_files: evidenceList
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedResult(data.resurvey);
        if (lang === 'te') {
          speak(`పునఃసర్వే దరఖాస్తు విజయవంతంగా నమోదైంది. ఐడీ నంబర్: ${data.resurvey.request_id}.`);
        } else {
          speak(`Re-survey request submitted with ID ${data.resurvey.request_id}. Status: Request Submitted.`);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Failed to submit resurvey request.");
    } finally {
      setIsSubmitting(false);
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

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
          📄 {lang === 'te' ? 'పునఃసర్వే దరఖాస్తు సేవ' : 'Official Re-Survey Service'}
        </span>
      </div>

      {submittedResult ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              {lang === 'te' ? 'పునఃసర్వే దరఖాస్తు సమర్పించబడింది!' : 'Re-Survey Request Submitted!'}
            </h2>
            <p className="text-sm text-slate-500">
              Your request has been routed to the Survey and Land Records Division.
            </p>
          </div>

          {/* Ticket ID display */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto space-y-3 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Re-Survey Request ID</span>
              <span className="text-lg font-black text-violet-700 font-mono">{submittedResult.request_id}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Survey Number</span>
              <span className="text-sm font-bold text-slate-800">{submittedResult.survey_number}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Current Status</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
                1. Request Submitted
              </span>
            </div>
          </div>

          {/* 8-Stage Lifecycle Progress Bar (Section 9) */}
          <div className="bg-slate-50 rounded-2xl p-4 max-w-2xl mx-auto border border-slate-200 text-left">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Re-Survey Lifecycle Stages (8 Steps):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {RESURVEY_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                    idx === 0
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="truncate">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('complaints')}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
            >
              {lang === 'te' ? 'దరఖాస్తు స్థితి ట్రాక్ చేయండి' : 'Track Status in Dashboard'}
            </button>
            <button
              onClick={() => setSubmittedResult(null)}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
            >
              Back to Form
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-violet-700 to-indigo-800 text-white p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <span>📄</span>
              {lang === 'te' ? 'పునఃసర్వే దరఖాస్తు (Request Re-Survey)' : 'Request Re-Survey'}
            </h1>
            <p className="text-violet-100 text-xs sm:text-sm mt-1">
              Apply for on-site DGPS demarcation, replacement of lost boundary stones, or partition measurement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'te' ? 'సర్వే నంబర్' : 'Land Number / Survey Number'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.survey_number}
                  onChange={(e) => setFormData({ ...formData, survey_number: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'te' ? 'పునఃసర్వే సమస్య రకం' : 'Problem Type'} *
                </label>
                <select
                  value={formData.problem_type}
                  onChange={(e) => setFormData({ ...formData, problem_type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-hidden bg-white"
                >
                  <option value="Cadastral Boundary Demarcation">Cadastral Boundary Demarcation</option>
                  <option value="Lost Boundary Stone / Peg Replacement">Lost Boundary Stone / Peg Replacement</option>
                  <option value="Partition Sub-Division Measurement">Partition Sub-Division Measurement</option>
                  <option value="Area Discrepancy Rectification">Area Discrepancy Rectification</option>
                  <option value="Encroachment Demarcation">Encroachment Demarcation</option>
                </select>
              </div>

            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {lang === 'te' ? 'పునఃసర్వే అవసరమైన కారణం' : 'Reason for Re-Survey'} *
              </label>
              <textarea
                required
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain why a re-survey is required..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-medium text-slate-900 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'te' ? 'సంప్రదించవలసిన ఫోన్ నంబర్' : 'Preferred Contact Phone'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'te' ? 'సర్వే సమయ ప్రాధాన్యత' : 'Preferred Field Survey Timing'}
                </label>
                <select
                  value={formData.preferred_time}
                  onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-violet-500 focus:outline-hidden bg-white"
                >
                  <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 4:30 PM)">Afternoon (1:00 PM - 4:30 PM)</option>
                  <option value="Any Weekday Available">Any Weekday Available</option>
                </select>
              </div>

            </div>

            {/* Evidence attachment */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'te' ? 'సహాయక పత్రాలు / పాస్‌బుక్ కాపీ' : 'Attach Supporting Documents / Passbook Copy'}
              </label>
              <label className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600">Select Land Passbook or Site Photographs</span>
                <input type="file" multiple onChange={handleFileUpload} className="hidden" />
              </label>

              {evidenceList.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {evidenceList.map(e => (
                    <span key={e.id} className="text-xs px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
                      📎 {e.name} ({e.size})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 8-Stage Workflow visual banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Standard Government 8-Stage Re-Survey Lifecycle
              </span>
              <p className="text-xs text-slate-600">
                1. Submitted → 2. Assigned → 3. Under Review → 4. Scheduled → 5. Survey Done → 6. Verification → 7. Approved → 8. Resolved
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
              >
                {t('cancel')}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black text-sm shadow-lg shadow-violet-600/20 transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'te' ? 'పునఃసర్వే దరఖాస్తును సమర్పించండి' : 'Submit Re-Survey Application'}</span>
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
