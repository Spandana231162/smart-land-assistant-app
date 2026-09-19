// pages/surveyor/CadastralEditorMap.jsx
import React, { useState, useEffect } from 'react';
import LeafletMap from '../../components/LeafletMap';
import DataProvenanceBadge from '../../components/DataProvenanceBadge';
import {
  Compass,
  Layers,
  ShieldCheck,
  RotateCcw,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function CadastralEditorMap() {
  const [lands, setLands] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState("LAND-TG-501");
  const [land, setLand] = useState(null);
  const [showNeighbors, setShowNeighbors] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLands();
  }, []);

  useEffect(() => {
    if (lands.length > 0) {
      const found = lands.find(l => l.land_id === selectedLandId) || lands[0];
      setLand(found);
    }
  }, [lands, selectedLandId]);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/lands?role=surveyor');
      const data = await res.json();
      if (data.success) {
        setLands(data.lands || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-extrabold uppercase">
              Surveyor GIS Workspace
            </span>
            <DataProvenanceBadge type="surveyor" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>📐</span> Cadastral Boundary & Vector Map Editor
          </h1>
          <p className="text-xs text-slate-500">
            Precision GNSS boundary point coordinates, legal adjacency polygons, and dispute reconciliation.
          </p>
        </div>

        {/* Parcel Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedLandId}
            onChange={(e) => setSelectedLandId(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-900 shadow-2xs focus:outline-hidden"
          >
            {lands.map(l => (
              <option key={l.land_id} value={l.land_id}>
                Survey #{l.survey_number} - {l.present_owner} ({l.total_area_acres} Ac)
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowNeighbors(!showNeighbors)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              showNeighbors ? 'bg-indigo-50 border-indigo-300 text-indigo-800' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showNeighbors ? 'Neighbors Visible' : 'Hide Neighbors'}</span>
          </button>
        </div>
      </div>

      {/* Cadastral Map View */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
        {land && (
          <LeafletMap
            land={land}
            height="560px"
            showNeighbors={showNeighbors}
            interactiveLegend={true}
          />
        )}
      </div>

      {/* Boundary Markers Coordinate Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-600" />
          <span>Cadastral Boundary Point Coordinates (DGPS Epoch 2026.5)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {land?.boundary_points?.map((pt) => (
            <div key={pt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between items-center font-bold">
                <span className="text-indigo-700">{pt.id} ({pt.code})</span>
                <span className={`px-2 py-0.5 rounded-sm text-[10px] ${pt.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {pt.status}
                </span>
              </div>
              <p className="font-bold text-slate-900">{pt.name}</p>
              <p className="font-mono text-slate-500 text-[11px]">
                Lat: {pt.lat.toFixed(6)}° N<br/>
                Lng: {pt.lng.toFixed(6)}° E
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
