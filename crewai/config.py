import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# OpenAI API configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# CrewAI configuration
VERBOSE = True  # Set to True for detailed logs
MAX_ITERATIONS = 5  # Maximum number of iterations for agents to work on tasks

# Integration configuration
MYSTIC_ORACLE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INTEGRATION_PORT = 8765  # Port for communication between CrewAI and MysticOracle

# Agent configuration
AGENT_TEMPERATURE = 0.7  # Controls randomness in agent responses (0.0 to 1.0)
AGENT_MODEL = "gpt-4o"  # Default model for agents

# Task configuration
TASK_TIMEOUT = 300  # Timeout for tasks in seconds
