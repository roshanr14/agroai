import React from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Thermometer, 
  Sliders
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
            <span className="p-1.5 rounded-lg bg-[#eaf7ef] text-[#279e5a]">
              <CloudRain className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono text-[#279e5a] font-bold tracking-wider">
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
          className="px-5 py-2.5 rounded-full bg-[#191c21] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-[#34c775]" />
          <span>Simulate Weather Shift</span>
        </button>
      </div>

      {/* Prominent Greenery Weather Insight Banner */}
      <div className="bg-[#279e5a] text-white rounded-[32px] p-7 sm:p-8 shadow-[0_20px_48px_-12px_rgba(39,158,90,0.35)] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl">
              <CloudRain className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/80 font-bold">
                AI Agricultural Weather Insight
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                {readings.rain_probability > 60
                  ? 'Rain expected within 24 hours (72% probability)'
                  : 'Stable Weather Window Forecasted'}
              </h2>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3.5 py-1 bg-white/20 text-white rounded-full backdrop-blur-md">
            TFT Model (92.5% Conf.)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-white leading-relaxed">
          <strong className="text-white">Action Recommendation:</strong> Postpone scheduled drip irrigation for today. Natural rainfall will meet root-zone requirements without wasting groundwater or electricity. Delay foliar chemical spraying until leaves are dry for at least 6 consecutive hours.
        </div>

        {/* Risk Indicators Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/18 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="text-[11px] text-white/80">Precipitation Risk</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">72% (Elevated)</div>
          </div>
          <div className="bg-white/18 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="text-[11px] text-white/80">Heat Stress Risk</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">Moderate (31°C)</div>
          </div>
          <div className="bg-white/18 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="text-[11px] text-white/80">Wind Washout Risk</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">12 km/h (Low)</div>
          </div>
          <div className="bg-white/18 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="text-[11px] text-white/80">Foliar Fungal Risk</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">Medium (68% RH)</div>
          </div>
        </div>
      </div>

      {/* Current Conditions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-[28px] bg-white border border-stone-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.05)] space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs">Ambient Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {readings.temperature}°C
          </div>
          <div className="text-[10px] text-stone-500">Soil Temp: {readings.soil_temperature}°C</div>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-stone-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.05)] space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs">Relative Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {readings.humidity}%
          </div>
          <div className="text-[10px] text-stone-500">Optimal Canopy: 55-75%</div>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-stone-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.05)] space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs">Rain Probability</span>
            <CloudRain className="w-4 h-4 text-[#279e5a]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#279e5a]">
            {readings.rain_probability}%
          </div>
          <div className="text-[10px] text-stone-500 font-medium">Scattered showers likely</div>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-stone-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.05)] space-y-1">
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
      <div className="bg-white rounded-[32px] border border-stone-200/80 p-7 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.07)] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Next 12–24 Hours Micro-Forecast</h3>
            <p className="text-xs text-stone-500 mt-0.5">Hour-by-hour temperature and rain probability</p>
          </div>
          <span className="text-xs font-mono text-[#279e5a] bg-[#eaf7ef] px-3 py-1 rounded-full font-semibold">
            Updated Hourly
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {(analysis.hourly_forecast || []).slice(0, 6).map((hf, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl text-center space-y-2 border transition-colors ${
                hf.rain_prob > 60
                  ? 'bg-[#eaf7ef] border-[#c1e8cd] text-[#166436]'
                  : 'bg-stone-50 border-stone-200/80 text-stone-900'
              }`}
            >
              <div className="text-xs font-mono font-semibold text-stone-500">{hf.time}</div>
              <div className="flex justify-center">
                {hf.rain_prob > 60 ? <CloudRain className="w-6 h-6 text-[#279e5a]" /> : <Sun className="w-6 h-6 text-amber-500" />}
              </div>
              <div className="text-base font-bold font-mono">{hf.temp_c}°C</div>
              <div className="text-[10px] font-mono font-bold text-[#279e5a] bg-white py-0.5 px-2 rounded-full border border-[#c1e8cd]">
                {hf.rain_prob}% Rain
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Day-by-Day Forecast */}
      <div className="bg-white rounded-[32px] border border-stone-200/80 p-7 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.07)] space-y-5">
        <h3 className="font-bold text-stone-900 text-base">7-Day Agricultural Outlook</h3>

        <div className="divide-y divide-stone-100">
          {(analysis.daily_forecast || []).map((df, idx) => (
            <div
              key={idx}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 w-36">
                <span className="font-bold text-stone-900 text-sm">{df.day}</span>
                <span className="text-stone-500">{df.condition}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-stone-900 font-semibold">High: {df.high}°C</span>
                <span className="font-mono text-stone-500">Low: {df.low}°C</span>
                <span className="font-mono text-[#279e5a] font-bold">{df.rain_prob}% Rain</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-500">Irrigation:</span>
                <span className={`px-3 py-1 rounded-full font-bold font-mono text-[11px] ${
                  df.irrigation_advice === 'Hold'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-[#eaf7ef] text-[#279e5a]'
                }`}>
                  {df.irrigation_advice}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
