-- AgriSense AI Database Schema (PostgreSQL / Supabase)
-- Multi-Agent Intelligent Agriculture Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Farmer Profiles
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- References auth.users(id) in Supabase
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta', 'hi')),
    state TEXT NOT NULL DEFAULT 'Tamil Nadu',
    district TEXT NOT NULL DEFAULT 'Coimbatore',
    notification_enabled BOOLEAN DEFAULT TRUE,
    sms_alerts_enabled BOOLEAN DEFAULT TRUE,
    last_sms_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Farms
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    area_acres NUMERIC(6, 2) NOT NULL DEFAULT 2.5,
    soil_type TEXT NOT NULL DEFAULT 'Loamy',
    irrigation_type TEXT NOT NULL DEFAULT 'Drip Irrigation',
    latitude NUMERIC(9, 6) DEFAULT 11.0168,
    longitude NUMERIC(9, 6) DEFAULT 76.9558,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crops
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    variety TEXT DEFAULT 'Hybrid Roma',
    growth_stage TEXT NOT NULL DEFAULT 'Vegetative',
    sowing_date DATE DEFAULT CURRENT_DATE - INTERVAL '35 days',
    expected_harvest_date DATE DEFAULT CURRENT_DATE + INTERVAL '55 days',
    health_score INTEGER DEFAULT 85 CHECK (health_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Soil Readings (Simulated / IoT Stream)
CREATE TABLE IF NOT EXISTS soil_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    moisture_percentage NUMERIC(5, 2) NOT NULL,
    temperature_celsius NUMERIC(5, 2) NOT NULL,
    ph_level NUMERIC(4, 2) NOT NULL,
    nitrogen_mg_kg NUMERIC(6, 2) NOT NULL,
    phosphorus_mg_kg NUMERIC(6, 2) NOT NULL,
    potassium_mg_kg NUMERIC(6, 2) NOT NULL,
    electrical_conductivity NUMERIC(5, 2) DEFAULT 1.2,
    organic_carbon_percentage NUMERIC(4, 2) DEFAULT 0.65,
    soil_health_score INTEGER NOT NULL DEFAULT 82,
    sensor_source TEXT DEFAULT 'python_simulator_v1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Weather Readings
CREATE TABLE IF NOT EXISTS weather_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    temperature_celsius NUMERIC(5, 2) NOT NULL,
    humidity_percentage NUMERIC(5, 2) NOT NULL,
    rain_probability_percentage NUMERIC(5, 2) NOT NULL,
    rainfall_amount_mm NUMERIC(5, 2) DEFAULT 0.0,
    wind_speed_kmh NUMERIC(5, 2) DEFAULT 12.0,
    solar_radiation_w_m2 NUMERIC(6, 2) DEFAULT 620.0,
    heat_risk_level TEXT DEFAULT 'Low' CHECK (heat_risk_level IN ('Low', 'Moderate', 'High', 'Extreme')),
    rain_risk_level TEXT DEFAULT 'Moderate',
    forecast_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Pest & Disease Detections
CREATE TABLE IF NOT EXISTS pest_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
    image_url TEXT,
    pest_or_disease_name TEXT NOT NULL,
    is_healthy BOOLEAN DEFAULT FALSE,
    confidence_score NUMERIC(5, 2) NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('None', 'Low', 'Medium', 'High', 'Critical')),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
    model_name TEXT DEFAULT 'YOLOv8-ViT-Hybrid',
    is_simulation BOOLEAN DEFAULT TRUE,
    recommended_action TEXT NOT NULL,
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Irrigation Records
CREATE TABLE IF NOT EXISTS irrigation_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In-Progress', 'Completed', 'Postponed', 'Cancelled')),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    water_volume_liters NUMERIC(8, 2),
    water_saved_liters NUMERIC(8, 2) DEFAULT 0,
    reason TEXT,
    ai_agent_model TEXT DEFAULT 'RL-PPO-Agent-v1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI Predictions
CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    agent_name TEXT NOT NULL, -- 'soil_agent', 'weather_agent', 'pest_agent', 'irrigation_agent'
    model_architecture TEXT NOT NULL,
    prediction_target TEXT NOT NULL,
    predicted_value TEXT NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    features_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Recommendations (Central Decision Agent)
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Soil', 'Irrigation', 'Pest', 'Weather', 'General')),
    what_text TEXT NOT NULL,
    why_text TEXT NOT NULL,
    action_text TEXT NOT NULL,
    when_text TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    confidence_score NUMERIC(5, 2) NOT NULL,
    why_seeing_this TEXT[] DEFAULT '{}',
    officer_advice_required BOOLEAN DEFAULT FALSE,
    rag_sources TEXT[] DEFAULT '{}',
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Notifications (In-App & SMS)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('in_app', 'sms', 'voice')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium',
    status TEXT NOT NULL DEFAULT 'delivered' CHECK (status IN ('pending', 'delivered', 'failed', 'cooldown_throttled')),
    sms_tracking_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Sensor Simulation Presets & States
CREATE TABLE IF NOT EXISTS sensor_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    scenario TEXT NOT NULL DEFAULT 'normal' CHECK (scenario IN ('normal', 'rain_approaching', 'drought_stress', 'nitrogen_depletion', 'pest_infestation')),
    simulated_hour INTEGER DEFAULT 14,
    auto_cycle_enabled BOOLEAN DEFAULT TRUE,
    cycle_interval_seconds INTEGER DEFAULT 15,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Knowledge Documents (Agricultural RAG)
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL, -- e.g. 'ICAR', 'TNAU Agritech Portal', 'KVK Tamil Nadu'
    crop_name TEXT NOT NULL,
    topic TEXT NOT NULL, -- 'soil_fertility', 'pest_management', 'irrigation'
    content TEXT NOT NULL,
    tamil_translation TEXT,
    hindi_translation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Agent Run Logs (LangGraph Orchestrator Execution State)
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    orchestrator_run_id TEXT NOT NULL,
    step_name TEXT NOT NULL,
    agent_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'success',
    input_state JSONB,
    output_state JSONB,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_soil_farm_time ON soil_readings(farm_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_weather_farm_time ON weather_readings(farm_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_farm ON recommendations(farm_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_farmer ON notifications(farmer_id, created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pest_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE irrigation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage their own records
CREATE POLICY "Farmers can view own profile" ON farmer_profiles
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Farmers can manage own farms" ON farms
    FOR ALL USING (farmer_id IN (SELECT id FROM farmer_profiles WHERE user_id = auth.uid() OR user_id IS NULL));

CREATE POLICY "Readings viewable by farm owner" ON soil_readings
    FOR ALL USING (farm_id IN (SELECT id FROM farms WHERE farmer_id IN (SELECT id FROM farmer_profiles WHERE user_id = auth.uid() OR user_id IS NULL)));

-- Default Seed for Demo Farm (Green Valley Farm, Tomato, Loamy Soil)
DO $$
DECLARE
    v_farmer_id UUID;
    v_farm_id UUID;
    v_crop_id UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM farmer_profiles WHERE phone_number = '+919876543210') THEN
        INSERT INTO farmer_profiles (full_name, phone_number, phone_verified, preferred_language, state, district)
        VALUES ('Murugan S.', '+919876543210', TRUE, 'en', 'Tamil Nadu', 'Coimbatore')
        RETURNING id INTO v_farmer_id;

        INSERT INTO farms (farmer_id, farm_name, area_acres, soil_type, irrigation_type, is_demo)
        VALUES (v_farmer_id, 'Green Valley Farm', 2.5, 'Loamy', 'Drip Irrigation', TRUE)
        RETURNING id INTO v_farm_id;

        INSERT INTO crops (farm_id, crop_name, variety, growth_stage, health_score)
        VALUES (v_farm_id, 'Tomato', 'Hybrid Roma', 'Vegetative Stage', 85)
        RETURNING id INTO v_crop_id;

        INSERT INTO soil_readings (farm_id, moisture_percentage, temperature_celsius, ph_level, nitrogen_mg_kg, phosphorus_mg_kg, potassium_mg_kg, soil_health_score)
        VALUES (v_farm_id, 42.0, 27.4, 6.5, 38.0, 24.0, 31.0, 82);

        INSERT INTO weather_readings (farm_id, temperature_celsius, humidity_percentage, rain_probability_percentage, rainfall_amount_mm, forecast_summary)
        VALUES (v_farm_id, 31.0, 68.0, 72.0, 14.5, 'Scattered thunderstorms expected in late afternoon');

        INSERT INTO recommendations (farm_id, category, what_text, why_text, action_text, when_text, priority, confidence_score, why_seeing_this)
        VALUES 
        (v_farm_id, 'Soil', 'Nitrogen level is entering marginal threshold', 'Soil nitrogen is 38 mg/kg, approaching 30 mg/kg critical threshold for tomato vegetative growth.', 'Prepare organic vermicompost top dressing or scheduled fertigation.', 'Within next 2 to 3 days', 'Medium', 89, ARRAY['Low nitrogen curve', 'Vegetative nutrient demand', 'Loamy soil drainage']),
        (v_farm_id, 'Irrigation', 'Delay morning irrigation cycle', 'Weather forecast indicates 72% rain probability with 14.5 mm precipitation expected.', 'Postpone drip irrigation by 24 hours to prevent root waterlogging and save water.', 'Hold for today', 'High', 94, ARRAY['72% rain forecast', 'Adequate 42% current soil moisture', 'Water conservation goal']),
        (v_farm_id, 'Pest', 'Inspect lower foliage for early blight or plant hoppers', 'Elevated humidity (68%) and warm canopy temperature create favorable microclimate.', 'Check underneath leaf surfaces across 5 random plants in block 2.', 'Today evening', 'Medium', 86, ARRAY['Humidity above 65%', 'Canopy density in vegetative stage']);
    END IF;
END $$;
