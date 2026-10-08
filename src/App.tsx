import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  Language, 
  FarmerProfile, 
  SensorReadings, 
  TodayAction, 
  StructuredRecommendation, 
  SoilAnalysis, 
  WeatherAnalysis, 
  PestAnalysis, 
  IrrigationAnalysis, 
  AgentStepTrace, 
  NotificationLog 
} from './types';
import { apiService, DEFAULT_FARMER_PROFILE, DEFAULT_READINGS } from './services/api';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { SensorSimulationModal } from './components/SensorSimulationModal';
import { SmsAlertDrawer } from './components/SmsAlertDrawer';
import { MultiAgentActivityDrawer } from './components/MultiAgentActivityDrawer';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SoilPage } from './pages/SoilPage';
import { WeatherPage } from './pages/WeatherPage';
import { PestPage } from './pages/PestPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { AdvisorPage } from './pages/AdvisorPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_FARMER_PROFILE);
  const [readings, setReadings] = useState<SensorReadings>(DEFAULT_READINGS);
  const [healthScore, setHealthScore] = useState<number>(82);
  const [actions, setActions] = useState<TodayAction[]>([]);
  const [recommendations, setRecommendations] = useState<StructuredRecommendation[]>([]);
  const [soilAnalysis, setSoilAnalysis] = useState<SoilAnalysis | null>(null);
  const [weatherAnalysis, setWeatherAnalysis] = useState<WeatherAnalysis | null>(null);
  const [pestAnalysis, setPestAnalysis] = useState<PestAnalysis | null>(null);
  const [irrigationAnalysis, setIrrigationAnalysis] = useState<IrrigationAnalysis | null>(null);
  const [agentTraces, setAgentTraces] = useState<AgentStepTrace[]>([]);
  const [smsLogs, setSmsLogs] = useState<NotificationLog[]>([]);

  // Modals & Drawers state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isSmsDrawerOpen, setIsSmsDrawerOpen] = useState(false);
  const [isAgentTraceOpen, setIsAgentTraceOpen] = useState(false);

  // Run Orchestrator Cycle
  const triggerOrchestrator = useCallback(async (currentProf = profile, lang = language) => {
    try {
      const res = await apiService.runOrchestrator(currentProf, undefined, undefined, lang);
      setHealthScore(res.health_score);
      setActions(res.actions);
      setRecommendations(res.recommendations);
      setSoilAnalysis(res.soilAnalysis);
      setWeatherAnalysis(res.weatherAnalysis);
      setPestAnalysis(res.pestAnalysis);
      setIrrigationAnalysis(res.irrigationAnalysis);
      setAgentTraces(res.traces);
    } catch (e) {
      console.warn("Error running orchestrator cycle:", e);
    }
  }, [profile, language]);

  // Initial Data Fetch
  useEffect(() => {
    const init = async () => {
      const [latestReadings, latestSms] = await Promise.all([
        apiService.getLatestSensors(),
        apiService.getSmsLogs()
      ]);
      setReadings(latestReadings);
      setSmsLogs(latestSms);
      await triggerOrchestrator(profile, language);
    };
    init();
  }, []);

  // Periodic sensor advancement (diurnal physics simulation tick every 20 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updated = await apiService.tickSensors(10);
        setReadings(updated);
      } catch (e) {
        console.warn("Sensor tick error:", e);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Simulator controls
  const handlePreset = async (preset: string) => {
    const updated = await apiService.setPreset(preset);
    setReadings(updated);
    await triggerOrchestrator(profile, language);
    const updatedLogs = await apiService.getSmsLogs();
    setSmsLogs(updatedLogs);
  };

  const handleOverride = async (field: string, value: number) => {
    const updated = await apiService.overrideReading(field, value);
    setReadings(updated);
    await triggerOrchestrator(profile, language);
  };

  const handleTick = async () => {
    const updated = await apiService.tickSensors(15);
    setReadings(updated);
    await triggerOrchestrator(profile, language);
  };

  const handleSendTestSms = async (phone: string, category: string, msg: string) => {
    await apiService.sendTestSms(phone, category, msg);
    const updatedLogs = await apiService.getSmsLogs();
    setSmsLogs(updatedLogs);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    triggerOrchestrator(profile, lang);
  };

  const handleUpdateProfile = (updated: FarmerProfile) => {
    setProfile(updated);
    if (updated.preferredLanguage !== language) {
      setLanguage(updated.preferredLanguage);
    }
    triggerOrchestrator(updated, updated.preferredLanguage);
  };

  // Safe fallbacks while initializing
  const activeSoilAnalysis = soilAnalysis || {
    agent: "Soil Intelligence Agent",
    model_used: "Random Forest Regressor v2.4",
    model_architecture: "Decision tree ensemble",
    inference_confidence: 89.4,
    runtime_ms: 18,
    soil_health_score: healthScore,
    ph_status: "Optimal",
    deficiencies: [],
    warnings: [],
    action_recommendations: [],
    future_prediction: {
      metric: "Nitrogen Depletion Trajectory",
      current_val: readings.nitrogen,
      predicted_val_in_6_days: 31.4,
      risk_in_5_7_days: "Sub-optimal",
      recommendation_window: "Within 48h"
    }
  };

  const activeWeatherAnalysis = weatherAnalysis || {
    agent: "Weather Intelligence Agent",
    model_used: "Temporal Fusion Transformer (TFT)",
    api_backend: "Simulated IMD / ECMWF Meteorological Bridge",
    confidence: 92.5,
    current_temp: readings.temperature,
    humidity: readings.humidity,
    rain_probability: readings.rain_probability,
    wind_speed_kmh: readings.wind_speed,
    heat_risk: "Moderate",
    rain_risk: "High",
    primary_recommendation: "Rain expected within 24 hours. Postpone irrigation.",
    crop_risk_factors: [],
    hourly_forecast: [],
    daily_forecast: []
  };

  const activePestAnalysis = pestAnalysis || {
    agent: "Pest Intelligence Agent",
    model_used: "YOLOv8-ViT-Hybrid",
    is_simulation_mode: true,
    transparency_notice: "SIMULATION / PROTOCOL FALLBACK: Image scanned via simulated Edge AI engine.",
    condition_key: "healthy",
    detected_condition: "Healthy Canopy",
    category: "Healthy",
    is_healthy: true,
    confidence_percentage: 97.4,
    severity: "None",
    risk_level: "Low",
    symptoms: "Normal foliage expansion.",
    immediate_action: "Maintain scheduled monitoring.",
    recommended_control: "Standard IPM preventive sprays.",
    environmental_correlation: "Normal range"
  };

  const activeIrrigationAnalysis = irrigationAnalysis || {
    agent: "Irrigation Intelligence Agent",
    model_architecture: "Deep Q-Network (DQN) Hydro-Policy v2.1",
    policy_type: "Safe Reinforcement Learning Baseline",
    irrigation_required: false,
    decision_state: "Postpone Irrigation (Rain Expected)",
    priority: "High",
    current_soil_moisture: readings.soil_moisture,
    target_threshold_moisture: 48,
    rain_probability: readings.rain_probability,
    recommended_window: "Hold for 24h",
    recommended_duration_minutes: 0,
    recommended_volume_liters: 0,
    estimated_water_saved_liters: 3200,
    reason: "Rain probability is elevated.",
    rl_reward_factors: {
      evapotranspiration_risk: "Moderate",
      soil_holding_capacity: "Loamy",
      percolation_efficiency: "92%"
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-stone-100/70 text-stone-900 font-sans selection:bg-emerald-200">
        <OfflineBanner language={language} />

        <Navbar
          language={language}
          onLanguageChange={handleLanguageChange}
          readings={readings}
          profile={profile}
          unreadAlertCount={smsLogs.length}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onOpenSmsDrawer={() => setIsSmsDrawerOpen(true)}
          onOpenAgentTrace={() => setIsAgentTraceOpen(true)}
        />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  language={language}
                  readings={readings}
                  onOpenSimulator={() => setIsSimulatorOpen(true)}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  language={language}
                  profile={profile}
                  readings={readings}
                  healthScore={healthScore}
                  actions={actions}
                  recommendations={recommendations}
                  soilAnalysis={activeSoilAnalysis}
                  weatherAnalysis={activeWeatherAnalysis}
                  irrigationAnalysis={activeIrrigationAnalysis}
                  pestAnalysis={activePestAnalysis}
                  onOpenSimulator={() => setIsSimulatorOpen(true)}
                  onOpenAgentTrace={() => setIsAgentTraceOpen(true)}
                  onRefresh={() => triggerOrchestrator(profile, language)}
                />
              }
            />
            <Route
              path="/soil"
              element={
                <SoilPage
                  language={language}
                  readings={readings}
                  analysis={activeSoilAnalysis}
                  profile={profile}
                  onOpenSimulator={() => setIsSimulatorOpen(true)}
                />
              }
            />
            <Route
              path="/weather"
              element={
                <WeatherPage
                  language={language}
                  readings={readings}
                  analysis={activeWeatherAnalysis}
                  profile={profile}
                  onOpenSimulator={() => setIsSimulatorOpen(true)}
                />
              }
            />
            <Route
              path="/pest"
              element={
                <PestPage
                  language={language}
                  initialAnalysis={activePestAnalysis}
                  readings={readings}
                  profile={profile}
                />
              }
            />
            <Route
              path="/irrigation"
              element={
                <IrrigationPage
                  language={language}
                  readings={readings}
                  analysis={activeIrrigationAnalysis}
                  profile={profile}
                  onOpenSimulator={() => setIsSimulatorOpen(true)}
                />
              }
            />
            <Route
              path="/advisor"
              element={
                <AdvisorPage
                  language={language}
                  profile={profile}
                  readings={readings}
                />
              }
            />
            <Route
              path="/alerts"
              element={
                <AlertsPage
                  language={language}
                  logs={smsLogs}
                  profile={profile}
                  readings={readings}
                  onSendSms={handleSendTestSms}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  language={language}
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                />
              }
            />
          </Routes>
        </main>

        <MobileBottomNav
          language={language}
          unreadCount={smsLogs.length}
        />

        {/* Global Drawers & Modals */}
        <SensorSimulationModal
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          readings={readings}
          onPreset={handlePreset}
          onOverride={handleOverride}
          onTick={handleTick}
        />

        <SmsAlertDrawer
          isOpen={isSmsDrawerOpen}
          onClose={() => setIsSmsDrawerOpen(false)}
          logs={smsLogs}
          profile={profile}
          onSendTestSms={handleSendTestSms}
        />

        <MultiAgentActivityDrawer
          isOpen={isAgentTraceOpen}
          onClose={() => setIsAgentTraceOpen(false)}
          traces={agentTraces}
          healthScore={healthScore}
        />
      </div>
    </BrowserRouter>
  );
};
export default App;
