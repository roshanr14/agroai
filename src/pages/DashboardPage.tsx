import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  CloudRain, 
  Droplet, 
  Bug, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Sliders, 
  Activity, 
  RefreshCw,
  Bell,
  Clock,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { 
  Language, 
  FarmerProfile, 
  SensorReadings, 
  TodayAction, 
  StructuredRecommendation,
  SoilAnalysis,
  WeatherAnalysis,
  IrrigationAnalysis,
  PestAnalysis
} from '../types';
import { getTranslation } from '../lib/i18n';

interface Props {
  language: Language;
  profile: FarmerProfile;
  readings: SensorReadings;
  healthScore: number;
  actions: TodayAction[];
  recommendations: StructuredRecommendation[];
  soilAnalysis: SoilAnalysis;
  weatherAnalysis: WeatherAnalysis;
  irrigationAnalysis: IrrigationAnalysis;
  pestAnalysis: PestAnalysis;
  onOpenSimulator: () => void;
  onOpenAgentTrace: () => void;
  onRefresh: () => void;
}

export const DashboardPage: React.FC<Props> = ({
  language,
  profile,
  readings,
  healthScore,
  actions,
  recommendations,
  soilAnalysis,
  weatherAnalysis,
  irrigationAnalysis,
  pestAnalysis,
  onOpenSimulator,
  onOpenAgentTrace,
  onRefresh
}) => {
  const t = getTranslation(language);
  const [activeWhy, setActiveWhy] = React.useState<number | null>(null);

  const toggleWhy = (idx: number) => {
    setActiveWhy(activeWhy === idx ? null : idx);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-12">
      {/* Top Banner: Immediate Answer to "How is my farm today?" */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                {profile.farmName} • {profile.district}, {profile.state}
              </span>
              <span className="text-stone-400 text-xs hidden sm:inline">
                Sown: {profile.sowingDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-100 tracking-tight">
              {t.howIsMyFarm}
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Overall farm status is strong today. Recommended to postpone irrigation due to rain forecast and monitor nitrogen levels.
            </p>
          </div>

          {/* Farm Health Gauge Badge */}
          <div className="flex items-center gap-5 bg-stone-950/70 border border-stone-800 p-4 rounded-2xl">
            <div className="relative flex items-center justify-center">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-stone-800 border-t-emerald-500 border-r-emerald-500 flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
                  {healthScore}
                </span>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">/ 100</span>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold">{t.farmHealth}</div>
              <div className="text-base sm:text-lg font-bold text-stone-100">
                {healthScore >= 80 ? 'Healthy & Vibrant' : healthScore >= 60 ? 'Needs Attention' : 'Critical Action Required'}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Multi-agent consensus active</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Key Status Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6 mt-6 border-t border-stone-800/80">
          {/* Soil Status */}
          <Link
            to="/soil"
            className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-emerald-700/60 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>{t.soilStatus}</span>
              <Sprout className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-sm sm:text-base font-bold text-stone-100">
              {readings.nitrogen < 30 ? 'Low Nitrogen' : readings.nitrogen < 40 ? 'Watch Nitrogen' : 'Healthy'}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
              N: {readings.nitrogen} • pH {readings.ph}
            </div>
          </Link>

          {/* Weather Status */}
          <Link
            to="/weather"
            className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-sky-700/60 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>{t.weatherStatus}</span>
              <CloudRain className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-sm sm:text-base font-bold text-stone-100">
              {readings.rain_probability > 60 ? 'Rain Expected' : 'Partly Cloudy'}
            </div>
            <div className="text-[11px] text-sky-300 font-mono mt-0.5">
              {readings.rain_probability}% Rain • {readings.temperature}°C
            </div>
          </Link>

          {/* Crop Status */}
          <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>{t.cropStatus}</span>
              <span className="text-xs">🍅</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-stone-100">
              {profile.crop}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              {profile.cropStage}
            </div>
          </div>

          {/* Water Status */}
          <Link
            to="/irrigation"
            className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-cyan-700/60 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>{t.waterStatus}</span>
              <Droplet className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-sm sm:text-base font-bold text-stone-100">
              {readings.soil_moisture < 35 ? 'Irrigate Soon' : readings.rain_probability > 60 ? 'Hold Irrigation' : 'Moderate'}
            </div>
            <div className="text-[11px] text-cyan-300 font-mono mt-0.5">
              Moisture: {readings.soil_moisture}%
            </div>
          </Link>

          {/* Pest Risk */}
          <Link
            to="/pest"
            className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 hover:border-purple-700/60 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>{t.pestRiskStatus}</span>
              <Bug className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-sm sm:text-base font-bold text-stone-100">
              {readings.pest_risk} Risk
            </div>
            <div className="text-[11px] text-purple-300 font-mono mt-0.5">
              {readings.humidity}% Humidity
            </div>
          </Link>
        </div>
      </section>

      {/* Main Grid: Today's Actions (Left) + AI Recommendations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Actions (8 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  {t.todaysActions}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Ordered by agricultural urgency and weather windows
                </p>
              </div>

              <button
                onClick={onRefresh}
                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                title="Refresh agent evaluation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Actions List */}
            <div className="space-y-3.5">
              {actions.map((act) => (
                <div
                  key={act.step}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-600 transition-colors"
                >
                  <span className="w-9 h-9 rounded-xl bg-stone-900 text-stone-100 font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {act.step}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded ${
                        act.priority === 'High' ? 'bg-amber-100 text-amber-900' :
                        act.priority === 'Critical' ? 'bg-rose-100 text-rose-900' :
                        'bg-emerald-100 text-emerald-900'
                      }`}>
                        {act.tag || act.priority}
                      </span>
                      <span className="text-[11px] text-stone-500">{act.category}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-stone-900">
                      {act.title}
                    </h3>
                  </div>

                  <CheckCircle2 className="w-5 h-5 text-stone-300 hover:text-emerald-600 transition-colors cursor-pointer shrink-0 mt-1" />
                </div>
              ))}
            </div>

            {/* Quick Farm Advisor Link Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-800/80 rounded-xl text-emerald-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-100">
                    Have questions about your crop or soil?
                  </div>
                  <div className="text-[11px] text-stone-300">
                    Speak or type with your AI Farm Advisor in Tamil, Hindi, or English
                  </div>
                </div>
              </div>

              <Link
                to="/advisor"
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>Ask Advisor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Live Sensor Strip */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900">
                  {t.liveSensors}
                </h3>
              </div>
              <button
                onClick={onOpenSimulator}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust Parameters</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="text-[11px] text-stone-500">{t.nitrogen} (N)</div>
                <div className="text-base font-bold font-mono text-stone-900 mt-0.5">{readings.nitrogen} <span className="text-[10px] text-stone-500">mg/kg</span></div>
                <div className="text-[10px] text-amber-700 mt-0.5 font-medium">Marginal (Target 40-65)</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="text-[11px] text-stone-500">{t.phosphorus} (P)</div>
                <div className="text-base font-bold font-mono text-stone-900 mt-0.5">{readings.phosphorus} <span className="text-[10px] text-stone-500">mg/kg</span></div>
                <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">Optimal Level</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="text-[11px] text-stone-500">{t.potassium} (K)</div>
                <div className="text-base font-bold font-mono text-stone-900 mt-0.5">{readings.potassium} <span className="text-[10px] text-stone-500">mg/kg</span></div>
                <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">Good Retention</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="text-[11px] text-stone-500">{t.phLevel}</div>
                <div className="text-base font-bold font-mono text-stone-900 mt-0.5">{readings.ph}</div>
                <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">Neutral / Balanced</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Structured AI Recommendations (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  AI Decision Engine
                </h2>
                <p className="text-xs text-stone-500">
                  Synthesized via LangGraph & ICAR / TNAU RAG
                </p>
              </div>

              <button
                onClick={onOpenAgentTrace}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono rounded-lg transition-colors cursor-pointer"
                title="View agent execution graph"
              >
                Inspect Graph
              </button>
            </div>

            {/* Structured Recommendations Cards */}
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                      {rec.category} Recommendation
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-600">
                      AI Confidence: <strong className="text-emerald-700">{rec.confidence}%</strong>
                    </span>
                  </div>

                  {/* WHAT */}
                  <div>
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                      {t.whatHappening}
                    </div>
                    <div className="text-xs font-semibold text-stone-900 mt-0.5">
                      {rec.what}
                    </div>
                  </div>

                  {/* WHY */}
                  <div>
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                      {t.whyHappening}
                    </div>
                    <div className="text-xs text-stone-700 mt-0.5 leading-relaxed">
                      {rec.why}
                    </div>
                  </div>

                  {/* ACTION */}
                  <div>
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                      {t.whatToDo}
                    </div>
                    <div className="text-xs font-medium text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/80 mt-0.5">
                      {rec.action}
                    </div>
                  </div>

                  {/* WHEN */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t.whenToDo}: <strong>{rec.when}</strong></span>
                    </div>
                  </div>

                  {/* Transparency: Why am I seeing this? */}
                  <div className="pt-2 border-t border-stone-200">
                    <button
                      onClick={() => toggleWhy(idx)}
                      className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>{t.whySeeingThis}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${activeWhy === idx ? 'rotate-180' : ''}`} />
                    </button>

                    {activeWhy === idx && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white border border-stone-200 text-[11px] text-stone-600 space-y-1 animate-in fade-in duration-150">
                        <div className="font-semibold text-stone-800">Based on multi-source agricultural inputs:</div>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {rec.why_seeing_this.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        {rec.expected_benefit && (
                          <div className="text-emerald-800 pt-1 font-medium">
                            Expected benefit: {rec.expected_benefit}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Officer advice disclaimer */}
            <div className="text-[11px] text-stone-500 bg-stone-100 p-3 rounded-xl border border-stone-200 leading-relaxed">
              <span className="font-bold text-stone-700">Official Advisory Notice:</span> AgriSense AI provides decision support based on ICAR guidelines. Always contact your local Block Agricultural Extension Officer or KVK for prescription chemicals.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
