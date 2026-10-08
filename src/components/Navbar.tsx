import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Activity, 
  Cpu, 
  Sliders, 
  Bell, 
  Languages, 
  Download,
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
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-emerald-950/60 text-stone-200">
      {/* Top micro-bar: Farm context & Live sensor ticker */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 text-xs bg-stone-950/80 border-b border-stone-800 text-stone-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            IoT Stream: {readings.weather_condition || 'Online'}
          </span>
          <span className="text-stone-600">|</span>
          <span>Farm: <strong className="text-stone-300">{profile.farmName}</strong> ({profile.farmAcres} Acres, {profile.soilType})</span>
          <span className="text-stone-600">|</span>
          <span>Crop: <strong className="text-stone-300">{profile.crop}</strong> ({profile.cropStage})</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <span>Soil Moist: <strong className="text-emerald-400 font-mono">{readings.soil_moisture}%</strong></span>
            <span>N: <strong className="text-amber-300 font-mono">{readings.nitrogen} mg/kg</strong></span>
            <span>Temp: <strong className="text-stone-200 font-mono">{readings.temperature}°C</strong></span>
            <span>Rain: <strong className="text-sky-300 font-mono">{readings.rain_probability}%</strong></span>
          </div>

          <button
            onClick={onOpenAgentTrace}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            title="Inspect LangGraph agent state machine execution"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">LangGraph Agents Active</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-white font-bold group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg sm:text-xl text-stone-100 tracking-tight">
                  AgriSense<span className="text-emerald-400 font-sans">.ai</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                  Multi-Agent
                </span>
              </div>
              <p className="text-[10px] text-stone-400 tracking-wide font-medium hidden sm:block">
                Intelligent Agriculture Platform
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/50'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative flex items-center bg-stone-800/90 rounded-lg p-0.5 border border-stone-700 text-xs">
              <Languages className="w-3.5 h-3.5 ml-2 text-stone-400" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Preferred Language"
                className="bg-transparent text-stone-200 text-xs py-1 px-2 focus:outline-none cursor-pointer font-medium"
              >
                <option value="en" className="bg-stone-900 text-white">English</option>
                <option value="ta" className="bg-stone-900 text-white">தமிழ் (Tamil)</option>
                <option value="hi" className="bg-stone-900 text-white">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* SMS Notification Bell */}
            <button
              onClick={onOpenSmsDrawer}
              aria-label="SMS Notifications"
              className="relative p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-700"
              title="SMS Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Developer Simulation Trigger */}
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 border border-emerald-700/60 text-xs font-medium transition-all shadow-sm cursor-pointer"
              title="Open Sensor Simulation Control Panel"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Simulate IoT</span>
            </button>

            {/* Farmer Profile Link */}
            <Link
              to="/profile"
              aria-label="Farmer Profile"
              className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
              title="Farmer Profile & Settings"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
