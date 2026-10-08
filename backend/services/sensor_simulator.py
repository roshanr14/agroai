"""
AgriSense AI - Realistic Agricultural Sensor Simulation Service
Simulates realistic physical, biological, and meteorological dynamics for Indian agricultural conditions.
Values evolve gradually following physics and plant-soil-atmosphere interactions rather than random fluctuations.
"""

import math
import random
import time
from typing import Dict, Any

class AgriculturalSensorSimulator:
    def __init__(self, initial_state: Dict[str, Any] = None):
        self.state = initial_state or {
            "soil_moisture": 42.0,            # Percentage (%)
            "soil_temperature": 27.4,         # Celsius (°C)
            "ph": 6.5,                        # pH scale
            "nitrogen": 38.0,                 # mg/kg (Available N)
            "phosphorus": 24.0,               # mg/kg (Available P)
            "potassium": 31.0,                # mg/kg (Available K)
            "humidity": 68.0,                 # Relative Humidity (%)
            "temperature": 31.0,              # Ambient Temp (°C)
            "rain_probability": 72.0,         # %
            "wind_speed": 12.0,               # km/h
            "solar_radiation": 620.0,         # W/m^2
            "hour_of_day": 14.0,              # 2:00 PM
            "weather_condition": "Overcast",  # Sunny, Overcast, Rain, Drought
            "pest_risk": "Low",
            "soil_health_score": 82
        }
        self.preset_mode = "normal"
        self.last_updated = time.time()

    def set_preset(self, preset: str):
        """Set environmental simulation presets for demonstration and testing."""
        self.preset_mode = preset
        if preset == "rain":
            self.state["rain_probability"] = 92.0
            self.state["humidity"] = 88.0
            self.state["temperature"] = 26.5
            self.state["soil_moisture"] = min(78.0, self.state["soil_moisture"] + 25.0)
            self.state["weather_condition"] = "Rain / Monsoon Showers"
            self.state["pest_risk"] = "Medium"
        elif preset == "drought":
            self.state["rain_probability"] = 4.0
            self.state["humidity"] = 32.0
            self.state["temperature"] = 38.5
            self.state["soil_moisture"] = 18.0
            self.state["soil_temperature"] = 34.0
            self.state["weather_condition"] = "Heatwave / Arid"
            self.state["pest_risk"] = "Low"
        elif preset == "nitrogen_deficiency":
            self.state["nitrogen"] = 21.0  # Critical low threshold
            self.state["soil_health_score"] = 61
        elif preset == "pest_surge":
            self.state["humidity"] = 86.0
            self.state["temperature"] = 30.5
            self.state["pest_risk"] = "High"
        elif preset == "optimal":
            self.state["soil_moisture"] = 54.0
            self.state["nitrogen"] = 52.0
            self.state["phosphorus"] = 30.0
            self.state["potassium"] = 45.0
            self.state["ph"] = 6.6
            self.state["soil_health_score"] = 94
            self.state["pest_risk"] = "Low"
            self.preset_mode = "normal"

        self._recalculate_health_and_risks()
        return self.get_readings()

    def tick(self, elapsed_minutes: float = 15.0) -> Dict[str, Any]:
        """
        Advance simulation clock by elapsed_minutes.
        Computes diurnal solar heating, evapotranspiration, nutrient uptake, and microclimate.
        """
        dt_hours = elapsed_minutes / 60.0
        self.state["hour_of_day"] = (self.state["hour_of_day"] + dt_hours) % 24.0
        hour = self.state["hour_of_day"]

        # 1. Diurnal Temperature Curve (peaks at 14:00, coolest at 05:00)
        diurnal_rad = ((hour - 5.0) / 24.0) * 2.0 * math.pi
        solar_factor = max(0.0, math.sin(diurnal_rad))
        
        base_temp = 25.0
        peak_temp_addon = 8.5 * solar_factor
        micro_noise = (random.random() - 0.5) * 0.4
        self.state["temperature"] = round(base_temp + peak_temp_addon + micro_noise, 1)

        # 2. Solar Radiation
        self.state["solar_radiation"] = round(max(0.0, 950.0 * solar_factor + (random.random() - 0.5) * 30.0), 0)

        # 3. Ambient Humidity (inversely correlated to temperature + solar radiation)
        base_humidity = 85.0 - (solar_factor * 35.0)
        if self.state["rain_probability"] > 60:
            base_humidity += 15.0
        self.state["humidity"] = round(max(25.0, min(98.0, base_humidity + (random.random() - 0.5) * 2.0)), 1)

        # 4. Soil Temperature (lags ambient air temperature with thermal inertia)
        lag_factor = 0.15
        self.state["soil_temperature"] = round(
            self.state["soil_temperature"] * (1.0 - lag_factor) + (self.state["temperature"] * 0.9) * lag_factor, 1
        )

        # 5. Evapotranspiration and Soil Moisture
        # ET increases with solar radiation and high temp, drops with humidity
        et_rate = (0.2 + (solar_factor * 0.8) + (max(0.0, self.state["temperature"] - 25.0) * 0.05)) * (dt_hours)
        
        if self.state["rain_probability"] > 80 and random.random() < 0.2:
            # Sudden shower event
            self.state["soil_moisture"] = min(85.0, self.state["soil_moisture"] + 8.5)
            self.state["weather_condition"] = "Rain / Wet"
        else:
            self.state["soil_moisture"] = max(10.0, round(self.state["soil_moisture"] - et_rate, 1))

        # 6. Soil Nutrient Dynamics (Gradual plant uptake over days)
        uptake_rate = 0.02 * dt_hours
        self.state["nitrogen"] = max(12.0, round(self.state["nitrogen"] - (uptake_rate * 1.2), 1))
        self.state["phosphorus"] = max(8.0, round(self.state["phosphorus"] - (uptake_rate * 0.5), 1))
        self.state["potassium"] = max(10.0, round(self.state["potassium"] - (uptake_rate * 0.8), 1))

        # 7. Slow pH drift around 6.5
        ph_noise = (random.random() - 0.5) * 0.01
        self.state["ph"] = round(max(5.5, min(8.2, self.state["ph"] + ph_noise)), 2)

        # 8. Rain probability drift
        rain_drift = (random.random() - 0.5) * 2.0
        self.state["rain_probability"] = round(max(0.0, min(100.0, self.state["rain_probability"] + rain_drift)), 0)

        self._recalculate_health_and_risks()
        self.last_updated = time.time()
        return self.get_readings()

    def _recalculate_health_and_risks(self):
        """Calculates derived agricultural indices like Soil Health Score and Pest Risk."""
        # Soil Health Score Calculation (0 - 100)
        # Optimal benchmarks for Tomato / Loamy soil:
        # Moisture: 45-65%
        # Nitrogen: 40-70 mg/kg
        # Phosphorus: 25-50 mg/kg
        # Potassium: 35-60 mg/kg
        # pH: 6.0 - 7.0
        n_score = min(100, (self.state["nitrogen"] / 45.0) * 100)
        p_score = min(100, (self.state["phosphorus"] / 25.0) * 100)
        k_score = min(100, (self.state["potassium"] / 35.0) * 100)
        
        ph_dev = abs(self.state["ph"] - 6.5)
        ph_score = max(0, 100 - (ph_dev * 40))
        
        moist_score = 100 - min(100, abs(self.state["soil_moisture"] - 55.0) * 2.2)
        
        total_health = (n_score * 0.3) + (p_score * 0.15) + (k_score * 0.15) + (ph_score * 0.2) + (moist_score * 0.2)
        self.state["soil_health_score"] = int(max(10, min(99, round(total_health))))

        # Pest Risk Index: High humidity (>75%) + Warm temp (26-32°C) = High risk for BPH/Blight
        if self.state["humidity"] > 75 and 26 <= self.state["temperature"] <= 33:
            self.state["pest_risk"] = "High"
        elif self.state["humidity"] > 60:
            self.state["pest_risk"] = "Medium"
        else:
            self.state["pest_risk"] = "Low"

    def apply_irrigation(self, liters: float = 500.0, duration_minutes: int = 45):
        """Simulate farmer applying irrigation."""
        moisture_gain = min(35.0, (liters / 500.0) * 18.0)
        self.state["soil_moisture"] = min(88.0, round(self.state["soil_moisture"] + moisture_gain, 1))
        self._recalculate_health_and_risks()
        return self.get_readings()

    def apply_fertilizer(self, n_boost: float = 20.0, p_boost: float = 10.0, k_boost: float = 15.0):
        """Simulate applying organic or scheduled fertilizer."""
        self.state["nitrogen"] = round(self.state["nitrogen"] + n_boost, 1)
        self.state["phosphorus"] = round(self.state["phosphorus"] + p_boost, 1)
        self.state["potassium"] = round(self.state["potassium"] + k_boost, 1)
        self._recalculate_health_and_risks()
        return self.get_readings()

    def update_manual(self, field: str, value: float):
        """Allow manual developer override."""
        if field in self.state:
            self.state[field] = value
            self._recalculate_health_and_risks()
        return self.get_readings()

    def get_readings(self) -> Dict[str, Any]:
        return {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(self.last_updated)),
            "simulated_time": f"{int(self.state['hour_of_day']):02d}:{int((self.state['hour_of_day'] % 1) * 60):02d}",
            "readings": dict(self.state),
            "status": "online",
            "source": "Python Realistic Physics Simulator v1.0",
            "preset_mode": self.preset_mode
        }
