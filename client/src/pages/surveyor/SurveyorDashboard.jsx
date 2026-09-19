// pages/surveyor/SurveyorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Compass,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Search,
  Filter,
  ShieldCheck,
  Eye,
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';
import SurveyorVerificationModal from './SurveyorVerificationModal';

export default function SurveyorDashboard({ setActiveTab }) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [lands, setLands] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [resurveys, setResurveys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Selected for verification modal
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    fetchSurveyorData();
  }, []);

  const fetchSurveyorData = async () => {
    try {
      setLoading(true);
      const [statsRes, landsRes, compRes, resurvRes] = await Promise.all([
        fetch('/api/surveyor/stats'),
        fetch('/api/lands?role=surveyor'),
        fetch('/api/complaints'),
        fetch('/api/resurveys')
      ]);

      const statsData = await statsRes.json();
      const landsData = await landsRes.json();
      const compData = await compRes.json();
      const resurvData = await resurvRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (landsData.success) setLands(landsData.lands || []);
      if (compData.success) setComplaints(compData.complaints || []);
      if (resurvData.success) setResurveys(resurvData.resurveys || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Filter combined table items
  const filteredLands = lands.filter((land) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      land.survey_number.toLowerCase().includes(q) ||
      land.present_owner.toLowerCase().includes(q) ||
      land.area_name.toLowerCase().includes(q) ||
      land.land_id.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' ||
      (statusFilter === 'VERIFIED' && land.survey_status === 'Verified') ||
      (statusFilter === 'DISPUTED' && (land.survey_status === 'Disputed' || land.disputed_polygon !== null)) ||
      (statusFilter === 'PENDING' && land.survey_status !== 'Verified');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
                Cadastral Survey Operations Portal
              </span>
              <DataProvenanceBadge type="surveyor" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Surveyor Command Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Survey Officer: <span className="text-indigo-300 font-bold">{currentUser?.name}</span> • Division: {currentUser?.jurisdiction || "Ranga Reddy West"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('surveyor_map')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Full Cadastral CAD Map</span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Audit Trail Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 10: Surveyor KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block uppercase truncate">Total Assigned</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats?.total_assigned_surveys || 4}</div>
          <span className="text-[10px] text-slate-500 font-medium">Cadastre parcels</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 block uppercase truncate">Pending Requests</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{stats?.pending_requests || 1}</div>
          <span className="text-[10px] text-amber-600 font-medium">Under scrutiny</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-violet-600 block uppercase truncate">Re-Surveys</span>
          <div className="text-2xl font-black text-violet-700 mt-1">{stats?.resurvey_requests || 1}</div>
          <span className="text-[10px] text-violet-600 font-medium">DGPS Demarcations</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-rose-600 block uppercase truncate">Complaints</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{stats?.boundary_complaints || 2}</div>
          <span className="text-[10px] text-rose-600 font-medium">Boundary disputes</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-red-600 block uppercase truncate">Disputed Lands</span>
          <div className="text-2xl font-black text-red-700 mt-1">{stats?.disputed_lands || 1}</div>
          <span className="text-[10px] text-red-600 font-medium">Encroachment claims</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-teal-600 block uppercase truncate">Completed</span>
          <div className="text-2xl font-black text-teal-700 mt-1">{stats?.completed_surveys || 1}</div>
          <span className="text-[10px] text-teal-600 font-medium">Field inspected</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 block uppercase truncate">Verified Lands</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats?.verified_lands || 2}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Certified deeds</span>
        </div>

      </div>

      {/* Section 17 & 10: Searchable Table and Filter */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Cadastral Survey Register & Grievance Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Select any parcel to inspect evidence, realign GPS boundaries, and issue certified deeds.
            </p>
          </div>

          {/* Search Bar (Section 17) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Survey #, Owner, Area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="DISPUTED">Disputed Parcels</option>
              <option value="PENDING">Pending Surveys</option>
            </select>
          </div>
        </div>

        {/* The Searchable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Survey Number</th>
                <th className="p-3">Present Owner</th>
                <th className="p-3">Area (Acres)</th>
                <th className="p-3">Location</th>
                <th className="p-3">Active Complaint / Dispute</th>
                <th className="p-3">Last Survey</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLands.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No land records match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLands.map((land) => {
                  const relatedComplaint = complaints.find(c => c.land_id === land.land_id);
                  const isDisputed = land.disputed_polygon !== null || land.survey_status === 'Disputed';
                  
                  return (
                    <tr key={land.land_id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {land.survey_number}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        {land.present_owner}
                      </td>
                      <td className="p-3 font-bold">
                        {land.total_area_acres} Acres
                      </td>
                      <td className="p-3 text-slate-500">
                        {land.village}, {land.mandal}
                      </td>
                      <td className="p-3">
                        {relatedComplaint ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                            ⚠️ {relatedComplaint.complaint_type}
                          </span>
                        ) : isDisputed ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                            ⚠️ Boundary Disputed
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">— Clean Title</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">
                        {land.last_survey_date}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          land.survey_status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {land.survey_status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedCase({ land, complaint: relatedComplaint })}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review & Verify</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Surveyor Verification Workflow Modal */}
      {selectedCase && (
        <SurveyorVerificationModal
          land={selectedCase.land}
          complaint={selectedCase.complaint}
          onClose={() => setSelectedCase(null)}
          onRefresh={fetchSurveyorData}
        />
      )}

    </div>
  );
}
