import os
import json
import socket
import threading
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from typing import Dict, Any, Optional, Callable

from config import INTEGRATION_PORT, MYSTIC_ORACLE_ROOT

class CrewAIIntegration:
    """
    Integration between CrewAI and the Mystic Oracle application.
    
    This class provides methods for:
    1. Starting a server to receive requests from the Mystic Oracle app
    2. Sending results back to the app
    3. Accessing app resources and data
    """
    
    def __init__(self):
        """Initialize the CrewAI integration."""
        self.server = None
        self.server_thread = None
        self.handlers = {}
        self.is_running = False
    
    def start_server(self):
        """Start the integration server."""
        if self.is_running:
            print("Server is already running.")
            return
        
        # Create a request handler that will use our handlers dictionary
        integration = self
        
        class RequestHandler(BaseHTTPRequestHandler):
            def do_POST(self):
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length).decode('utf-8')
                
                try:
                    data = json.loads(post_data)
                    action = data.get('action')
                    
                    if action in integration.handlers:
                        result = integration.handlers[action](data)
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps(result).encode('utf-8'))
                    else:
                        self.send_response(400)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps({
                            'error': f'Unknown action: {action}'
                        }).encode('utf-8'))
                
                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'error': str(e)
                    }).encode('utf-8'))
            
            def do_GET(self):
                if self.path == '/health':
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'status': 'ok',
                        'message': 'CrewAI integration server is running'
                    }).encode('utf-8'))
                else:
                    self.send_response(404)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'error': 'Not found'
                    }).encode('utf-8'))
        
        # Start the server in a separate thread
        def run_server():
            self.server = HTTPServer(('localhost', INTEGRATION_PORT), RequestHandler)
            print(f"CrewAI integration server started on port {INTEGRATION_PORT}")
            self.is_running = True
            self.server.serve_forever()
        
        self.server_thread = threading.Thread(target=run_server)
        self.server_thread.daemon = True
        self.server_thread.start()
    
    def stop_server(self):
        """Stop the integration server."""
        if self.server:
            self.server.shutdown()
            self.server = None
            self.is_running = False
            print("CrewAI integration server stopped")
    
    def register_handler(self, action: str, handler: Callable[[Dict[str, Any]], Dict[str, Any]]):
        """
        Register a handler for a specific action.
        
        Args:
            action: The action name
            handler: The handler function that takes a data dictionary and returns a result dictionary
        """
        self.handlers[action] = handler
    
    def send_to_app(self, endpoint: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Send data to the Mystic Oracle application.
        
        Args:
            endpoint: The endpoint to send data to
            data: The data to send
        
        Returns:
            Optional[Dict[str, Any]]: The response from the app, or None if there was an error
        """
        try:
            # Create a socket connection to the app
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect(('localhost', 7777))  # Assuming the app is running on port 7777
            
            # Prepare the request
            request = {
                'endpoint': endpoint,
                'data': data
            }
            
            # Send the request
            s.sendall(json.dumps(request).encode('utf-8'))
            
            # Receive the response
            response = b''
            while True:
                chunk = s.recv(4096)
                if not chunk:
                    break
                response += chunk
            
            # Close the connection
            s.close()
            
            # Parse and return the response
            return json.loads(response.decode('utf-8'))
        
        except Exception as e:
            print(f"Error sending data to app: {str(e)}")
            return None
    
    def get_app_resource(self, resource_path: str) -> Optional[str]:
        """
        Get a resource from the Mystic Oracle application.
        
        Args:
            resource_path: The path to the resource relative to the app root
        
        Returns:
            Optional[str]: The resource content, or None if there was an error
        """
        try:
            # Construct the absolute path to the resource
            abs_path = os.path.join(MYSTIC_ORACLE_ROOT, resource_path)
            
            # Check if the resource exists
            if not os.path.exists(abs_path):
                print(f"Resource not found: {resource_path}")
                return None
            
            # Read and return the resource
            with open(abs_path, 'r') as f:
                return f.read()
        
        except Exception as e:
            print(f"Error getting app resource: {str(e)}")
            return None


# Singleton instance
integration = CrewAIIntegration()

def start_integration_server():
    """Start the integration server."""
    integration.start_server()

def stop_integration_server():
    """Stop the integration server."""
    integration.stop_server()

def register_handler(action: str, handler: Callable[[Dict[str, Any]], Dict[str, Any]]):
    """Register a handler for a specific action."""
    integration.register_handler(action, handler)

def send_to_app(endpoint: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Send data to the Mystic Oracle application."""
    return integration.send_to_app(endpoint, data)

def get_app_resource(resource_path: str) -> Optional[str]:
    """Get a resource from the Mystic Oracle application."""
    return integration.get_app_resource(resource_path)
