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
  Check, 
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-emerald-900/60 rounded-2xl max-w-2xl w-full text-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 flex items-center gap-2">
                Simulated IoT Sensor Control Panel
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Demo & Dev Mode
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Generate realistic agricultural scenarios for evaluation without physical hardware.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Scenario Buttons */}
          <div>
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-3">
              One-Click Environmental Scenarios
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handlePresetClick('rain')}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 p-3 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-sky-950 text-sky-400 rounded-lg group-hover:scale-105 transition-transform">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-sky-300">Simulate Rain</div>
                  <div className="text-[10px] text-stone-400">92% Rain, High Humidity</div>
                </div>
              </button>

              <button
                onClick={() => handlePresetClick('drought')}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 p-3 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-amber-950 text-amber-400 rounded-lg group-hover:scale-105 transition-transform">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-300">Simulate Drought</div>
                  <div className="text-[10px] text-stone-400">19% Moisture, 38.5°C</div>
                </div>
              </button>

              <button
                onClick={() => handlePresetClick('nitrogen_deficiency')}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 p-3 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-rose-950 text-rose-400 rounded-lg group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-rose-300">Low Nitrogen</div>
                  <div className="text-[10px] text-stone-400">21 mg/kg Deficit</div>
                </div>
              </button>

              <button
                onClick={() => handlePresetClick('pest_surge')}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 p-3 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-purple-950 text-purple-400 rounded-lg group-hover:scale-105 transition-transform">
                  <Bug className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-purple-300">Pest Surge</div>
                  <div className="text-[10px] text-stone-400">High Humidity Vector</div>
                </div>
              </button>

              <button
                onClick={() => handlePresetClick('optimal')}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 p-3 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-300">Optimal Farm</div>
                  <div className="text-[10px] text-stone-400">94/100 Score</div>
                </div>
              </button>

              <button
                onClick={handleTickClick}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 p-3 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="p-2 bg-stone-700 text-stone-300 rounded-lg group-hover:scale-105 transition-transform">
                  <RefreshCw className={`w-4 h-4 ${loadingAction === 'tick' ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-200">Advance Clock</div>
                  <div className="text-[10px] text-stone-400">+15 Minutes Physics</div>
                </div>
              </button>
            </div>
          </div>

          {/* Precision Sliders */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
              Continuous Sensor Overrides
            </label>

            {/* Nitrogen */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300 font-medium">Nitrogen (N)</span>
                <span className="font-mono text-emerald-400 font-bold">{readings.nitrogen} mg/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="1"
                value={readings.nitrogen}
                aria-label="Nitrogen (N)"
                onChange={(e) => onOverride('nitrogen', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
                <span>10 (Severe Deficit)</span>
                <span>40-65 (Optimal)</span>
                <span>80 (Excess)</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300 font-medium">Phosphorus (P)</span>
                <span className="font-mono text-emerald-400 font-bold">{readings.phosphorus} mg/kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={readings.phosphorus}
                aria-label="Phosphorus (P)"
                onChange={(e) => onOverride('phosphorus', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300 font-medium">Potassium (K)</span>
                <span className="font-mono text-emerald-400 font-bold">{readings.potassium} mg/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={readings.potassium}
                aria-label="Potassium (K)"
                onChange={(e) => onOverride('potassium', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Soil Moisture */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300 font-medium">Soil Moisture</span>
                <span className="font-mono text-sky-400 font-bold">{readings.soil_moisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                step="1"
                value={readings.soil_moisture}
                aria-label="Soil Moisture"
                onChange={(e) => onOverride('soil_moisture', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
                <span>10% (Wilting)</span>
                <span>45-65% (Optimal)</span>
                <span>85% (Saturated)</span>
              </div>
            </div>

            {/* pH */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300 font-medium">Soil pH</span>
                <span className="font-mono text-amber-300 font-bold">{readings.ph}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="8.5"
                step="0.1"
                value={readings.ph}
                aria-label="Soil pH"
                onChange={(e) => onOverride('ph', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
                <span>5.0 (Acidic)</span>
                <span>6.5 (Ideal Loam)</span>
                <span>8.5 (Alkaline)</span>
              </div>
            </div>

            {/* Rain Probability */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300 font-medium">Rain Probability</span>
                <span className="font-mono text-sky-400 font-bold">{readings.rain_probability}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={readings.rain_probability}
                aria-label="Rain Probability"
                onChange={(e) => onOverride('rain_probability', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Updates trigger autonomous LangGraph agent re-evaluation.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Apply & View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
