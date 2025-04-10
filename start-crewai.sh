#!/bin/bash

# Start CrewAI server script for Mystic Oracle

echo "Starting CrewAI server for Mystic Oracle..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "crewai/venv" ]; then
    echo "Error: Virtual environment not found. Please run setup first."
    exit 1
fi

# Activate virtual environment and start server
cd crewai
source venv/bin/activate
python main.py --crew integration

# This script should be run with:
# bash start-crewai.sh
