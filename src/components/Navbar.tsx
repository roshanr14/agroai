import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Cpu, 
  Sliders, 
  Bell, 
  Languages, 
  Droplet,
  CloudRain,
  Bug,
  Compass,
  UserCheck
} from 'lucide-react';
import { Language, SensorReadings, FarmerProfile } from '../types';
import { getTranslation } from '../lib/i18n';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  readings: SensorReadings;
  profile: FarmerProfile;
  unreadAlertCount: number;
  onOpenSimulator: () => void;
  onOpenSmsDrawer: () => void;
  onOpenAgentTrace: () => void;
}

export const Navbar: React.FC<Props> = ({
  language,
  onLanguageChange,
  readings,
  profile,
  unreadAlertCount,
  onOpenSimulator,
  onOpenSmsDrawer,
  onOpenAgentTrace
}) => {
  const location = useLocation();
  const t = getTranslation(language);

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/soil', label: t.soilStatus, icon: Sprout },
    { to: '/weather', label: t.weatherStatus, icon: CloudRain },
    { to: '/pest', label: 'Pest Health', icon: Bug },
    { to: '/irrigation', label: t.waterStatus, icon: Droplet },
    { to: '/advisor', label: 'AI Advisor', icon: Compass },
    { to: '/alerts', label: 'SMS & Alerts', icon: Bell }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top telemetry ticker strip */}
      <div className="hidden lg:flex items-center justify-between px-8 py-2 text-xs bg-[#eaf7ef] border-b border-[#d1edd9] text-[#166436]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-[#279e5a]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#279e5a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#279e5a]"></span>
            </span>
            Live Telemetry: {readings.weather_condition || 'Online'}
          </span>
          <span className="text-stone-300">|</span>
          <span>Farm: <strong className="text-stone-800">{profile.farmName}</strong> ({profile.farmAcres} Acres, {profile.soilType})</span>
          <span className="text-stone-300">|</span>
          <span>Crop: <strong className="text-stone-800">{profile.crop}</strong> ({profile.cropStage})</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-stone-700">
            <span>Soil Moisture: <strong className="text-[#279e5a] font-mono font-bold">{readings.soil_moisture}%</strong></span>
            <span>N: <strong className="text-amber-700 font-mono font-bold">{readings.nitrogen} mg/kg</strong></span>
            <span>Temp: <strong className="text-stone-900 font-mono font-bold">{readings.temperature}°C</strong></span>
            <span>Rain: <strong className="text-sky-700 font-mono font-bold">{readings.rain_probability}%</strong></span>
          </div>

          <button
            onClick={onOpenAgentTrace}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#279e5a] border border-[#279e5a]/30 hover:bg-[#279e5a] hover:text-white transition-all cursor-pointer font-medium"
            title="Inspect LangGraph agent state machine execution"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">LangGraph Multi-Agent</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand matching "greenery nyc" style */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#279e5a] flex items-center justify-center shadow-md shadow-[#279e5a]/25 text-white font-bold group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-stone-900 tracking-tight">
                  agrisense<span className="text-[#279e5a]">.ai</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono lowercase bg-[#eaf7ef] text-[#279e5a] border border-[#c1e8cd] px-2 py-0.5 rounded-full font-semibold">
                  greenery platform
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#279e5a] text-white shadow-sm shadow-[#279e5a]/30'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions with high-contrast CTA button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative flex items-center bg-stone-100 rounded-full px-2 py-1 border border-stone-200 text-xs">
              <Languages className="w-3.5 h-3.5 ml-1 text-stone-500" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Preferred Language"
                className="bg-transparent text-stone-800 text-xs py-1 px-1.5 focus:outline-none cursor-pointer font-semibold"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* SMS Notification Bell */}
            <button
              onClick={onOpenSmsDrawer}
              aria-label="SMS Notifications"
              className="relative p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer border border-stone-200"
              title="SMS Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#191c21] text-white font-bold text-[10px] flex items-center justify-center">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* High-Contrast CTA Button: Simulate IoT (matching the dark "add to cart" CTA from image!) */}
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#191c21] hover:bg-black text-white text-xs font-bold transition-all shadow-md cursor-pointer group"
              title="Open Sensor Simulation Control Panel"
            >
              <Sliders className="w-3.5 h-3.5 text-[#34c775] group-hover:rotate-45 transition-transform" />
              <span>Simulate IoT</span>
            </button>

            {/* Farmer Profile Link */}
            <Link
              to="/profile"
              aria-label="Farmer Profile"
              className="p-2.5 rounded-full bg-[#eaf7ef] text-[#279e5a] hover:bg-[#279e5a] hover:text-white border border-[#c1e8cd] transition-colors"
              title="Farmer Profile & Settings"
            >
              <UserCheck className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
