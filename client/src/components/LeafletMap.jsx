// components/LeafletMap.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldCheck, AlertTriangle, HelpCircle, Layers } from 'lucide-react';

// Fix default leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function LeafletMap({
  center = [17.4520, 78.6850],
  zoom = 16,
  land,
  allowPinpoint = false,
  selectedPin = null,
  onLocationSelect = null,
  height = "420px",
  showNeighbors = true,
  interactiveLegend = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const pinMarkerRef = useRef(null);
  const layersGroupRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        attributionControl: false
      });

      // Standard High-Readability Carto / OSM Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      layersGroupRef.current = L.featureGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle map click for reporting problem coordinates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleClick = (e) => {
      if (allowPinpoint && onLocationSelect) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [allowPinpoint, onLocationSelect]);

  // Update selected Pinpoint Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedPin) {
      if (pinMarkerRef.current) {
        pinMarkerRef.current.setLatLng([selectedPin.lat, selectedPin.lng]);
      } else {
        const redPinIcon = L.divIcon({
          className: 'custom-pin-marker',
          html: `<div style="background-color: #ef4444; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; animation: bounce 1s infinite;">📍</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28]
        });

        pinMarkerRef.current = L.marker([selectedPin.lat, selectedPin.lng], { icon: redPinIcon })
          .addTo(map)
          .bindPopup(`<b>Reported Problem Spot</b><br/>Lat: ${selectedPin.lat}<br/>Lng: ${selectedPin.lng}`)
          .openPopup();
      }
    } else if (pinMarkerRef.current) {
      pinMarkerRef.current.remove();
      pinMarkerRef.current = null;
    }
  }, [selectedPin]);

  // Render Land Parcels, Boundaries, Disputed Area, Neighboring plots
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group || !land) return;

    group.clearLayers();

    // 1. Neighboring lands (Blue translucent)
    if (showNeighbors && land.neighboring_lands?.length) {
      land.neighboring_lands.forEach((n) => {
        if (n.polygon?.length) {
          const neighborPoly = L.polygon(n.polygon, {
            color: '#3b82f6',
            weight: 1.5,
            fillColor: '#60a5fa',
            fillOpacity: 0.18,
            dashArray: '4, 4'
          }).bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px;">
              <span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Neighboring Land</span>
              <p style="margin: 6px 0 2px; font-weight: bold; color: #0f172a;">Survey #${n.survey_number}</p>
              <p style="margin: 0; color: #475569;">Owner: ${n.owner_display}</p>
              <p style="margin: 2px 0 0; color: #475569;">Area: ${n.area_acres} Acres | Direction: ${n.boundary_direction}</p>
            </div>
          `);
          group.addLayer(neighborPoly);
        }
      });
    }

    // 2. Verified Main Land Boundary (Solid Emerald)
    if (land.boundary_polygon?.length) {
      const isVerified = land.survey_status === 'Verified';
      const mainPoly = L.polygon(land.boundary_polygon, {
        color: isVerified ? '#10b981' : '#eab308',
        weight: 3,
        fillColor: isVerified ? '#34d399' : '#fde047',
        fillOpacity: 0.25
      }).bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px;">
          <div style="font-weight: bold; color: #065f46;">📍 Survey #${land.survey_number}</div>
          <div style="color: #334155; margin-top: 4px;"><b>Owner:</b> ${land.present_owner}</div>
          <div style="color: #334155;"><b>Area:</b> ${land.total_area_acres} Acres</div>
          <div style="color: #334155;"><b>Status:</b> ${isVerified ? '✅ Officially Verified' : '⏳ Pending Verification'}</div>
        </div>
      `);
      group.addLayer(mainPoly);
      map.fitBounds(mainPoly.getBounds(), { padding: [40, 40] });
    }

    // 3. Disputed Area Polygon (Red Striped)
    if (land.disputed_polygon?.length) {
      const disputePoly = L.polygon(land.disputed_polygon, {
        color: '#ef4444',
        weight: 2.5,
        fillColor: '#f87171',
        fillOpacity: 0.45,
        dashArray: '5, 5'
      }).bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #991b1b;">
          <b>⚠️ Disputed Area Parcel</b><br/>
          Estimated discrepancy: ~0.25 Acres.<br/>
          Status: Under Field Verification.
        </div>
      `);
      group.addLayer(disputePoly);
    }

    // 4. Reported Incorrect Boundary Line (Amber / Orange Dashed Line)
    if (land.reported_incorrect_line?.length) {
      const incorrectLine = L.polyline(land.reported_incorrect_line, {
        color: '#f97316',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.9
      }).bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #c2410c;">
          <b>⚠️ Reported Displaced Ridge / Boundary Line</b><br/>
          Farmer reported boundary displaced during canal work.
        </div>
      `);
      group.addLayer(incorrectLine);
    }

    // 5. Cadastral Corner Stones / Markers
    if (land.boundary_points?.length) {
      land.boundary_points.forEach((pt) => {
        const markerIcon = L.divIcon({
          className: 'corner-stone-marker',
          html: `<div style="background-color: ${pt.verified ? '#047857' : '#dc2626'}; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${pt.id}</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const stoneMarker = L.marker([pt.lat, pt.lng], { icon: markerIcon })
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px;">
              <b>Corner Peg ${pt.id} (${pt.code})</b><br/>
              Name: ${pt.name}<br/>
              GPS: ${pt.lat.toFixed(5)}, ${pt.lng.toFixed(5)}<br/>
              Status: <span style="color: ${pt.verified ? '#059669' : '#dc2626'}; font-weight: bold;">${pt.status}</span>
            </div>
          `);
        group.addLayer(stoneMarker);
      });
    }

  }, [land, showNeighbors]);

  const isVerified = land?.survey_status === 'Verified';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height: height, minHeight: '340px' }} className="w-full" />

      {/* Floating Status Banner */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap gap-2 items-center">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${
          isVerified
            ? 'bg-emerald-600/90 text-white border border-emerald-400'
            : 'bg-amber-500/95 text-white border border-amber-300'
        }`}>
          {isVerified ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{isVerified ? 'VERIFIED OFFICIAL SURVEY' : 'SURVEY VERIFICATION PENDING'}</span>
        </div>

        {allowPinpoint && (
          <div className="bg-slate-900/85 text-white text-xs px-3 py-1.5 rounded-full shadow-md backdrop-blur-md flex items-center gap-1.5 animate-pulse">
            <span>📍 Click anywhere on map to pin problem spot</span>
          </div>
        )}
      </div>

      {/* Interactive Legend Box */}
      {interactiveLegend && (
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-md text-[11px] font-medium text-slate-700 flex flex-col gap-1.5 max-w-[240px]">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
            <Layers className="w-3.5 h-3.5 text-slate-500" /> Cadastral Layers
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 border border-emerald-700 shrink-0"></span>
            <span>Verified Land Boundary</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-xs bg-rose-500 border border-rose-700 shrink-0"></span>
            <span>Disputed Area Parcel</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-500 shrink-0"></span>
            <span>Reported Incorrect Line</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-xs bg-blue-400 border border-blue-600 opacity-60 shrink-0"></span>
            <span>Neighboring Lands</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-700 border border-white shrink-0"></span>
            <span>Survey Corner Markers (P1-P4)</span>
          </div>
        </div>
      )}

      {/* Center GPS coordinate info */}
      {land?.center_coords && (
        <div className="absolute bottom-3 right-3 z-[400] bg-slate-900/75 text-slate-200 text-[10px] px-2 py-1 rounded-md backdrop-blur-xs font-mono">
          Lat: {land.center_coords[0]?.toFixed(4)} | Lng: {land.center_coords[1]?.toFixed(4)}
        </div>
      )}
    </div>
  );
}
