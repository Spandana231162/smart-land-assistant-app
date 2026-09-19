// pages/farmer/ReportProblemForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import LeafletMap from '../../components/LeafletMap';
import {
  AlertTriangle,
  Upload,
  FileCheck,
  CheckCircle2,
  MapPin,
  ArrowLeft,
  X,
  Volume2,
  Image as ImageIcon,
  FileText
} from 'lucide-react';

const PROBLEM_TYPES = [
  "Incorrect Boundary",
  "Incorrect Land Area",
  "Incorrect Land Owner Name",
  "Incorrect Survey Number",
  "Neighboring Land Problem",
  "Disputed Area",
  "Missing Land Information",
  "Other"
];

export default function ReportProblemForm({ setActiveTab }) {
  const { currentUser, activeLandId } = useAuth();
  const { t, lang } = useLanguage();
  const { speak } = useVoice();
  const [land, setLand] = useState(null);

  const [formData, setFormData] = useState({
    survey_number: "142/2A",
    complaint_type: "Incorrect Boundary",
    description: "",
    location: "Eastern boundary along neighbor bund",
    disputed_area_acres: 0.25
  });

  const [selectedPin, setSelectedPin] = useState({ lat: 17.4518, lng: 78.6870 });
  const [evidenceList, setEvidenceList] = useState([
    {
      id: "demo-ev-1",
      name: "boundary_stone_damaged.jpg",
      type: "image/jpeg",
      size: "2.4 MB",
      preview: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
    }
  ]);
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
    if (!files.length) return;

    files.forEach((file) => {
      // Validate file size (< 10MB) and type
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setEvidenceList(prev => [
          ...prev,
          {
            id: `ev-${Date.now()}-${Math.random()}`,
            name: file.name,
            type: file.type,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            preview: file.type.startsWith('image/')
              ? uploadEvent.target.result
              : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEvidence = (id) => {
    setEvidenceList(prev => prev.filter(e => e.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description) {
      alert("Please provide a problem description.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        land_id: land?.land_id || activeLandId,
        survey_number: formData.survey_number,
        complaint_type: formData.complaint_type,
        description: formData.description,
        location: formData.location,
        problem_coords: selectedPin,
        disputed_area_acres: formData.disputed_area_acres,
        evidence_files: evidenceList
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.user_id || 'FAR-101'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedResult(data.complaint);
        if (lang === 'te') {
          speak(`మీ సర్వే ఫిర్యాదు విజయవంతంగా నమోదు చేయబడింది. ఫిర్యాదు నంబర్: ${data.complaint.complaint_id}. స్థితి: సమర్పించబడింది.`);
        } else {
          speak(`Your survey complaint has been submitted successfully with ID ${data.complaint.complaint_id}. Status: Submitted.`);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint.");
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

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
          ⚠️ {lang === 'te' ? 'సర్వే సమస్య నమోదు' : 'Survey Grievance Portal'}
        </span>
      </div>

      {/* Success Modal / Display */}
      {submittedResult ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-10 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              {lang === 'te' ? 'ఫిర్యాదు విజయవంతంగా సమర్పించబడింది!' : 'Survey Complaint Submitted Successfully!'}
            </h2>
            <p className="text-sm text-slate-500">
              Your grievance has been transmitted to the Cadastral Survey Division.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto space-y-3 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Complaint ID</span>
              <span className="text-base font-black text-emerald-700 font-mono">{submittedResult.complaint_id}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ✅ Submitted
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Survey Number</span>
              <span className="text-sm font-bold text-slate-800">{submittedResult.survey_number}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Problem Category</span>
              <span className="text-sm font-bold text-slate-800">{submittedResult.complaint_type}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('complaints')}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
            >
              {lang === 'te' ? 'నా ఫిర్యాదుల స్థితి చూడండి' : 'Track in My Complaints'}
            </button>
            <button
              onClick={() => {
                setSubmittedResult(null);
                setFormData({
                  survey_number: land?.survey_number || "142/2A",
                  complaint_type: "Incorrect Boundary",
                  description: "",
                  location: "Eastern boundary",
                  disputed_area_acres: 0.25
                });
              }}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
            >
              {lang === 'te' ? 'మరో ఫిర్యాదు చేయండి' : 'Submit Another Complaint'}
            </button>
          </div>
        </div>
      ) : (
        /* The Form (Section 5) */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-rose-700 to-rose-900 text-white p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <span>⚠️</span>
              {lang === 'te' ? 'సర్వే సమస్య ఫిర్యాదు (Report Survey Problem)' : 'Report Survey Problem'}
            </h1>
            <p className="text-rose-100 text-xs sm:text-sm mt-1">
              Select problem category, pinpoint the discrepancy on the cadastral map, and attach photographic proof.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Land / Survey Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'te' ? 'సర్వే నంబర్' : 'Land Number / Survey Number'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.survey_number}
                  onChange={(e) => setFormData({ ...formData, survey_number: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Problem Type Dropdown (Section 5 specified options) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'te' ? 'సమస్య రకం' : 'Problem Type'} *
                </label>
                <select
                  value={formData.complaint_type}
                  onChange={(e) => setFormData({ ...formData, complaint_type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-hidden bg-white"
                >
                  {PROBLEM_TYPES.map((pt) => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {lang === 'te' ? 'సమస్య ఉన్న ప్రదేశం / హద్దు భాగం' : 'Location on Land / Boundary Ridge'} *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., East boundary ridge adjoining Survey #142/2B"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            {/* Map-based Pinpoint / Area Selection (Section 5 specified) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  📍 {lang === 'te' ? 'మ్యాప్‌లో సమస్య ప్రాంతాన్ని గుర్తించండి' : 'Select/Mark Problem Area on Map'} *
                </label>
                {selectedPin && (
                  <span className="text-xs font-mono text-emerald-700 font-bold">
                    Lat: {selectedPin.lat}, Lng: {selectedPin.lng}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Click anywhere on the satellite/cadastral map below to place a red pin on the disputed ridge or encroachment point.
              </p>

              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {land && (
                  <LeafletMap
                    land={land}
                    height="320px"
                    allowPinpoint={true}
                    selectedPin={selectedPin}
                    onLocationSelect={(coords) => setSelectedPin(coords)}
                    showNeighbors={true}
                  />
                )}
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {lang === 'te' ? 'సమస్య పూర్తి వివరణ' : 'Problem Description'} *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what occurred, e.g., boundary stone shifted during ditch cleaning, fence pushed 10 feet inward, area mismatch in passbook..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-medium text-slate-900 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            {/* Section 7 Evidence Upload */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                📤 {lang === 'te' ? 'ఆధారాల అప్‌లోడ్ (ఫోటోలు & పత్రాలు)' : 'Upload Photo & Document Evidence'} (Section 7)
              </label>

              {/* Upload Drop Zone */}
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm font-bold text-slate-700">Click to Upload Evidence Photos or Documents</span>
                <span className="text-xs text-slate-400 mt-1">Supports JPG, PNG, PDF (Up to 10MB each)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Evidence Previews */}
              {evidenceList.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {evidenceList.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200"
                    >
                      {ev.type.startsWith('image/') ? (
                        <img src={ev.preview} alt="Evidence" className="w-12 h-12 object-cover rounded-xl shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{ev.name}</p>
                        <p className="text-[11px] text-slate-500">{ev.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvidence(ev.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
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
                className="px-7 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-lg shadow-rose-600/20 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>{lang === 'te' ? 'ఫిర్యాదు సమర్పించండి' : 'Submit Survey Report'}</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
