export type Language = 'en' | 'ta' | 'hi';

export interface FarmerProfile {
  id?: string;
  fullName: string;
  phoneNumber: string;
  phoneVerified: boolean;
  preferredLanguage: Language;
  state: string;
  district: string;
  farmName: string;
  farmAcres: number;
  crop: string;
  cropVariety: string;
  cropStage: string;
  soilType: string;
  sowingDate: string;
  irrigationMethod: string;
  notificationsEnabled: boolean;
  smsAlertsEnabled: boolean;
}

export interface SensorReadings {
  soil_moisture: number;
  soil_temperature: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  humidity: number;
  temperature: number;
  rain_probability: number;
  wind_speed: number;
  solar_radiation: number;
  hour_of_day: number;
  weather_condition: string;
  pest_risk: string;
  soil_health_score: number;
}

export interface DeficientNutrient {
  nutrient: string;
  status: string;
  value: string;
  benchmark: string;
  symptom: string;
}

export interface SoilAnalysis {
  agent: string;
  model_used: string;
  model_architecture: string;
  inference_confidence: number;
  runtime_ms: number;
  soil_health_score: number;
  ph_status: string;
  deficiencies: DeficientNutrient[];
  warnings: string[];
  action_recommendations: string[];
  future_prediction: {
    metric: string;
    current_val: number;
    predicted_val_in_6_days: number;
    risk_in_5_7_days: string;
    recommendation_window: string;
  };
}

export interface HourlyForecast {
  time: string;
  temp_c: number;
  rain_prob: number;
  humidity: number;
  icon: string;
}

export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  rain_prob: number;
  condition: string;
  irrigation_advice: string;
}

export interface WeatherAnalysis {
  agent: string;
  model_used: string;
  api_backend: string;
  confidence: number;
  current_temp: number;
  humidity: number;
  rain_probability: number;
  wind_speed_kmh: number;
  heat_risk: string;
  rain_risk: string;
  primary_recommendation: string;
  crop_risk_factors: string[];
  hourly_forecast: HourlyForecast[];
  daily_forecast: DailyForecast[];
}

export interface PestAnalysis {
  agent: string;
  model_used: string;
  is_simulation_mode: boolean;
  transparency_notice: string;
  condition_key: string;
  detected_condition: string;
  category: string;
  is_healthy: boolean;
  confidence_percentage: number;
  severity: string;
  risk_level: string;
  symptoms: string;
  immediate_action: string;
  recommended_control: string;
  environmental_correlation: string;
}

export interface IrrigationAnalysis {
  agent: string;
  model_architecture: string;
  policy_type: string;
  irrigation_required: boolean;
  decision_state: string;
  priority: string;
  current_soil_moisture: number;
  target_threshold_moisture: number;
  rain_probability: number;
  recommended_window: string;
  recommended_duration_minutes: number;
  recommended_volume_liters: number;
  estimated_water_saved_liters: number;
  reason: string;
  rl_reward_factors: {
    evapotranspiration_risk: string;
    soil_holding_capacity: string;
    percolation_efficiency: string;
  };
}

export interface TodayAction {
  step: string;
  title: string;
  category: string;
  priority: string;
  tag: string;
}

export interface StructuredRecommendation {
  category: 'Soil' | 'Irrigation' | 'Pest' | 'Weather' | 'General';
  what: string;
  why: string;
  action: string;
  when: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  expected_benefit?: string;
  why_seeing_this: string[];
  officer_advice_required: boolean;
}

export interface AgentStepTrace {
  agent: string;
  status: string;
  model: string;
  duration_ms: number;
  output_summary: string;
}

export interface NotificationLog {
  id: string;
  phone: string;
  category: string;
  channel: string;
  provider?: string;
  status: string;
  timestamp: string;
  title: string;
  message: string;
}
