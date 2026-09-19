// pages/surveyor/AuditHistoryView.jsx
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  User,
  ShieldCheck,
  Search,
  ArrowLeft,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';

export default function AuditHistoryView() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.success) {
        setLogs(data.audit_logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = !search ||
      l.entity.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.user_name.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action) => {
    switch (action) {
      case 'LAND_SURVEY_UPDATED':
      case 'FORWARDED_TO_GOVERNMENT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DISPUTED_AREA_MARKED':
      case 'COMPLAINT_FILED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'RESURVEY_REQUESTED':
      case 'SURVEY_SCHEDULED':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
              Immutable Cadastral Ledger
            </span>
            <DataProvenanceBadge type="official" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 flex items-center gap-2">
            <span>📜</span> System Audit History & Compliance Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident log of all land boundary modifications, grievance resolutions, and government dispatches.
          </p>
        </div>

        <button
          onClick={fetchAuditLogs}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition self-start md:self-auto"
        >
          Refresh Logs
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail by entity, user, details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Action Type:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-hidden"
            >
              <option value="ALL">All Actions</option>
              <option value="COMPLAINT_FILED">Complaint Filed</option>
              <option value="STATUS_UPDATED">Status Updated</option>
              <option value="RESURVEY_REQUESTED">Re-Survey Requested</option>
              <option value="SURVEY_SCHEDULED">Survey Scheduled</option>
              <option value="LAND_SURVEY_UPDATED">Land Survey Updated</option>
              <option value="FORWARDED_TO_GOVERNMENT">Forwarded to Govt</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Audit ID & Time</th>
                <th className="p-3">Operator / User</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Modification Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">Loading audit trail...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">No matching audit records found.</td>
                </tr>
              ) : (
                filteredLogs.map((item) => (
                  <tr key={item.audit_id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 block">{item.audit_id}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                      {item.user_name}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getActionBadge(item.action)}`}>
                        {item.action}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                      {item.entity}
                    </td>
                    <td className="p-3 text-slate-600 leading-relaxed max-w-md">
                      {item.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
