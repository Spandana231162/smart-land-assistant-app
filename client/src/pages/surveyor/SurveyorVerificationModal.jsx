// pages/surveyor/SurveyorVerificationModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LeafletMap from '../../components/LeafletMap';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  Compass,
  Send,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  Building2
} from 'lucide-react';

export default function SurveyorVerificationModal({ complaint, land, onClose, onRefresh }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'measurements' | 'report' | 'gov_dispatch'
  
  // Measurement adjustments state
  const [measurements, setMeasurements] = useState({
    total_area_acres: land?.total_area_acres || 4.75,
    perimeter_meters: 1042.5,
    instrument: "Trimble R12i GNSS / DGPS Dual-Frequency Receiver",
    remarks: "Field DGPS boundary verification conducted on-site. Eastern ridge peg displaced by 3.8m due to ditch desilting. Boundary points realigned with official 2018 village cadastre."
  });

  const [verificationStatus, setVerificationStatus] = useState("Verified");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Submit surveyor verification (Section 11)
  const handleVerifySubmit = async (decision) => {
    try {
      setIsProcessing(true);
      
      // 1. Update land boundary/measurements
      const landRes = await fetch('/api/surveyor/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.user_id || 'SUR-502'
        },
        body: JSON.stringify({
          land_id: land.land_id,
          updates: {
            survey_status: decision === 'approve' ? 'Verified' : 'Disputed',
            verification_status: decision === 'approve' 
              ? 'Field Verified & Approved by Cadastral Division'
              : 'Survey Correction Rejected after Field Inspection',
            total_area_acres: measurements.total_area_acres,
            remarks: measurements.remarks,
            disputed_polygon: decision === 'approve' ? null : land.disputed_polygon,
            reported_incorrect_line: decision === 'approve' ? null : land.reported_incorrect_line
          }
        })
      });

      // 2. Update complaint status if exists
      if (complaint) {
        await fetch(`/api/complaints/${complaint.complaint_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser?.user_id || 'SUR-502'
          },
          body: JSON.stringify({
            status: decision === 'approve' ? 'Resolved' : 'Rejected',
            surveyor_remarks: measurements.remarks
          })
        });
      }

      setSuccessMessage(
        decision === 'approve'
          ? `Boundary Verification Approved. Status updated to 'Verified'. Audit log recorded.`
          : `Grievance evaluated and marked 'Rejected'. Audit log recorded.`
      );

      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
      alert("Verification update failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Dispatch to Government Revenue Department (Section 11 step 14)
  const handleGovDispatch = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/surveyor/forward-gov', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.user_id || 'SUR-502'
        },
        body: JSON.stringify({
          survey_number: land.survey_number,
          land_id: land.land_id,
          farmer_id: land.owner_id,
          owner_name: land.present_owner,
          verified_acres: measurements.total_area_acres,
          target_department: "Dharani Integrated Land Records Management System, Govt of Telangana"
        })
      });
      const data = await res.json();
      if (data.success) {
        setDispatchResult(data.submission);
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      console.error(e);
      alert("Failed to transmit to government portal.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Top Banner */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-black uppercase tracking-wider">
                Surveyor Verification Workflow (Section 11)
              </span>
              <DataProvenanceBadge type="surveyor" />
            </div>
            <h2 className="text-xl font-black mt-1">
              Field Cadastral Verification • Survey #{land?.survey_number}
            </h2>
            <p className="text-xs text-slate-400">
              Owner: {land?.present_owner} • Location: {land?.area_name} ({land?.village}, {land?.mandal})
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Subnav Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('review')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'review' ? 'border-indigo-600 text-indigo-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Evidence & Boundary Comparison
          </button>
          <button
            onClick={() => setActiveTab('measurements')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'measurements' ? 'border-indigo-600 text-indigo-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Field Measurements & Verification
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'report' ? 'border-indigo-600 text-indigo-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Generate Official Survey Deed
          </button>
          <button
            onClick={() => setActiveTab('gov_dispatch')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'gov_dispatch' ? 'border-indigo-600 text-indigo-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Government Bhoomi / Dharani Dispatch
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: EVIDENCE & BOUNDARY COMPARISON */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              
              {/* Complaint Overview */}
              {complaint ? (
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">
                      Farmer Grievance #{complaint.complaint_id} • Type: {complaint.complaint_type}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-black">
                      Claim: ~{complaint.disputed_area_acres} Acres Encroached
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    "{complaint.description}"
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Location: {complaint.location}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Standard Cadastral Survey Verification Mode (No Open Farmer Grievance)
                </div>
              )}

              {/* Side-by-Side Map Comparison */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Cadastral Map: Official Boundary (Green) vs Reported Displaced Ridge (Orange) vs Dispute (Red)</span>
                </div>
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <LeafletMap
                    land={land}
                    height="340px"
                    showNeighbors={true}
                  />
                </div>
              </div>

              {/* Uploaded Evidence Inspection (Section 7 & 11) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  Uploaded Farmer Evidence & Revenue Documents (Section 7)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo Evidence 1 */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <img
                      src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                      alt="Boundary Marker"
                      className="w-full h-36 object-cover rounded-xl border border-slate-200"
                    />
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>boundary_stone_damage.jpg</span>
                      <span className="text-slate-400 font-normal">2.4 MB</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Photo shows displaced survey stone along eastern drainage bund.
                    </p>
                  </div>

                  {/* Document Evidence 2 */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <img
                      src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
                      alt="Pattedar Passbook"
                      className="w-full h-36 object-cover rounded-xl border border-slate-200"
                    />
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>pattadar_passbook_extract.pdf</span>
                      <span className="text-slate-400 font-normal">1.2 MB</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Original 2018 Revenue Passbook certifying 4.75 total acres.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons to Next Tab */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab('measurements')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
                >
                  Proceed to Field Measurements & Verification →
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: MEASUREMENTS & VERIFICATION (Section 11 steps 8-12) */}
          {activeTab === 'measurements' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-1">
                <h4 className="font-bold uppercase tracking-wider">Field Survey Protocol</h4>
                <p>
                  Update measured perimeter, verified acreage, and GNSS observations. Approving will realign official cadastre and resolve disputes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Verified Total Land Area (Acres) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={measurements.total_area_acres}
                    onChange={(e) => setMeasurements({ ...measurements, total_area_acres: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-black text-slate-900 font-mono text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cadastral Perimeter (Meters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements.perimeter_meters}
                    onChange={(e) => setMeasurements({ ...measurements, perimeter_meters: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 font-mono text-base"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Survey Instrument / Equipment Used
                  </label>
                  <input
                    type="text"
                    value={measurements.instrument}
                    onChange={(e) => setMeasurements({ ...measurements, instrument: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Surveyor Field Remarks & Demarcation Notes *
                  </label>
                  <textarea
                    rows={4}
                    value={measurements.remarks}
                    onChange={(e) => setMeasurements({ ...measurements, remarks: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-medium text-slate-900 text-xs"
                  />
                </div>

              </div>

              {/* Decision Action Buttons (Section 11 step 12) */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Surveyor Adjudication Decision</h4>
                  <p className="text-xs text-slate-500">Every decision is immutably recorded in the system audit history.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleVerifySubmit('reject')}
                    className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs transition flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Reject Correction</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleVerifySubmit('approve')}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-700/20 transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Verify Boundary</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: GENERATE OFFICIAL SURVEY REPORT (Section 11 step 13) */}
          {activeTab === 'report' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Printable Cadastral Deed Certificate</span>
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition"
                >
                  <Printer className="w-4 h-4" /> Print Deed / PDF
                </button>
              </div>

              {/* Printable Certificate Box */}
              <div className="p-8 rounded-3xl border-4 border-slate-900 bg-white text-slate-900 space-y-6 font-serif shadow-xl">
                
                {/* Certificate Header */}
                <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                  <p className="text-xs font-bold tracking-widest uppercase">Government of Telangana • Survey, Settlement & Land Records</p>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Official Cadastral Survey Certificate</h3>
                  <p className="text-xs italic text-slate-600">Issued under Section 14 of the Cadastral Survey & Boundaries Act</p>
                </div>

                {/* Certificate Details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><b>Survey Number:</b> <span className="font-mono font-bold">{land.survey_number}</span></div>
                  <div><b>Sub-Division:</b> {land.sub_division}</div>
                  <div><b>Area Name:</b> {land.area_name}</div>
                  <div><b>Village / Mandal:</b> {land.village}, {land.mandal}</div>
                  <div><b>Pattedar / Owner:</b> {land.present_owner}</div>
                  <div><b>Passbook No:</b> {land.passbook_number}</div>
                  <div><b>Total Verified Area:</b> {measurements.total_area_acres} Acres</div>
                  <div><b>Last Survey Date:</b> {new Date().toISOString().split('T')[0]}</div>
                </div>

                {/* Verified Coordinates Table */}
                <div className="space-y-2 text-xs">
                  <p className="font-bold font-sans uppercase tracking-wider text-[11px]">DGPS Corner Coordinates:</p>
                  <table className="w-full text-left border border-slate-300 font-mono text-[11px]">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-1.5 border-b">Peg ID</th>
                        <th className="p-1.5 border-b">Marker Name</th>
                        <th className="p-1.5 border-b">Latitude</th>
                        <th className="p-1.5 border-b">Longitude</th>
                      </tr>
                    </thead>
                    <tbody>
                      {land.boundary_points?.map((pt) => (
                        <tr key={pt.id} className="border-b">
                          <td className="p-1.5 font-bold">{pt.id}</td>
                          <td className="p-1.5">{pt.name}</td>
                          <td className="p-1.5">{pt.lat.toFixed(5)}° N</td>
                          <td className="p-1.5">{pt.lng.toFixed(5)}° E</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Surveyor Remarks */}
                <div className="text-xs italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <b>Surveyor Remarks:</b> "{measurements.remarks}"
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-end pt-8 border-t border-slate-300 text-xs">
                  <div className="text-center">
                    <div className="h-10"></div>
                    <p className="border-t border-slate-400 pt-1">Signature of Land Owner</p>
                  </div>
                  <div className="text-center">
                    <div className="text-emerald-700 font-bold font-mono text-sm">✓ Srikanth Rao</div>
                    <p className="border-t border-slate-400 pt-1 font-sans font-bold">
                      Senior Cadastral Surveyor (Grade-I)<br/>
                      <span className="text-[10px] text-slate-500 font-normal">Badge: TS-SURV-GRADE1-884</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: GOVERNMENT DISPATCH (Section 11 step 14) */}
          {activeTab === 'gov_dispatch' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-base font-bold">Transmit to Government Revenue Department</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Integrates with the State Dharani / Bhoomi Land Records Gateway. Transmits signed cadastral vectors and GPS measurements for gazette notification and passbook synchronization.
                </p>
              </div>

              {dispatchResult ? (
                <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 space-y-4 text-xs animate-in zoom-in-95">
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Transmission Confirmed & Queued for State Gazette Ledger</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-emerald-200">
                    <div><b>Dispatch Reference ID:</b> <span className="font-mono text-emerald-700 font-bold">{dispatchResult.dispatch_id}</span></div>
                    <div><b>Survey Number:</b> {dispatchResult.survey_number}</div>
                    <div><b>Target System:</b> {dispatchResult.target_department}</div>
                    <div><b>Cryptographic Proof:</b> <span className="font-mono text-[10px]">{dispatchResult.verification_hash}</span></div>
                  </div>

                  <p className="text-slate-600">
                    Audit log entry generated and automated notification dispatched to registered farmer.
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                  <div className="text-xs text-slate-700 space-y-1">
                    <p><b>Target Entity:</b> Department of Survey, Settlement & Land Records (Dharani Portal)</p>
                    <p><b>Verified Parcel:</b> Survey #{land.survey_number} ({measurements.total_area_acres} Acres)</p>
                    <p><b>Authorizing Officer:</b> Srikanth Rao, Senior Surveyor</p>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleGovDispatch}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm & Transmit to Revenue Department</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Cadastral Division System • All actions logged in Audit Trail
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
