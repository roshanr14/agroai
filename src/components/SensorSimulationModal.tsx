import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  CloudRain, 
  Sun, 
  AlertTriangle, 
  Bug, 
  Sparkles, 
  Sliders, 
  Cpu
} from 'lucide-react';
import { SensorReadings } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  readings: SensorReadings;
  onPreset: (preset: string) => Promise<void>;
  onOverride: (field: string, value: number) => Promise<void>;
  onTick: () => Promise<void>;
}

export const SensorSimulationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  readings,
  onPreset,
  onOverride,
  onTick
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePresetClick = async (preset: string) => {
    setLoadingAction(preset);
    try {
      await onPreset(preset);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleTickClick = async () => {
    setLoadingAction('tick');
    try {
      await onTick();
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] max-w-2xl w-full text-stone-900 shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-7 py-5 border-b border-stone-100 flex items-center justify-between bg-[#f8faf9]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#eaf7ef] text-[#279e5a] rounded-2xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                Simulated IoT Sensor Control Panel
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#eaf7ef] text-[#279e5a] font-bold">
                  Demo & Dev Mode
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Generate realistic agricultural scenarios without physical hardware.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Scenario Buttons */}
          <div>
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-3">
              One-Click Environmental Scenarios
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handlePresetClick('rain')}
                disabled={loadingAction !== null}
                className="flex items-center gap-2.5 p-3.5 bg-[#f8faf9] hover:bg-[#eaf7ef] border border-stone-200 hover:border-[#279e5a] rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-sky-100 text-sky-700 rounded-xl group-hover:scale-105 transition-transform">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Simulate Rain</div>
                  <div className="text-[10px] text-stone-500">92% Rain, High Humidity</div>
                </div>
              </button>

              <button
                onClick={() => handlePresetClick('drought')}
                disabled={loadingAction !== null}
                className="flex items-center gap-2.5 p-3.5 bg-[#f8faf9] hover:bg-[#fef3c7] border border-stone-200 hover:border-amber-400 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl group-hover:scale-105 transition-transform">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Simulate Drought</div>
                  <div className="text-[10px] text-stone-500">19% Moisture, 38.5°C</div>
                </div>
              </button>

              <button
                onClick={() => handlePresetClick('nitrogen_deficiency')}
                disabled={loadingAction !== null}
                className="flex items-center gap-2.5 p-3.5 bg-[#f8faf9] hover:bg-rose-50 border border-stone-200 hover:border-rose-400 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Low Nitrogen</div>
                  <div className="text-[10px] text-stone-500">21 mg/kg Deficit</div>
                </div>
              </button>

              <button
                onClick={() => handlePresetClick('pest_surge')}
                disabled={loadingAction !== null}
                className="flex items-center gap-2.5 p-3.5 bg-[#f8faf9] hover:bg-purple-50 border border-stone-200 hover:border-purple-400 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl group-hover:scale-105 transition-transform">
                  <Bug className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Pest Surge</div>
                  <div className="text-[10px] text-stone-500">High Humidity Vector</div>
                </div>
              </button>

              <button
                onClick={() => handlePresetClick('optimal')}
                disabled={loadingAction !== null}
                className="flex items-center gap-2.5 p-3.5 bg-[#eaf7ef] hover:bg-[#c1e8cd] border border-[#c1e8cd] rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-[#279e5a] text-white rounded-xl group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#166436]">Optimal Farm</div>
                  <div className="text-[10px] text-stone-600">94/100 Score</div>
                </div>
              </button>

              <button
                onClick={handleTickClick}
                disabled={loadingAction !== null}
                className="flex items-center gap-2.5 p-3.5 bg-[#f8faf9] hover:bg-stone-100 border border-stone-200 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-stone-200 text-stone-700 rounded-xl group-hover:scale-105 transition-transform">
                  <RefreshCw className={`w-4 h-4 ${loadingAction === 'tick' ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Advance Clock</div>
                  <div className="text-[10px] text-stone-500">+15 Minutes Physics</div>
                </div>
              </button>
            </div>
          </div>

          {/* Precision Sliders */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Continuous Sensor Overrides
            </label>

            {/* Nitrogen */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-semibold">Nitrogen (N)</span>
                <span className="font-mono text-[#279e5a] font-bold">{readings.nitrogen} mg/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="1"
                value={readings.nitrogen}
                aria-label="Nitrogen (N)"
                onChange={(e) => onOverride('nitrogen', parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#279e5a]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>10 (Severe Deficit)</span>
                <span className="font-semibold text-[#279e5a]">40-65 (Optimal)</span>
                <span>80 (Excess)</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-semibold">Phosphorus (P)</span>
                <span className="font-mono text-[#279e5a] font-bold">{readings.phosphorus} mg/kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={readings.phosphorus}
                aria-label="Phosphorus (P)"
                onChange={(e) => onOverride('phosphorus', parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#279e5a]"
              />
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-semibold">Potassium (K)</span>
                <span className="font-mono text-[#279e5a] font-bold">{readings.potassium} mg/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={readings.potassium}
                aria-label="Potassium (K)"
                onChange={(e) => onOverride('potassium', parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#279e5a]"
              />
            </div>

            {/* Soil Moisture */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-semibold">Soil Moisture</span>
                <span className="font-mono text-sky-600 font-bold">{readings.soil_moisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                step="1"
                value={readings.soil_moisture}
                aria-label="Soil Moisture"
                onChange={(e) => onOverride('soil_moisture', parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>10% (Wilting)</span>
                <span className="font-semibold text-[#279e5a]">45-65% (Optimal)</span>
                <span>85% (Saturated)</span>
              </div>
            </div>

            {/* pH */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-semibold">Soil pH</span>
                <span className="font-mono text-amber-700 font-bold">{readings.ph}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="8.5"
                step="0.1"
                value={readings.ph}
                aria-label="Soil pH"
                onChange={(e) => onOverride('ph', parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Rain Probability */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-semibold">Rain Probability</span>
                <span className="font-mono text-sky-600 font-bold">{readings.rain_probability}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={readings.rain_probability}
                aria-label="Rain Probability"
                onChange={(e) => onOverride('rain_probability', parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Footer with High-Contrast CTA button */}
        <div className="px-7 py-4 bg-[#f8faf9] border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#279e5a]" />
            <span>Updates trigger autonomous LangGraph agent re-evaluation.</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#191c21] hover:bg-black text-white font-bold rounded-full transition-all shadow-md cursor-pointer"
          >
            Apply & View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
