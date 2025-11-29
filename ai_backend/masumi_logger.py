"""
Masumi Logger Integration
Logs all AI agent activities and API calls to Masumi monitoring platform
"""

import requests
import json
from datetime import datetime
import os
import logging

logger = logging.getLogger(__name__)

class MasumiLogger:
    """Log AI agent activities to Masumi platform"""
    
    def __init__(self, masumi_api_key, masumi_endpoint="https://masumi.io/api"):
        """
        Initialize Masumi Logger
        
        Args:
            masumi_api_key: Your Masumi API key
            masumi_endpoint: Masumi API endpoint (default: masumi.io)
        """
        self.api_key = masumi_api_key
        self.endpoint = masumi_endpoint.rstrip('/')
        self.headers = {
            "Authorization": f"Bearer {masumi_api_key}",
            "Content-Type": "application/json"
        }
        self.service_name = "cardano-insights-api"
        
    def _make_request(self, method, path, payload):
        """Make HTTP request to Masumi API"""
        try:
            url = f"{self.endpoint}{path}"
            
            if method == "POST":
                response = requests.post(url, json=payload, headers=self.headers, timeout=10)
            elif method == "GET":
                response = requests.get(url, headers=self.headers, timeout=10)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response.status_code, response.text
            
        except requests.RequestException as e:
            logger.error(f"Masumi API request failed: {str(e)}")
            return None, str(e)
    
    def log_agent_activity(self, agent_name, action, status, details=None):
        """
        Log AI agent activity
        
        Args:
            agent_name: Name of the AI agent (e.g., "Senior Financial Analyst")
            action: Action performed (e.g., "generate_insights")
            status: Status of action ("success", "error", "pending")
            details: Additional details (dict)
        """
        try:
            payload = {
                "timestamp": datetime.utcnow().isoformat(),
                "service": self.service_name,
                "agent_name": agent_name,
                "action": action,
                "status": status,
                "details": details or {}
            }
            
            status_code, response = self._make_request("POST", "/logs", payload)
            
            if status_code and 200 <= status_code < 300:
                logger.info(f"✅ Masumi logged: {agent_name} - {action} ({status})")
                return True
            else:
                logger.warning(f"❌ Masumi error ({status_code}): {response}")
                return False
                
        except Exception as e:
            logger.error(f"Error logging to Masumi: {str(e)}")
            return False
    
    def log_insights_generation(self, user_id, transaction_count, result_status, duration_ms=None):
        """Log insights generation activity"""
        self.log_agent_activity(
            agent_name="Senior Financial Analyst",
            action="generate_insights",
            status=result_status,
            details={
                "user_id": user_id,
                "transaction_count": transaction_count,
                "duration_ms": duration_ms,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    def log_csv_export(self, transaction_count, file_size_bytes, status):
        """Log CSV export activity"""
        self.log_agent_activity(
            agent_name="CSV Exporter",
            action="export_transactions",
            status=status,
            details={
                "transaction_count": transaction_count,
                "file_size_bytes": file_size_bytes,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    def log_api_call(self, endpoint, method, status_code, duration_ms, error=None):
        """Log API endpoint calls"""
        self.log_agent_activity(
            agent_name="Flask API",
            action=f"{method} {endpoint}",
            status="success" if status_code < 400 else "error",
            details={
                "status_code": status_code,
                "duration_ms": duration_ms,
                "error": error,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    def log_gemini_call(self, model, tokens_used, status, duration_ms=None):
        """Log Gemini LLM API calls"""
        self.log_agent_activity(
            agent_name="Gemini LLM",
            action="generate_response",
            status=status,
            details={
                "model": model,
                "tokens_used": tokens_used,
                "duration_ms": duration_ms,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    def log_mongodb_query(self, collection, query_type, document_count, duration_ms, status):
        """Log MongoDB query activities"""
        self.log_agent_activity(
            agent_name="MongoDB",
            action=f"query_{query_type}",
            status=status,
            details={
                "collection": collection,
                "document_count": document_count,
                "duration_ms": duration_ms,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    def log_error(self, component, error_message, error_type="exception"):
        """Log errors and exceptions"""
        self.log_agent_activity(
            agent_name=component,
            action="error",
            status="error",
            details={
                "error_message": error_message,
                "error_type": error_type,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    def log_performance_metric(self, metric_name, value, unit="ms"):
        """Log performance metrics"""
        self.log_agent_activity(
            agent_name="Performance Monitor",
            action="metric",
            status="success",
            details={
                "metric_name": metric_name,
                "value": value,
                "unit": unit,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    def get_agent_logs(self, agent_name, limit=50):
        """Retrieve logs for a specific agent"""
        try:
            url = f"{self.endpoint}/logs?agent_name={agent_name}&limit={limit}"
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.warning(f"Failed to fetch logs: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error fetching logs from Masumi: {str(e)}")
            return None
    
    def get_service_health(self):
        """Get service health status"""
        try:
            url = f"{self.endpoint}/health"
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"status": "unknown", "code": response.status_code}
                
        except Exception as e:
            logger.error(f"Error checking Masumi health: {str(e)}")
            return {"status": "error", "message": str(e)}


def get_masumi_logger():
    """Factory function to create MasumiLogger instance from environment"""
    api_key = os.getenv('MASUMI_API_KEY')
    endpoint = os.getenv('MASUMI_ENDPOINT', 'https://masumi.io/api')
    
    if not api_key:
        logger.warning("MASUMI_API_KEY not found in environment - logging disabled")
        return None
    
    return MasumiLogger(api_key, endpoint)
