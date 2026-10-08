import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  CloudRain, 
  Droplet, 
  Bug, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Sliders, 
  RefreshCw,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Compass,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24 md:pb-16">
      {/* 3-Panel Greenery Showcase Grid (Directly mirroring the 3-screen reference design) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
        
        {/* PANEL 1 (Screen 1 style - Left): White Card with Plant Header + Curved Green Bottom */}
        <div className="lg:col-span-4 bg-white rounded-[32px] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.07)] border border-stone-200/70 overflow-hidden flex flex-col justify-between">
          <div className="p-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-mono text-stone-400">← {profile.district}, {profile.state}</span>
              <span className="px-3 py-1 rounded-full bg-[#eaf7ef] text-[#279e5a] font-bold text-[11px]">
                {profile.cropStage}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                {profile.crop} Crop
              </h2>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {profile.cropVariety} • {profile.farmAcres} Acres • {profile.soilType} Soil
              </p>
              <div className="text-2xl font-bold font-mono text-[#279e5a] mt-2">
                Health {healthScore} <span className="text-sm font-sans font-normal text-stone-400">/ 100</span>
              </div>
            </div>

            {/* Plant Focal Visual */}
            <div className="py-4 relative flex items-center justify-center">
              <div className="w-36 h-36 rounded-full bg-[#eaf7ef] flex items-center justify-center text-7xl shadow-inner animate-in zoom-in-95 duration-300">
                🌿
              </div>
              {/* Circular Action Button overlapping boundary (from Screen 1) */}
              <button
                onClick={onRefresh}
                className="absolute right-4 bottom-0 w-12 h-12 rounded-full bg-[#279e5a] hover:bg-[#1f8249] text-white flex items-center justify-center shadow-lg shadow-[#279e5a]/40 transition-transform hover:scale-105 cursor-pointer"
                title="Refresh Readings"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Curved Green Bottom Container (Exact element from Screen 1) */}
          <div className="bg-[#279e5a] text-white p-6 pt-5 rounded-t-[32px] space-y-3">
            <div className="text-xs font-semibold text-white/90 tracking-wide">
              Planting & Real-Time Sensors
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Pill Card 1: Soil Moisture */}
              <div className="bg-white/18 backdrop-blur-md rounded-2xl p-3.5 space-y-0.5 border border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-white">{readings.soil_moisture}</span>
                  <span className="text-xs text-white/80 font-medium">%</span>
                </div>
                <div className="text-[11px] text-white/80 font-medium">Moisture</div>
              </div>

              {/* Pill Card 2: Temperature */}
              <div className="bg-white/18 backdrop-blur-md rounded-2xl p-3.5 space-y-0.5 border border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-white">{readings.temperature}</span>
                  <span className="text-xs text-white/80 font-medium">℃</span>
                </div>
                <div className="text-[11px] text-white/80 font-medium">Sunshine & Heat</div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2 (Screen 2 style - Center): Full Lush Green Card with Specs & Dark Contrast CTA */}
        <div className="lg:col-span-4 bg-[#279e5a] rounded-[32px] shadow-[0_20px_48px_-12px_rgba(39,158,90,0.35)] text-white p-7 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            {/* Header: Logo + Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-white" />
                <span className="text-xs font-bold tracking-wider uppercase text-white font-mono">
                  AGROAI Intelligence
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                Live State
              </span>
            </div>

            <div>
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                Farm Overview
              </h2>
              <p className="text-xs text-white/80 mt-1">
                Multi-agent telemetry analyzed every 15 minutes
              </p>
            </div>

            {/* Specs List with Outline Icons (matching Screen 2) */}
            <div className="space-y-3.5 text-xs text-white/90 pt-1">
              <div className="flex items-center justify-between py-1 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <Droplet className="w-4 h-4 text-white" />
                  <span className="font-medium">Water Status</span>
                </div>
                <span className="font-semibold text-white">
                  {readings.soil_moisture < 35 ? 'Urgent Irrigation' : readings.rain_probability > 60 ? 'Hold (Rain coming)' : 'Optimal buffer'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <CloudRain className="w-4 h-4 text-white" />
                  <span className="font-medium">Humidity</span>
                </div>
                <span className="font-semibold text-white font-mono">{readings.humidity}% RH</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <Sprout className="w-4 h-4 text-white" />
                  <span className="font-medium">Available N</span>
                </div>
                <span className="font-semibold text-white font-mono">{readings.nitrogen} mg/kg (Watch)</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <Bug className="w-4 h-4 text-white" />
                  <span className="font-medium">Pest Risk</span>
                </div>
                <span className="font-semibold text-white">{readings.pest_risk} Risk</span>
              </div>
            </div>

            {/* Expandable Action Pills (matching Screen 2's "+ Delivery Information", "+ Return Policy") */}
            <div className="space-y-2.5 pt-2">
              {actions.map((act) => (
                <div
                  key={act.step}
                  className="greenery-pill-btn p-3 px-4 flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Plus className="w-4 h-4 text-white shrink-0 group-hover:rotate-90 transition-transform" />
                    <span className="font-semibold truncate">{act.title}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    {act.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* High-Contrast Bottom-Right CTA Button (exact style from Screen 2's "add to cart"!) */}
          <div className="pt-6 flex justify-end">
            <Link
              to="/advisor"
              className="bg-[#191c21] hover:bg-black text-white text-xs font-bold px-6 py-3.5 rounded-2xl sm:rounded-tl-2xl sm:rounded-tr-md sm:rounded-br-2xl sm:rounded-bl-2xl flex items-center gap-2.5 shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#34c775]" />
              <span>Ask Farm Advisor</span>
            </Link>
          </div>
        </div>

        {/* PANEL 3 (Screen 3 style - Right): White Card with "Details" Solid Green Pill + AI Insights */}
        <div className="lg:col-span-4 bg-white rounded-[32px] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.07)] border border-stone-200/70 p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header with "Details" Green Pill Button (from Screen 3) */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-400">← Back</span>
              <button
                onClick={onOpenAgentTrace}
                className="px-5 py-2 rounded-full bg-[#279e5a] hover:bg-[#1f8249] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Agent Trace
              </button>
            </div>

            {/* Plant Details Section (from Screen 3) */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#eaf7ef] flex items-center justify-center text-2xl">
                  🍃
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-lg">Crop Details</h3>
                  <div className="text-[11px] text-stone-500">{profile.cropVariety} ({profile.soilType} Loam)</div>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed pt-1">
                The vegetative stage requires balanced nitrogen for leaf canopy expansion and regular soil moisture between 45% and 60% for healthy root aeration.
              </p>
            </div>

            {/* Soil & Root Details Section (from Screen 3) */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#f5efe6] flex items-center justify-center text-2xl">
                  🏺
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-lg">Soil & Bed Details</h3>
                  <div className="text-[11px] text-stone-500">pH {readings.ph} Neutral • Loamy Structure</div>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed pt-1">
                Have well-drained raised beds with in-line drip emitters. Soil retains adequate moisture buffer for 24h allowing rainfall capture.
              </p>
            </div>
          </div>

          {/* Bottom High-Contrast Quick Action */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">GSM SMS Alert: <strong className="text-stone-800">Active</strong></span>
            <Link
              to="/soil"
              className="text-xs font-bold text-[#279e5a] hover:text-[#1f8249] flex items-center gap-1 cursor-pointer"
            >
              <span>Full Soil Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Structured AI Recommendations Section with High-Contrast Action Buttons */}
      <section className="bg-white rounded-[32px] p-7 sm:p-9 border border-stone-200/80 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.07)] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#279e5a]"></span>
              <span className="text-xs uppercase font-mono tracking-widest text-[#279e5a] font-bold">
                LANGGRAPH MULTI-AGENT ADVISORY
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Personalized Field Actions Today
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Grounded in ICAR & TNAU agronomic standards • Zero hallucinations
            </p>
          </div>

          {/* High-Contrast CTA Button */}
          <button
            onClick={onOpenSimulator}
            className="px-5 py-2.5 rounded-full bg-[#191c21] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#34c775]" />
            <span>Simulate Environmental Shift</span>
          </button>
        </div>

        {/* Recommendations Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-[#f8faf9] border border-stone-200/90 rounded-[28px] p-6 space-y-4 shadow-xs hover:border-[#279e5a]/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#166436] bg-[#eaf7ef] px-3 py-1 rounded-full">
                  {rec.category} Recommendation
                </span>
                <span className="text-xs font-mono font-bold text-stone-600">
                  AI Confidence: <strong className="text-[#279e5a] font-bold">{rec.confidence}%</strong>
                </span>
              </div>

              {/* WHAT */}
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                  {t.whatHappening}
                </div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">
                  {rec.what}
                </div>
              </div>

              {/* WHY */}
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                  {t.whyHappening}
                </div>
                <div className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  {rec.why}
                </div>
              </div>

              {/* ACTION */}
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">
                  {t.whatToDo}
                </div>
                <div className="text-xs font-semibold text-[#166436] bg-[#eaf7ef] p-3 rounded-2xl border border-[#c1e8cd] mt-0.5">
                  {rec.action}
                </div>
              </div>

              {/* WHEN & CTA BUTTON */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{t.whenToDo}: <strong>{rec.when}</strong></span>
                </div>

                {/* High Contrast CTA */}
                <Link
                  to={rec.category === 'Soil' ? '/soil' : rec.category === 'Irrigation' ? '/irrigation' : '/pest'}
                  className="px-4 py-2 rounded-full bg-[#191c21] hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Apply Action</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#34c775]" />
                </Link>
              </div>

              {/* Transparency Toggle */}
              <div>
                <button
                  onClick={() => toggleWhy(idx)}
                  className="text-[11px] font-semibold text-[#279e5a] hover:text-[#1f8249] flex items-center gap-1 cursor-pointer pt-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t.whySeeingThis}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeWhy === idx ? 'rotate-180' : ''}`} />
                </button>

                {activeWhy === idx && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-white border border-stone-200 text-xs text-stone-600 space-y-1 animate-in fade-in duration-150">
                    <div className="font-semibold text-stone-800">Telemetry evidence:</div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      {rec.why_seeing_this.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    {rec.expected_benefit && (
                      <div className="text-[#279e5a] pt-1 font-semibold text-[11px]">
                        Benefit: {rec.expected_benefit}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
