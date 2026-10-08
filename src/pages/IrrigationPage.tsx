import React, { useState } from 'react';
import { 
  Droplet, 
  CloudRain, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  TrendingDown,
  Layers,
  History,
  Sliders,
  Calendar
} from 'lucide-react';
import { Language, SensorReadings, IrrigationAnalysis, FarmerProfile } from '../types';
import { getTranslation } from '../lib/i18n';

interface Props {
  language: Language;
  readings: SensorReadings;
  analysis: IrrigationAnalysis;
  profile: FarmerProfile;
  onOpenSimulator: () => void;
}

export const IrrigationPage: React.FC<Props> = ({
  language,
  readings,
  analysis,
  profile,
  onOpenSimulator
}) => {
  const t = getTranslation(language);
  const [history] = useState([
    { date: "Yesterday", status: "Completed", window: "06:00 AM – 06:45 AM", volume: "3,600 L", saved: "1,400 L", reason: "Standard morning drip maintenance" },
    { date: "3 Days Ago", status: "Completed", window: "06:15 AM – 07:00 AM", volume: "3,600 L", saved: "1,500 L", reason: "Deficit restoration" },
    { date: "5 Days Ago", status: "Postponed", window: "Held for 24h", volume: "0 L", saved: "3,200 L", reason: "Rainfall event (18mm)" },
    { date: "7 Days Ago", status: "Completed", window: "06:00 AM – 06:40 AM", volume: "3,200 L", saved: "1,200 L", reason: "Scheduled cycle" }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-100 text-cyan-800">
              <Droplet className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono text-cyan-800 font-bold tracking-wider">
              IRRIGATION INTELLIGENCE AGENT (AGENT 04)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.irrigationIntelligence}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Reinforcement Learning policy balancing soil water deficit against rainfall probability for {profile.crop}
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Simulate Moisture / Drought</span>
        </button>
      </div>

      {/* Main RL Policy Decision Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 border border-cyan-900/60 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded-full">
                RL Q-Network Hydro-Policy Active
              </span>
              <span className="text-stone-400 text-xs">
                Method: {profile.irrigationMethod} ({profile.farmAcres} Acres)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
              {analysis.decision_state}
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              {analysis.reason}
            </p>
          </div>

          {/* Water Savings Counter */}
          <div className="bg-stone-950/80 border border-cyan-900/60 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-800">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                Water Conserved
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400">
                ~{analysis.estimated_water_saved_liters.toLocaleString()} <span className="text-sm font-normal text-stone-300">Liters</span>
              </div>
              <div className="text-[10px] text-stone-400">
                vs unmanaged timer flood
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Input Factors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-800/80">
          <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
            <div className="text-[11px] text-stone-400">Current Soil Moisture</div>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
              {readings.soil_moisture}%
            </div>
            <div className="text-[10px] text-stone-500">Target: 48 - 58%</div>
          </div>

          <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
            <div className="text-[11px] text-stone-400">Rain Probability</div>
            <div className="text-lg font-bold font-mono text-sky-400 mt-0.5">
              {readings.rain_probability}%
            </div>
            <div className="text-[10px] text-stone-500">24-hour window</div>
          </div>

          <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
            <div className="text-[11px] text-stone-400">Optimal Window</div>
            <div className="text-sm font-bold font-mono text-stone-200 mt-0.5 truncate">
              {analysis.recommended_window}
            </div>
            <div className="text-[10px] text-stone-500">Low evaporation time</div>
          </div>

          <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
            <div className="text-[11px] text-stone-400">Duration Required</div>
            <div className="text-lg font-bold font-mono text-stone-200 mt-0.5">
              {analysis.recommended_duration_minutes} min
            </div>
            <div className="text-[10px] text-stone-500">{analysis.recommended_volume_liters} Liters target</div>
          </div>
        </div>
      </div>

      {/* Moisture vs Crop Requirement Comparison */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-6">
        <h3 className="font-bold text-stone-900 text-base">Crop Moisture Deficit & Evaporative Stress</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-stone-700">Root-zone Soil Moisture vs Optimal Range</span>
              <span className="font-mono font-bold text-cyan-800">{readings.soil_moisture}% of Field Capacity</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-4 relative overflow-hidden flex">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${readings.soil_moisture}%` }}
              ></div>
              {/* Target zone overlay */}
              <div
                className="absolute top-0 bottom-0 bg-emerald-500/20 border-x border-emerald-600 pointer-events-none"
                style={{ left: '48%', width: '15%' }}
                title="Optimal Tomato Range (48-63%)"
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>0% (Severe Stress)</span>
              <span className="font-bold text-emerald-800">48% - 63% (Optimal Tomato Growth Zone)</span>
              <span>100% (Saturated)</span>
            </div>
          </div>
        </div>

        {/* Reinforcement Learning Reward Matrix Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
            <div className="text-stone-500 font-medium">Evapotranspiration Rate</div>
            <div className="text-sm font-bold text-stone-900">4.8 mm/day</div>
            <div className="text-[11px] text-stone-500">Moderate solar heat index</div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
            <div className="text-stone-500 font-medium">Soil Percolation</div>
            <div className="text-sm font-bold text-stone-900">Loamy Soil (Medium Retention)</div>
            <div className="text-[11px] text-stone-500">Drainage allows 24h buffer</div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
            <div className="text-stone-500 font-medium">Emission Efficiency</div>
            <div className="text-sm font-bold text-emerald-800">92% Drip Uniformity</div>
            <div className="text-[11px] text-emerald-700">Root-targeted delivery</div>
          </div>
        </div>
      </div>

      {/* Irrigation History Table */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-stone-400" />
            <h3 className="font-bold text-stone-900 text-base">Irrigation Execution History</h3>
          </div>
          <span className="text-xs font-mono text-stone-500">Autonomous valve log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 uppercase font-mono">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Time Window</th>
                <th className="pb-3 font-semibold">Volume Applied</th>
                <th className="pb-3 font-semibold">Water Saved</th>
                <th className="pb-3 font-semibold">Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {history.map((row, i) => (
                <tr key={i} className="hover:bg-stone-50">
                  <td className="py-3 font-semibold text-stone-900">{row.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      row.status === 'Completed' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-stone-600">{row.window}</td>
                  <td className="py-3 font-mono font-semibold text-stone-900">{row.volume}</td>
                  <td className="py-3 font-mono text-cyan-800 font-bold">{row.saved}</td>
                  <td className="py-3 text-stone-500 max-w-xs">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
