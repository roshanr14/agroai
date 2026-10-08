import React, { useState } from 'react';
import { 
  Sprout, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Cpu, 
  Sliders, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Info,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Language, SensorReadings, SoilAnalysis, FarmerProfile } from '../types';
import { getTranslation } from '../lib/i18n';

interface Props {
  language: Language;
  readings: SensorReadings;
  analysis: SoilAnalysis;
  profile: FarmerProfile;
  onOpenSimulator: () => void;
}

export const SoilPage: React.FC<Props> = ({
  language,
  readings,
  analysis,
  profile,
  onOpenSimulator
}) => {
  const t = getTranslation(language);
  const [selectedModel, setSelectedModel] = useState(analysis.model_used);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Realistic historical data calibrated for Solanaceous tomato crop
  const historyData7d = [
    { day: "Day -6", n: 46, p: 26, k: 34, moist: 52, ph: 6.6 },
    { day: "Day -5", n: 44, p: 25, k: 33, moist: 50, ph: 6.6 },
    { day: "Day -4", n: 42, p: 25, k: 33, moist: 47, ph: 6.5 },
    { day: "Day -3", n: 41, p: 24, k: 32, moist: 45, ph: 6.5 },
    { day: "Day -2", n: 40, p: 24, k: 32, moist: 43, ph: 6.5 },
    { day: "Yesterday", n: 39, p: 24, k: 31, moist: 42, ph: 6.5 },
    { day: "Today", n: readings.nitrogen, p: readings.phosphorus, k: readings.potassium, moist: readings.soil_moisture, ph: readings.ph }
  ];

  const modelDescriptions: Record<string, { desc: string; latency: string; confidence: number }> = {
    "Random Forest Regressor v2.4": {
      desc: "Ensemble of 120 decision trees calibrated on ICAR National Soil Health Database.",
      latency: "18ms",
      confidence: 89.4
    },
    "XGBoost Classifier v1.8": {
      desc: "Gradient-boosted trees with leaf-wise histogram regularization.",
      latency: "12ms",
      confidence: 93.1
    },
    "Deep SoilNet (MLP-ResNet)": {
      desc: "3-layer Multi-Layer Perceptron with Swish activation and batch normalization.",
      latency: "35ms",
      confidence: 91.8
    }
  };

  const currentModelMeta = modelDescriptions[selectedModel] || modelDescriptions["Random Forest Regressor v2.4"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Sprout className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono text-emerald-800 font-bold tracking-wider">
              SOIL INTELLIGENCE AGENT (AGENT 01)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.soilIntelligence}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Continuous NPK, moisture, and pH diagnostics calibrated for {profile.crop} ({profile.soilType} Soil)
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simulate Sensor Changes</span>
        </button>
      </div>

      {/* Top Metric Cards: Soil Health Score + Key Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Soil Health Score (4 cols) */}
        <div className="md:col-span-4 bg-gradient-to-br from-stone-900 to-emerald-950 text-white rounded-3xl p-6 border border-emerald-900/60 shadow-md flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-400 font-mono font-bold">
              {t.healthScore}
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-mono font-bold text-emerald-400">
                {readings.soil_health_score}
              </span>
              <span className="text-lg text-stone-400 font-semibold">/ 100</span>
            </div>
            <div className="text-xs text-stone-300 mt-2 leading-relaxed">
              Calculated from composite macro-nutrient availability, moisture buffer, and pH neutrality.
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-stone-300">
              <span>Nitrogen Status</span>
              <strong className={readings.nitrogen < 40 ? 'text-amber-400' : 'text-emerald-400'}>
                {readings.nitrogen < 30 ? 'Critical Low' : readings.nitrogen < 40 ? 'Marginal Low' : 'Optimal'}
              </strong>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Soil Acidity (pH)</span>
              <strong className="text-emerald-400">Balanced (6.5)</strong>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Root Zone Moisture</span>
              <strong className="text-sky-400">{readings.soil_moisture}%</strong>
            </div>
          </div>
        </div>

        {/* NPK Visual Indicator Meters (8 cols) */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base">Primary Macronutrient Levels</h3>
            <span className="text-xs text-stone-500 font-mono">Benchmark: Loamy Solanaceous Soil</span>
          </div>

          {/* Nitrogen Gauge */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900">{t.nitrogen} (N)</span>
                <span className="text-[10px] text-stone-500">Vegetative leaf expansion</span>
              </div>
              <span className="font-mono font-bold text-stone-900">
                {readings.nitrogen} mg/kg <span className="text-amber-700 font-semibold">(Marginal Low)</span>
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 relative overflow-hidden flex">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (readings.nitrogen / 70) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>0 (Deficient)</span>
              <span className="font-bold text-emerald-800">40 - 65 mg/kg (Optimal Target)</span>
              <span>80+ (Toxic)</span>
            </div>
          </div>

          {/* Phosphorus Gauge */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900">{t.phosphorus} (P)</span>
                <span className="text-[10px] text-stone-500">Root & blossom initiation</span>
              </div>
              <span className="font-mono font-bold text-stone-900">
                {readings.phosphorus} mg/kg <span className="text-emerald-700 font-semibold">(Optimal)</span>
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 relative overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (readings.phosphorus / 45) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>0 (Deficient)</span>
              <span className="font-bold text-emerald-800">22 - 40 mg/kg (Optimal Target)</span>
              <span>50+</span>
            </div>
          </div>

          {/* Potassium Gauge */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900">{t.potassium} (K)</span>
                <span className="text-[10px] text-stone-500">Stomatal control & fruit firmness</span>
              </div>
              <span className="font-mono font-bold text-stone-900">
                {readings.potassium} mg/kg <span className="text-emerald-700 font-semibold">(Good)</span>
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 relative overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (readings.potassium / 50) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>0 (Deficient)</span>
              <span className="font-bold text-emerald-800">30 - 55 mg/kg (Optimal Target)</span>
              <span>60+</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Nutrient Trajectory Prediction Card */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-base">
                AI Early-Warning: Nitrogen Deficiency Risk in 5–7 Days
              </h3>
              <p className="text-xs text-amber-800">
                Projected plant uptake in vegetative tomato stage exceeds current natural replenishment.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-200/70 text-amber-900 rounded-lg">
            Medium Risk
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-200/60">
            <div className="text-[11px] text-stone-500">Current Level</div>
            <div className="text-lg font-bold font-mono text-stone-900 mt-0.5">{readings.nitrogen} mg/kg</div>
            <div className="text-[10px] text-stone-500">Marginal buffer</div>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-200/60">
            <div className="text-[11px] text-stone-500">Predicted in 6 Days</div>
            <div className="text-lg font-bold font-mono text-amber-900 mt-0.5">31.4 mg/kg</div>
            <div className="text-[10px] text-amber-700">Approaching 30 mg/kg chlorosis trigger</div>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-200/60">
            <div className="text-[11px] text-stone-500">Action Window</div>
            <div className="text-lg font-bold text-emerald-800 mt-0.5">Within 48–72h</div>
            <div className="text-[10px] text-stone-600">Organic vermicompost or light fertigation</div>
          </div>
        </div>
      </div>

      {/* Historical Trend Charts */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Macronutrient & Moisture Trends</h3>
            <p className="text-xs text-stone-500 mt-0.5">Historical daily readings over past cycles</p>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${timeRange === '7d' ? 'bg-white text-stone-900 shadow-sm font-bold' : 'text-stone-600'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${timeRange === '30d' ? 'bg-white text-stone-900 shadow-sm font-bold' : 'text-stone-600'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${timeRange === '90d' ? 'bg-white text-stone-900 shadow-sm font-bold' : 'text-stone-600'}`}
            >
              90 Days
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData7d} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" fontSize={11} domain={[10, 60]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: '1px solid #444', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="n" stroke="#f59e0b" name="Nitrogen (mg/kg)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="p" stroke="#10b981" name="Phosphorus (mg/kg)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="k" stroke="#8b5cf6" name="Potassium (mg/kg)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="moist" stroke="#0ea5e9" name="Moisture (%)" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Switcher & Technical Admin Architecture View */}
      <div className="bg-stone-900 text-stone-200 rounded-3xl p-6 sm:p-7 border border-stone-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-stone-100 text-sm sm:text-base">
                AI Model Engine Architecture
              </h3>
              <p className="text-xs text-stone-400">
                Switch inference runtime for soil nutrient regression and confidence evaluation
              </p>
            </div>
          </div>

          {/* Model Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800 text-xs">
            <span className="text-stone-400 font-mono">Engine:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              aria-label="AI Model Engine"
              className="bg-transparent text-emerald-400 font-mono font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Random Forest Regressor v2.4" className="bg-stone-900 text-white">Random Forest Regressor v2.4</option>
              <option value="XGBoost Classifier v1.8" className="bg-stone-900 text-white">XGBoost Classifier v1.8</option>
              <option value="Deep SoilNet (MLP-ResNet)" className="bg-stone-900 text-white">Deep SoilNet (MLP-ResNet)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 text-xs">
          <div>
            <div className="text-stone-400">Architecture Details</div>
            <div className="text-stone-200 font-medium mt-1">{currentModelMeta.desc}</div>
          </div>
          <div>
            <div className="text-stone-400">Prediction Confidence</div>
            <div className="text-emerald-400 font-mono font-bold text-base mt-1">
              {currentModelMeta.confidence}%
            </div>
          </div>
          <div>
            <div className="text-stone-400">Inference Latency</div>
            <div className="text-stone-200 font-mono mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{currentModelMeta.latency} on Edge CPU</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
