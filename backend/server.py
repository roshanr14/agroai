"""
AgriSense AI Backend HTTP Server
Provides REST APIs for:
- Sensor Simulation (Diurnal cycle, Presets, Manual Override)
- LangGraph Multi-Agent Orchestration
- Pest Image Diagnostics
- Multilingual RAG Farm Advisor (Chat + Voice)
- SMS Notification Engine (Fast2SMS / Twilio / Console fallback)
"""

import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Add root directory to sys.path so modules resolve cleanly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.services.sensor_simulator import AgriculturalSensorSimulator
from backend.services.notification_service import notification_service
from backend.orchestrator import orchestrator
from backend.knowledge_base.agricultural_rag import AgriculturalKnowledgeRAG

simulator = AgriculturalSensorSimulator()

class AgriSenseHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/health":
            self._set_headers()
            self.wfile.write(json.dumps({"status": "healthy", "service": "AgriSense AI Multi-Agent Platform"}).encode())

        elif path == "/api/sensors/current":
            self._set_headers()
            readings = simulator.get_readings()
            self.wfile.write(json.dumps(readings).encode())

        elif path == "/api/sensors/history":
            # Generate 24-point historical trend
            history = []
            curr = simulator.get_readings()["readings"]
            base_moist = curr["soil_moisture"]
            base_n = curr["nitrogen"]
            base_temp = curr["temperature"]
            
            for i in range(24, 0, -1):
                history.append({
                    "time": f"{i}h ago",
                    "moisture": round(max(15, base_moist + (i * 0.4) - 5.0), 1),
                    "nitrogen": round(max(20, base_n + (i * 0.2)), 1),
                    "phosphorus": round(curr["phosphorus"] + (i * 0.05), 1),
                    "potassium": round(curr["potassium"] + (i * 0.08), 1),
                    "temp": round(base_temp - (i % 6) + 2.0, 1),
                    "soil_health": round(max(40, curr["soil_health_score"] - (i * 0.2)))
                })
            self._set_headers()
            self.wfile.write(json.dumps(history).encode())

        elif path == "/api/sms/logs":
            self._set_headers()
            self.wfile.write(json.dumps(notification_service.get_history()).encode())

        elif path == "/api/orchestrator/latest":
            self._set_headers()
            last_run = orchestrator.run_history[0] if orchestrator.run_history else None
            self.wfile.write(json.dumps({"latest_run": last_run}).encode())

        elif path == "/api/knowledge/documents":
            self._set_headers()
            self.wfile.write(json.dumps(AgriculturalKnowledgeRAG.KNOWLEDGE_DOCUMENTS).encode())

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode())

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get("Content-Length", 0))
        body = {}
        if content_length > 0:
            raw_body = self.rfile.read(content_length).decode("utf-8")
            try:
                body = json.loads(raw_body)
            except Exception:
                body = {}

        if path == "/api/sensors/tick":
            elapsed = float(body.get("elapsed_minutes", 15.0))
            updated = simulator.tick(elapsed)
            self._set_headers()
            self.wfile.write(json.dumps(updated).encode())

        elif path == "/api/sensors/preset":
            preset = body.get("preset", "normal")
            updated = simulator.set_preset(preset)
            self._set_headers()
            self.wfile.write(json.dumps(updated).encode())

        elif path == "/api/sensors/override":
            field = body.get("field")
            value = float(body.get("value", 0))
            updated = simulator.update_manual(field, value)
            self._set_headers()
            self.wfile.write(json.dumps(updated).encode())

        elif path == "/api/orchestrator/run":
            farmer_profile = body.get("farmer_profile", {
                "farmer_name": "Murugan S.",
                "farm_name": "Green Valley Farm",
                "phone_number": "+919876543210",
                "phone_verified": True,
                "crop": "Tomato",
                "crop_variety": "Hybrid Roma",
                "crop_stage": "Vegetative Stage",
                "soil_type": "Loamy",
                "farm_acres": 2.5
            })
            pest_target = body.get("pest_target")
            farmer_query = body.get("farmer_query")
            language = body.get("language", "en")
            
            readings = simulator.get_readings()["readings"]
            result = orchestrator.run_cycle(
                farmer_profile=farmer_profile,
                raw_sensor_readings=readings,
                pest_target=pest_target,
                farmer_query=farmer_query,
                language=language
            )
            self._set_headers()
            self.wfile.write(json.dumps(result).encode())

        elif path == "/api/pest/detect":
            condition_key = body.get("condition_key")
            env_readings = simulator.get_readings()["readings"]
            result = orchestrator.pest_agent.analyze(
                environmental_context=env_readings,
                target_override=condition_key
            )
            self._set_headers()
            self.wfile.write(json.dumps(result).encode())

        elif path == "/api/advisor/chat":
            message = body.get("message", "")
            language = body.get("language", "en")
            farmer_profile = body.get("farmer_profile", {
                "crop": "Tomato",
                "crop_stage": "Vegetative Stage",
                "farm_name": "Green Valley Farm"
            })
            
            # Execute agents with question context
            readings = simulator.get_readings()["readings"]
            result = orchestrator.run_cycle(
                farmer_profile=farmer_profile,
                raw_sensor_readings=readings,
                farmer_query=message,
                language=language
            )
            conv = result["agent_predictions"]["decision_agent"]["conversational_response"]
            
            self._set_headers()
            self.wfile.write(json.dumps({
                "query": message,
                "answer": conv["response_text"],
                "language": conv["language"],
                "grounded_source": conv["grounded_source"],
                "grounded_fact": conv["grounded_fact"],
                "disclaimer": conv["disclaimer"],
                "recommendations": result["recommendations"],
                "farm_health": result["agent_predictions"]["decision_agent"]["overall_farm_health_score"]
            }).encode())

        elif path == "/api/sms/send":
            phone = body.get("phone", "+919876543210")
            category = body.get("category", "General")
            message = body.get("message", "AgriSense AI Farm Status: All systems healthy.")
            title = body.get("title", "AgriSense AI Alert")
            force = body.get("force", False)

            res = notification_service.send_sms(
                phone=phone,
                category=category,
                message=message,
                title=title,
                force=force
            )
            self._set_headers()
            self.wfile.write(json.dumps(res).encode())

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode())

def run(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, AgriSenseHandler)
    print(f"AgriSense AI Backend HTTP Server running on http://127.0.0.1:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
