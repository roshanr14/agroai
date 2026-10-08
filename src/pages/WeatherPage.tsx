import React from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Cpu, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Language, SensorReadings, WeatherAnalysis, FarmerProfile } from '../types';
import { getTranslation } from '../lib/i18n';

interface Props {
  language: Language;
  readings: SensorReadings;
  analysis: WeatherAnalysis;
  profile: FarmerProfile;
  onOpenSimulator: () => void;
}

export const WeatherPage: React.FC<Props> = ({
  language,
  readings,
  analysis,
  profile,
  onOpenSimulator
}) => {
  const t = getTranslation(language);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
              <CloudRain className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono text-sky-800 font-bold tracking-wider">
              WEATHER INTELLIGENCE AGENT (AGENT 02)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.weatherIntelligence}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Microclimate forecasting & agricultural risk evaluation for {profile.district}, {profile.state}
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <CloudRain className="w-3.5 h-3.5 text-sky-400" />
          <span>Simulate Rain / Heatwave</span>
        </button>
      </div>

      {/* Prominent AI Weather Insight Alert */}
      <div className="bg-gradient-to-r from-sky-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 border border-sky-800/80 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-300 rounded-xl border border-sky-500/40">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-300 font-bold">
                AI Agricultural Weather Insight
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-stone-100 mt-0.5">
                {readings.rain_probability > 60
                  ? 'Rain expected within 24 hours (72% probability)'
                  : 'Stable Weather Window Forecasted'}
              </h2>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 bg-sky-950/80 border border-sky-700 text-sky-300 rounded-xl">
            TFT Model (92.5% Conf.)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-950/60 border border-sky-900/60 text-xs sm:text-sm text-stone-200 leading-relaxed">
          <strong className="text-sky-300">Action Recommendation:</strong> Postpone scheduled drip irrigation for today. Natural rainfall will meet root-zone requirements without wasting groundwater or electricity. Delay foliar chemical spraying until leaves are dry for at least 6 consecutive hours.
        </div>

        {/* Risk Indicators Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-stone-950/40 p-3 rounded-xl border border-sky-900/40">
            <div className="text-[11px] text-stone-400">Precipitation Risk</div>
            <div className="text-sm font-bold text-sky-300 font-mono mt-0.5">72% (Elevated)</div>
          </div>
          <div className="bg-stone-950/40 p-3 rounded-xl border border-sky-900/40">
            <div className="text-[11px] text-stone-400">Heat Stress Risk</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">Moderate (31°C)</div>
          </div>
          <div className="bg-stone-950/40 p-3 rounded-xl border border-sky-900/40">
            <div className="text-[11px] text-stone-400">Wind Washout Risk</div>
            <div className="text-sm font-bold text-stone-200 font-mono mt-0.5">12 km/h (Low)</div>
          </div>
          <div className="bg-stone-950/40 p-3 rounded-xl border border-sky-900/40">
            <div className="text-[11px] text-stone-400">Foliar Fungal Risk</div>
            <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">Medium (68% RH)</div>
          </div>
        </div>
      </div>

      {/* Current Conditions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs">Ambient Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {readings.temperature}°C
          </div>
          <div className="text-[10px] text-stone-500">Soil Temp: {readings.soil_temperature}°C</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs">Relative Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {readings.humidity}%
          </div>
          <div className="text-[10px] text-stone-500">Optimal Canopy: 55-75%</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs">Rain Probability</span>
            <CloudRain className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-700">
            {readings.rain_probability}%
          </div>
          <div className="text-[10px] text-sky-800 font-medium">Scattered showers likely</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs">Wind Speed</span>
            <Wind className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {readings.wind_speed} <span className="text-xs font-normal">km/h</span>
          </div>
          <div className="text-[10px] text-stone-500">Direction: South-West</div>
        </div>
      </div>

      {/* 24-Hour Timeline Forecast */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Next 12–24 Hours Micro-Forecast</h3>
            <p className="text-xs text-stone-500 mt-0.5">Hour-by-hour temperature and rain probability</p>
          </div>
          <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
            Updated Hourly
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {(analysis.hourly_forecast || []).slice(0, 6).map((hf, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl text-center space-y-2 border transition-colors ${
                hf.rain_prob > 60
                  ? 'bg-sky-50/70 border-sky-200 text-sky-900'
                  : 'bg-stone-50 border-stone-200/80 text-stone-900'
              }`}
            >
              <div className="text-xs font-mono font-semibold text-stone-500">{hf.time}</div>
              <div className="flex justify-center text-sky-600">
                {hf.rain_prob > 60 ? <CloudRain className="w-6 h-6" /> : <Sun className="w-6 h-6 text-amber-500" />}
              </div>
              <div className="text-base font-bold font-mono">{hf.temp_c}°C</div>
              <div className="text-[10px] font-mono font-medium text-sky-700 bg-sky-100/80 py-0.5 rounded">
                {hf.rain_prob}% Rain
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Day-by-Day Forecast */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
        <h3 className="font-bold text-stone-900 text-base">7-Day Agricultural Outlook</h3>

        <div className="divide-y divide-stone-100">
          {(analysis.daily_forecast || []).map((df, idx) => (
            <div
              key={idx}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 w-32">
                <span className="font-bold text-stone-900 text-sm">{df.day}</span>
                <span className="text-stone-500">{df.condition}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-stone-900 font-semibold">High: {df.high}°C</span>
                <span className="font-mono text-stone-500">Low: {df.low}°C</span>
                <span className="font-mono text-sky-700 font-semibold">{df.rain_prob}% Rain</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-500">Irrigation:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] ${
                  df.irrigation_advice === 'Hold'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {df.irrigation_advice}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extensible API Architecture Notice */}
      <div className="p-4 rounded-2xl bg-stone-900 text-stone-300 border border-stone-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Connected to Simulated IMD / ECMWF Meteorological API Bridge.</span>
        </div>
        <span className="text-[11px] font-mono text-stone-400 hidden sm:inline">
          Ready for real Open-Meteo / IMD API key
        </span>
      </div>
    </div>
  );
};
