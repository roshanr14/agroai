"""
LangGraph Multi-Agent Orchestrator
Coordinates Soil, Weather, Pest, Irrigation, and Decision Agents across a structured state graph.
Enforces the lifecycle: SENSE → ANALYZE → PREDICT → DECIDE → RECOMMEND → NOTIFY → MONITOR
"""

import time
import uuid
from typing import Dict, Any, List

from backend.agents.soil_agent import SoilIntelligenceAgent
from backend.agents.weather_agent import WeatherIntelligenceAgent
from backend.agents.pest_agent import PestIntelligenceAgent
from backend.agents.irrigation_agent import IrrigationIntelligenceAgent
from backend.agents.decision_agent import AgriculturalDecisionAgent
from backend.services.notification_service import notification_service

class LangGraphOrchestrator:
    def __init__(self):
        self.soil_agent = SoilIntelligenceAgent()
        self.weather_agent = WeatherIntelligenceAgent()
        self.pest_agent = PestIntelligenceAgent()
        self.irrigation_agent = IrrigationIntelligenceAgent()
        self.decision_agent = AgriculturalDecisionAgent()
        
        # In-memory execution trace logs
        self.run_history: List[Dict[str, Any]] = []

    def run_cycle(
        self,
        farmer_profile: Dict[str, Any],
        raw_sensor_readings: Dict[str, Any],
        pest_target: str = None,
        farmer_query: str = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Executes one full multi-agent cycle through the state machine graph.
        """
        run_id = f"orch-{uuid.uuid4().hex[:8]}"
        start_time = time.time()
        agent_steps_trace = []

        # 1. State Initialization
        state = {
            "orchestrator_run_id": run_id,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "farmer_profile": farmer_profile,
            "farm_profile": {
                "name": farmer_profile.get("farm_name", "Green Valley Farm"),
                "acres": farmer_profile.get("farm_acres", 2.5),
                "soil_type": farmer_profile.get("soil_type", "Loamy")
            },
            "crop": {
                "name": farmer_profile.get("crop", "Tomato"),
                "variety": farmer_profile.get("crop_variety", "Hybrid Roma"),
                "stage": farmer_profile.get("crop_stage", "Vegetative Stage")
            },
            "soil_data": raw_sensor_readings,
            "weather_data": {
                "temperature": raw_sensor_readings.get("temperature", 31.0),
                "humidity": raw_sensor_readings.get("humidity", 68.0),
                "rain_probability": raw_sensor_readings.get("rain_probability", 72.0),
                "wind_speed": raw_sensor_readings.get("wind_speed", 12.0),
                "hour_of_day": raw_sensor_readings.get("hour_of_day", 14.0)
            },
            "agent_predictions": {},
            "risk_level": "Low",
            "recommendations": [],
            "status": "in_progress"
        }

        # Step A: Soil Agent Execution
        s_t0 = time.time()
        soil_result = self.soil_agent.analyze(state["soil_data"], state["crop"])
        state["agent_predictions"]["soil_agent"] = soil_result
        agent_steps_trace.append({
            "agent": "Soil Intelligence Agent",
            "status": "completed",
            "model": soil_result["model_used"],
            "duration_ms": int((time.time() - s_t0) * 1000),
            "output_summary": f"Soil Health: {soil_result['soil_health_score']}/100. pH: {soil_result['ph_status']}."
        })

        # Step B: Weather Agent Execution
        w_t0 = time.time()
        weather_result = self.weather_agent.analyze(state["weather_data"], state["crop"])
        state["agent_predictions"]["weather_agent"] = weather_result
        agent_steps_trace.append({
            "agent": "Weather Intelligence Agent",
            "status": "completed",
            "model": weather_result["model_used"],
            "duration_ms": int((time.time() - w_t0) * 1000),
            "output_summary": f"Rain Prob: {weather_result['rain_probability']}%. Heat: {weather_result['heat_risk']}."
        })

        # Step C: Pest Agent Execution
        p_t0 = time.time()
        pest_result = self.pest_agent.analyze(
            environmental_context=state["weather_data"],
            target_override=pest_target
        )
        state["agent_predictions"]["pest_agent"] = pest_result
        agent_steps_trace.append({
            "agent": "Pest Intelligence Agent",
            "status": "completed",
            "model": pest_result["model_used"],
            "duration_ms": int((time.time() - p_t0) * 1000),
            "output_summary": f"Condition: {pest_result['detected_condition']} ({pest_result['confidence_percentage']}%)."
        })

        # Step D: Irrigation Agent Execution
        i_t0 = time.time()
        irrig_result = self.irrigation_agent.evaluate_irrigation(
            soil_data=state["soil_data"],
            weather_data=state["weather_data"],
            crop_stage=state["crop"]["stage"]
        )
        state["agent_predictions"]["irrigation_agent"] = irrig_result
        agent_steps_trace.append({
            "agent": "Irrigation Intelligence Agent",
            "status": "completed",
            "model": irrig_result["model_architecture"],
            "duration_ms": int((time.time() - i_t0) * 1000),
            "output_summary": f"Decision: {irrig_result['decision_state']} (Window: {irrig_result['recommended_window']})."
        })

        # Step E: Central Decision Agent (LLM + RAG)
        d_t0 = time.time()
        decision_result = self.decision_agent.synthesize(
            farmer_profile=state["farmer_profile"],
            soil_analysis=soil_result,
            weather_analysis=weather_result,
            pest_analysis=pest_result,
            irrigation_analysis=irrig_result,
            farmer_query=farmer_query,
            language=language
        )
        state["agent_predictions"]["decision_agent"] = decision_result
        state["recommendations"] = decision_result["structured_recommendations"]
        agent_steps_trace.append({
            "agent": "Decision Agent (LLM + RAG)",
            "status": "completed",
            "model": decision_result["model_architecture"],
            "duration_ms": int((time.time() - d_t0) * 1000),
            "output_summary": f"Generated {len(state['recommendations'])} structured actions with RAG attribution."
        })

        # Step F: Autonomous SMS Alert Evaluation (Soil Deficiency check)
        phone = farmer_profile.get("phone_number", "+919876543210")
        if soil_result["deficiencies"] and farmer_profile.get("phone_verified", True):
            top_def = soil_result["deficiencies"][0]
            sms_msg = (
                f"AgriSense AI Alert\n\n"
                f"Your farm soil analysis indicates {top_def['status']} {top_def['nutrient']}.\n\n"
                f"Current: {top_def['value']}\n"
                f"Status: {top_def['status']}\n\n"
                f"Recommended action:\n{top_def['symptom']}\n\n"
                f"Open AgriSense AI for detailed recommendations."
            )
            # Evaluate cooldown and deliver
            sms_res = notification_service.send_sms(
                phone=phone,
                category="Soil",
                message=sms_msg,
                title="AgriSense AI Alert"
            )
            state["sms_dispatch"] = sms_res

        total_execution_ms = int((time.time() - start_time) * 1000)
        state["status"] = "completed"
        state["total_execution_time_ms"] = total_execution_ms
        state["execution_trace"] = agent_steps_trace

        self.run_history.insert(0, state)
        if len(self.run_history) > 20:
            self.run_history.pop()

        return state

# Global orchestrator instance
orchestrator = LangGraphOrchestrator()
