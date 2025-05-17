# CrewAI Integration for Mystic Oracle

This directory contains the CrewAI integration for the Mystic Oracle application. CrewAI is a framework for creating and orchestrating autonomous AI agents that can work together to accomplish complex tasks.

## Overview

The CrewAI integration provides the following capabilities:

1. **Tarot Reading Generation**: AI agents that can generate personalized tarot readings
2. **UI Analysis and Improvement**: AI agents that can analyze and improve the UI of the application
3. **Development Assistance**: AI agents that can assist with development tasks
4. **Integration with Mystic Oracle**: A server that allows the Mystic Oracle application to communicate with CrewAI

## Directory Structure

- `agents/`: Contains agent definitions for different domains
- `tasks/`: Contains task definitions for different domains
- `tools/`: Contains tool definitions for different domains
- `integration.py`: Provides integration with the Mystic Oracle application
- `main.py`: Main entry point for the CrewAI application
- `config.py`: Configuration for the CrewAI application
- `.env`: Environment variables for the CrewAI application

## Getting Started

### Prerequisites

- Python 3.9 or higher
- OpenAI API key

### Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install crewai
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to `.env`

### Running CrewAI

#### Running a Specific Crew

To run a specific crew:

```bash
python main.py --crew tarot
```

Available crews:
- `tarot`: Run the tarot crew for generating tarot readings
- `development`: Run the development crew for UI analysis and improvement

#### Running the Integration Server

To run the integration server that allows Mystic Oracle to communicate with CrewAI:

```bash
python main.py --crew integration
```

This will start a server on port 8765 that listens for requests from the Mystic Oracle application.

## Integration with Mystic Oracle

The CrewAI integration server provides endpoints that the Mystic Oracle application can call to use CrewAI's capabilities. The integration is done through HTTP requests to the server.

### Available Endpoints

- `/getDailyCard`: Generate a daily tarot card reading
- `/analyzeUI`: Analyze the UI of the application and provide improvement suggestions

### Example Usage

```javascript
// In Mystic Oracle application
async function getDailyCardReading() {
  const response = await fetch('http://localhost:8765/getDailyCard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'getDailyCard',
      userContext: {
        username: 'user123',
        preferences: {
          readingStyle: 'detailed',
        },
      },
    }),
  });

  const data = await response.json();
  return data.reading;
}
```

## Customization

### Adding New Agents

To add a new agent, create a new file in the `agents/` directory and define your agent class. Then, import and use it in `main.py`.

### Adding New Tasks

To add a new task, create a new file in the `tasks/` directory and define your task class. Then, import and use it in `main.py`.

### Adding New Tools

To add a new tool, create a new file in the `tools/` directory and define your tool class. Then, import and use it in `main.py`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
