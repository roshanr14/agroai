import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ArrowRight, 
  Droplet, 
  CloudRain, 
  Bug, 
  Smartphone, 
  Cpu, 
  Sparkles
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
    { name: "Tomato", variety: "Hybrid Roma", emoji: "🍅", water: "Drip", duration: "110-120 days" },
    { name: "Chilli", variety: "Guntur Sannam", emoji: "🌶️", water: "Drip", duration: "150-180 days" },
    { name: "Paddy", variety: "ADT 45", emoji: "🌾", water: "AWD / Flood", duration: "120-135 days" },
    { name: "Cotton", variety: "Bt Hybrid", emoji: "🌱", water: "Furrow / Drip", duration: "160-170 days" },
    { name: "Brinjal", variety: "Annamalai", emoji: "🍆", water: "Drip", duration: "140 days" },
    { name: "Onion", variety: "Bellary Red", emoji: "🧅", water: "Micro-sprinkler", duration: "90-100 days" }
  ];

  const agentPillars = [
    {
      title: "Soil Intelligence Agent",
      models: "Random Forest • XGBoost • Deep SoilNet",
      desc: "Analyzes continuous NPK, pH, and soil moisture trajectories to compute a Soil Health Score and forecast nutrient deficits 5-7 days in advance.",
      icon: Sprout
    },
    {
      title: "Weather Intelligence Agent",
      models: "Temporal Fusion Transformer (TFT)",
      desc: "Simulates and integrates meteorological feeds for 24h & 7-day precipitation forecasts, heat stress danger zones, and pesticide spray washout protection.",
      icon: CloudRain
    },
    {
      title: "Pest & Foliar Health Agent",
      models: "YOLOv8-ViT-Hybrid Computer Vision",
      desc: "Edge vision scanner identifying Brown Plant Hopper, Early Blight, and Spodoptera with clear, transparent simulation and protocol labeling.",
      icon: Bug
    },
    {
      title: "Irrigation Intelligence Agent",
      models: "Reinforcement Learning (RL DQN Policy)",
      desc: "Autonomously balances evapotranspiration stress against rainfall probability to calculate exact watering windows, runtimes, and thousands of liters saved.",
      icon: Droplet
    },
    {
      title: "Central Decision Agent (LLM + RAG)",
      models: "ICAR & TNAU Knowledge Base RAG",
      desc: "Harmonizes multi-agent outputs into transparent WHAT, WHY, ACTION, WHEN recommendations in English, Tamil, and Hindi with zero hallucination.",
      icon: Sparkles
    },
    {
      title: "Autonomous GSM SMS Engine",
      models: "Direct Carrier SMS Gateway",
      desc: "Dispatches plain SMS alerts directly to farmer phones with anti-spam cooldown protection, ensuring critical warnings arrive without an internet connection.",
      icon: Smartphone
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section styled with Greenery theme */}
      <section className="relative overflow-hidden pt-12 pb-18 sm:pt-20 sm:pb-26 bg-gradient-to-b from-[#279e5a] to-[#1f8249] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/25">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              MULTI-AGENT INTELLIGENT AGRICULTURE PLATFORM
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              {t.landingTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/90 font-normal leading-relaxed max-w-2xl mx-auto">
              {t.landingSubtitle}
            </p>

            {/* Action Buttons with High-Contrast Charcoal CTA */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/dashboard"
                className="px-7 py-4 rounded-full bg-[#191c21] hover:bg-black text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-2xl transition-all hover:scale-105 cursor-pointer"
              >
                <span>{t.startFarmBtn}</span>
                <ArrowRight className="w-4 h-4 text-[#34c775]" />
              </Link>

              <button
                onClick={onOpenSimulator}
                className="px-6 py-4 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
              >
                <Cpu className="w-4 h-4 text-white" />
                <span>Simulate IoT Telemetry</span>
              </button>

              <Link
                to="/advisor"
                className="px-6 py-4 rounded-full bg-white text-[#279e5a] hover:bg-stone-100 font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#279e5a]" />
                <span>AI Farm Advisor</span>
              </Link>
            </div>

            {/* Live Telemetry Ticker Preview */}
            <div className="pt-8">
              <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-7 py-3.5 rounded-full bg-white/18 backdrop-blur-md border border-white/25 text-xs text-white shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span>Soil Moisture: <strong className="font-mono text-white">{readings.soil_moisture}%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span>Available N: <strong className="font-mono text-white">{readings.nitrogen} mg/kg</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span>Rain Prob: <strong className="font-mono text-white">{readings.rain_probability}%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span>Health Score: <strong className="font-mono text-white">{readings.soil_health_score}/100</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Indian Agriculture Problem -> Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-[#279e5a] bg-[#eaf7ef] px-3.5 py-1 rounded-full font-bold">
            SENSE ➔ DECIDE ➔ NOTIFY
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 mt-2">
            Built for Real-World Indian Farming Conditions
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            No bloated dashboards. Just simple, practical advice that protects your harvest and saves water.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-[32px] border border-stone-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.05)] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#eaf7ef] text-[#279e5a] flex items-center justify-center font-bold text-lg font-mono">
              01
            </div>
            <h3 className="font-bold text-stone-900 text-base">Continuous IoT & Physics Simulation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Models diurnal solar curves, soil evaporation, and slow nutrient depletion without needing thousands of rupees in physical sensors.
            </p>
            <div className="text-[11px] font-mono text-[#279e5a] bg-[#eaf7ef] px-3 py-1 rounded-full w-fit font-semibold">
              Ready for physical ESP32 / LoRa
            </div>
          </div>

          <div className="bg-white p-7 rounded-[32px] border border-stone-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.05)] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#eaf7ef] text-[#279e5a] flex items-center justify-center font-bold text-lg font-mono">
              02
            </div>
            <h3 className="font-bold text-stone-900 text-base">LangGraph Multi-Agent Consensus</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Specialized AI agents for Soil, Weather, Pest, and Irrigation run sequentially. The central Decision Agent combines outputs using ICAR & TNAU facts.
            </p>
            <div className="text-[11px] font-mono text-[#279e5a] bg-[#eaf7ef] px-3 py-1 rounded-full w-fit font-semibold">
              Zero hallucination agronomy
            </div>
          </div>

          <div className="bg-white p-7 rounded-[32px] border border-stone-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.05)] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#eaf7ef] text-[#279e5a] flex items-center justify-center font-bold text-lg font-mono">
              03
            </div>
            <h3 className="font-bold text-stone-900 text-base">Offline GSM SMS & Multilingual Voice</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Works on 4G, 2G, or offline. Farmers receive critical soil & rain alerts directly as SMS text messages, with full voice queries in Tamil, Hindi, and English.
            </p>
            <div className="text-[11px] font-mono text-[#279e5a] bg-[#eaf7ef] px-3 py-1 rounded-full w-fit font-semibold">
              PWA • Voice enabled • Anti-spam cooldown
            </div>
          </div>
        </div>
      </section>

      {/* Six Coordinated Agents in Greenery style */}
      <section className="bg-white py-16 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-[#279e5a] bg-[#eaf7ef] px-3.5 py-1 rounded-full font-bold">
              AGENT SPECIALIZATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-3">
              Six Coordinated AI Agents Guarding Your Crop
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentPillars.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <div
                  key={i}
                  className="bg-[#f8faf9] border border-stone-200/80 p-6 rounded-[28px] space-y-3 relative hover:border-[#279e5a] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[#eaf7ef] text-[#279e5a]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-stone-500 bg-white px-2.5 py-1 rounded-full border border-stone-200">
                      Agent 0{i + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900">{agent.title}</h3>
                  <div className="text-[11px] font-mono text-[#279e5a] font-semibold">{agent.models}</div>
                  <p className="text-xs text-stone-600 leading-relaxed">{agent.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Crops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Calibrated for South & Pan-Indian Crops
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Pre-tuned nutrient benchmarks and pest incubation indices for horticultural and field crops.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {supportedCrops.map((c, i) => (
            <div key={i} className="p-5 rounded-[28px] bg-white border border-stone-200/80 shadow-xs text-center space-y-1.5 hover:border-[#279e5a] transition-colors">
              <div className="text-3xl">{c.emoji}</div>
              <h4 className="font-bold text-stone-900 text-sm">{c.name}</h4>
              <p className="text-[11px] text-stone-500 font-medium">{c.variety}</p>
              <div className="text-[10px] text-[#279e5a] bg-[#eaf7ef] rounded-full py-0.5 mt-1 font-mono font-semibold">
                {c.water} • {c.duration}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA with Contrast Dark Button */}
      <section className="text-center max-w-xl mx-auto space-y-4 px-4">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Experience your farm's digital twin
        </h2>
        <p className="text-xs text-stone-600">
          Explore the live dashboard, simulate rainfall or drought, and inspect multi-agent reasoning.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#191c21] hover:bg-black text-white font-bold text-sm transition-all shadow-xl hover:scale-105 cursor-pointer"
        >
          <span>Open Live Farm Dashboard</span>
          <ArrowRight className="w-4 h-4 text-[#34c775]" />
        </Link>
      </section>
    </div>
  );
};
