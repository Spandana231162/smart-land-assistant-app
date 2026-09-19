// components/DataProvenanceBadge.jsx
import React from 'react';
import { ShieldCheck, Cpu, CloudSun, Compass, AlertCircle } from 'lucide-react';

export default function DataProvenanceBadge({ type = "official", text, className = "" }) {
  const configs = {
    official: {
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: ShieldCheck,
      defaultLabel: "Official Revenue Record",
      sub: "Dharani / State Cadastre"
    },
    sensor: {
      bg: "bg-blue-50 text-blue-800 border-blue-200",
      icon: Cpu,
      defaultLabel: "IoT Field Sensor",
      sub: "Calibrated Telemetry"
    },
    weather: {
      bg: "bg-sky-50 text-sky-800 border-sky-200",
      icon: CloudSun,
      defaultLabel: "Agrometeorological API",
      sub: "IMD / Open-Meteo"
    },
    surveyor: {
      bg: "bg-purple-50 text-purple-800 border-purple-200",
      icon: Compass,
      defaultLabel: "Surveyor Field Measurement",
      sub: "DGPS GNSS Observation"
    },
    demo: {
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      icon: AlertCircle,
      defaultLabel: "Prototype / Demo Record",
      sub: "Non-Government Sample"
    }
  };

  const current = configs[type] || configs.demo;
  const Icon = current.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs ${current.bg} ${className}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{text || current.defaultLabel}</span>
      <span className="opacity-60 text-[10px]">({current.sub})</span>
    </div>
  );
}
