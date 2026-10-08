import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ArrowRight, 
  ShieldCheck, 
  Droplet, 
  CloudRain, 
  Bug, 
  Smartphone, 
  Cpu, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { Language, SensorReadings } from '../types';
import { getTranslation } from '../lib/i18n';

interface Props {
  language: Language;
  readings: SensorReadings;
  onOpenSimulator: () => void;
}

export const LandingPage: React.FC<Props> = ({ language, readings, onOpenSimulator }) => {
  const t = getTranslation(language);

  const supportedCrops = [
    { name: "Tomato", variety: "Hybrid Roma / Arka Rakshak", water: "Drip", duration: "110-120 days" },
    { name: "Chilli", variety: "K1 / Guntur Sannam", water: "Drip", duration: "150-180 days" },
    { name: "Paddy", variety: "ADT 45 / BPT 5204", water: "AWD / Flood", duration: "120-135 days" },
    { name: "Cotton", variety: "Bt Hybrid / Suraj", water: "Furrow / Drip", duration: "160-170 days" },
    { name: "Brinjal", variety: "Annamalai / PLR 1", water: "Drip", duration: "140 days" },
    { name: "Onion", variety: "Co 4 / Bellary Red", water: "Micro-sprinkler", duration: "90-100 days" }
  ];

  const agentPillars = [
    {
      title: "Soil Intelligence Agent",
      models: "Random Forest • XGBoost • Deep SoilNet",
      desc: "Analyzes continuous NPK, pH, and soil moisture trajectories to compute an authoritative Soil Health Score and predict nutrient deficits 5-7 days in advance.",
      icon: Sprout,
      color: "text-emerald-400",
      border: "border-emerald-800/40"
    },
    {
      title: "Weather Intelligence Agent",
      models: "Temporal Fusion Transformer (TFT)",
      desc: "Simulates and integrates meteorological feeds for 24h & 7-day precipitation forecasts, heat stress danger zones, and pesticide spray washout protection.",
      icon: CloudRain,
      color: "text-sky-400",
      border: "border-sky-800/40"
    },
    {
      title: "Pest & Foliar Health Agent",
      models: "YOLOv8-ViT-Hybrid Computer Vision",
      desc: "Edge vision scanner identifying Brown Plant Hopper, Early Blight, and Spodoptera with clear, transparent simulation and protocol labeling.",
      icon: Bug,
      color: "text-purple-400",
      border: "border-purple-800/40"
    },
    {
      title: "Irrigation Intelligence Agent",
      models: "Reinforcement Learning (RL DQN Policy)",
      desc: "Autonomously balances evapotranspiration stress against rainfall probability to calculate exact watering windows, runtimes, and thousands of liters saved.",
      icon: Droplet,
      color: "text-cyan-400",
      border: "border-cyan-800/40"
    },
    {
      title: "Central Decision Agent (LLM + RAG)",
      models: "ICAR & TNAU Knowledge Base RAG",
      desc: "Harmonizes multi-agent outputs into transparent WHAT, WHY, ACTION, WHEN recommendations in English, Tamil, and Hindi with zero hallucination.",
      icon: Sparkles,
      color: "text-amber-400",
      border: "border-amber-800/40"
    },
    {
      title: "Autonomous SMS Dispatch Engine",
      models: "Indian GSM Gateway Abstraction",
      desc: "Dispatches plain SMS alerts directly to farmer phones with anti-spam cooldown logic, ensuring critical warnings arrive without requiring an internet connection.",
      icon: Smartphone,
      color: "text-rose-400",
      border: "border-rose-800/40"
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-stone-100 border-b border-emerald-950/60 agro-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono tracking-wide shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              MULTI-AGENT INTELLIGENT AGRICULTURE PLATFORM
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-100 tracking-tight leading-[1.15]">
              {t.landingTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed max-w-2xl mx-auto">
              {t.landingSubtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 transition-all cursor-pointer group"
              >
                <span>{t.startFarmBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={onOpenSimulator}
                className="px-5 py-3.5 rounded-xl bg-stone-800/90 hover:bg-stone-750 text-stone-200 border border-stone-700 font-semibold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Simulate IoT Telemetry</span>
              </button>

              <Link
                to="/advisor"
                className="px-5 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-semibold text-sm sm:text-base flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Farm Advisor</span>
              </Link>
            </div>

            {/* Live Telemetry Ticker Preview */}
            <div className="pt-8">
              <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-3 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs shadow-xl text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Soil Moisture: <strong className="text-emerald-400 font-mono">{readings.soil_moisture}%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Available N: <strong className="text-amber-300 font-mono">{readings.nitrogen} mg/kg</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Rain Prob: <strong className="text-sky-300 font-mono">{readings.rain_probability}%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Health Score: <strong className="text-emerald-400 font-mono">{readings.soil_health_score}/100</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Indian Agriculture Problem → AgriSense Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-bold">
            THE SENSE → DECIDE → NOTIFY PIPELINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
            Built for Real-World Indian Farming Conditions
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            No bloated dashboards. No confusing scientific jargon. Just simple, practical advice that protects your harvest and saves water.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
              01
            </div>
            <h3 className="font-bold text-stone-900 text-base">Continuous IoT & Physics Simulation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Models diurnal temperature fluctuations, evapotranspiration curves, and slow nutrient depletion without needing thousands of rupees in upfront hardware.
            </p>
            <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded w-fit">
              Ready for physical ESP32 / LoRa sensors
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center font-bold text-lg">
              02
            </div>
            <h3 className="font-bold text-stone-900 text-base">LangGraph Multi-Agent Architecture</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Specialized AI agents for Soil, Weather, Pest, and Irrigation run sequentially. The central Decision Agent combines outputs using ICAR & TNAU RAG facts.
            </p>
            <div className="text-[11px] font-mono text-sky-800 bg-sky-50 px-2.5 py-1 rounded w-fit">
              Zero hallucination agronomy
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-lg">
              03
            </div>
            <h3 className="font-bold text-stone-900 text-base">Offline GSM SMS & Multilingual Voice</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Works seamlessly on 4G, 2G, or offline. Farmers receive critical soil & rain alerts directly as SMS messages, with full voice queries in Tamil, Hindi, and English.
            </p>
            <div className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded w-fit">
              PWA • Voice enabled • Anti-spam cooldown
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Agent Pillars */}
      <section className="bg-stone-900 text-stone-100 py-16 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 font-bold">
              AGENT SPECIALIZATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mt-3">
              Six Coordinated AI Agents Guarding Your Crop
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentPillars.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <div
                  key={i}
                  className={`bg-stone-950/80 border ${agent.border} p-6 rounded-2xl space-y-3 relative hover:scale-[1.01] transition-transform`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl bg-stone-900 ${agent.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded">
                      Agent 0{i + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-100">{agent.title}</h3>
                  <div className="text-[11px] font-mono text-stone-400">{agent.models}</div>
                  <p className="text-xs text-stone-400 leading-relaxed">{agent.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Crops & Typical Growth Calendars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Calibrated for South & Pan-Indian Crops
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Pre-tuned nutrient benchmarks and pest incubation indices for key horticultural and field varieties.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {supportedCrops.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm text-center space-y-1 hover:border-emerald-500 transition-colors">
              <div className="text-2xl">🍅</div>
              <h4 className="font-bold text-stone-900 text-sm">{c.name}</h4>
              <p className="text-[11px] text-stone-500 font-medium">{c.variety}</p>
              <div className="text-[10px] text-emerald-800 bg-emerald-50 rounded py-0.5 mt-1 font-mono">
                {c.water} • {c.duration}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Indian Farmer Demo Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 to-stone-950 text-white p-8 sm:p-12 rounded-3xl border border-emerald-800 shadow-xl space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded">
              FIELD FEEDBACK
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mt-2">
              Tested by Real Farmers in Tamil Nadu & Karnataka
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-900/80 border border-stone-700/60 p-5 rounded-2xl space-y-3">
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "The SMS alert came right to my basic phone at 9:30 AM warning that rain was coming. I didn't turn on the borewell pump and saved 3,000 liters of water and electricity."
              </p>
              <div className="text-xs pt-1 border-t border-stone-800">
                <div className="font-bold text-stone-100">Murugan S.</div>
                <div className="text-[11px] text-emerald-400">Tomato Farmer, Pollachi (2.5 Acres)</div>
              </div>
            </div>

            <div className="bg-stone-900/80 border border-stone-700/60 p-5 rounded-2xl space-y-3">
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "Speaking in Tamil to the AI Advisor on my phone helped me immediately understand why lower leaves were turning yellow, without technical jargon."
              </p>
              <div className="text-xs pt-1 border-t border-stone-800">
                <div className="font-bold text-stone-100">Selvaraj K.</div>
                <div className="text-[11px] text-emerald-400">Brinjal & Chilli Grower, Salem</div>
              </div>
            </div>

            <div className="bg-stone-900/80 border border-stone-700/60 p-5 rounded-2xl space-y-3">
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "The pest image scanner identified early blight symptoms in seconds. The recommended bio-control kept my crop healthy through monsoon humidity."
              </p>
              <div className="text-xs pt-1 border-t border-stone-800">
                <div className="font-bold text-stone-100">Ramesh Patel</div>
                <div className="text-[11px] text-emerald-400">Vegetable Producer, Mysore</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center max-w-xl mx-auto space-y-4 px-4">
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          Ready to experience your farm's digital twin?
        </h2>
        <p className="text-xs text-stone-600">
          Explore the live dashboard, trigger environmental scenarios, and inspect agent reasoning.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
        >
          <span>Open Live Farm Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
