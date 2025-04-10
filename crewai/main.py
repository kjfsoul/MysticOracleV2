import os
import argparse
from dotenv import load_dotenv
from crewai import Crew, Process

# Load environment variables
load_dotenv()

# Import agents
from agents.tarot_agent import TarotAgents
from agents.astrology_agent import AstrologyAgents
from agents.development_agent import DevelopmentAgents

# Import tasks
from tasks.tarot_tasks import TarotTasks
from tasks.development_tasks import DevelopmentTasks

# Import tools
from tools.tarot_tools import TarotTools
from tools.development_tools import DevelopmentTools

# Import integration
from integration import start_integration_server, register_handler

def create_tarot_crew():
    """
    Create a crew for tarot-related tasks.
    
    Returns:
        Crew: A CrewAI crew for tarot tasks
    """
    # Create agents
    tarot_reader = TarotAgents.tarot_reader()
    tarot_historian = TarotAgents.tarot_historian()
    spiritual_guide = TarotAgents.spiritual_guide()
    
    # Add tools to agents
    tarot_reader.tools = [
        TarotTools.get_tarot_database_tool(),
        TarotTools.get_daily_card_tool(),
        TarotTools.get_spread_tool()
    ]
    
    tarot_historian.tools = [
        TarotTools.get_tarot_database_tool()
    ]
    
    # Create tasks
    daily_card_task = TarotTasks.generate_daily_card_reading(tarot_reader)
    three_card_spread_task = TarotTasks.generate_spread_reading(
        tarot_reader, 
        spread_type="three-card",
        question="What energies should I focus on today?"
    )
    
    # Create and return the crew
    return Crew(
        agents=[tarot_reader, tarot_historian, spiritual_guide],
        tasks=[daily_card_task, three_card_spread_task],
        verbose=True,
        process=Process.sequential
    )

def create_development_crew():
    """
    Create a crew for development-related tasks.
    
    Returns:
        Crew: A CrewAI crew for development tasks
    """
    # Create agents
    frontend_dev = DevelopmentAgents.frontend_developer()
    ui_designer = DevelopmentAgents.ui_designer()
    qa_tester = DevelopmentAgents.qa_tester()
    
    # Add tools to agents
    frontend_dev.tools = [
        DevelopmentTools.get_file_reader_tool(),
        DevelopmentTools.get_file_writer_tool(),
        DevelopmentTools.get_code_analyzer_tool(),
        DevelopmentTools.get_component_finder_tool()
    ]
    
    ui_designer.tools = [
        DevelopmentTools.get_file_reader_tool(),
        DevelopmentTools.get_component_finder_tool()
    ]
    
    qa_tester.tools = [
        DevelopmentTools.get_file_reader_tool()
    ]
    
    # Create tasks
    ui_analysis_task = DevelopmentTasks.analyze_ui_issues(ui_designer)
    
    # Create and return the crew
    return Crew(
        agents=[frontend_dev, ui_designer, qa_tester],
        tasks=[ui_analysis_task],
        verbose=True,
        process=Process.sequential
    )

def setup_integration_handlers():
    """Set up handlers for integration with the Mystic Oracle app."""
    
    def handle_daily_card(data):
        """Handle a request for a daily tarot card reading."""
        user_context = data.get('userContext')
        
        # Create a tarot crew
        crew = create_tarot_crew()
        
        # Run the crew and get the result
        result = crew.kickoff()
        
        return {
            'success': True,
            'reading': result
        }
    
    def handle_ui_analysis(data):
        """Handle a request for UI analysis."""
        screenshot_path = data.get('screenshotPath')
        
        # Create a development crew
        crew = create_development_crew()
        
        # Run the crew and get the result
        result = crew.kickoff()
        
        return {
            'success': True,
            'analysis': result
        }
    
    # Register handlers
    register_handler('getDailyCard', handle_daily_card)
    register_handler('analyzeUI', handle_ui_analysis)

def main():
    """Main entry point for the CrewAI application."""
    parser = argparse.ArgumentParser(description='Run CrewAI for Mystic Oracle')
    parser.add_argument('--crew', choices=['tarot', 'development', 'integration'], 
                        default='integration', help='The crew to run')
    
    args = parser.parse_args()
    
    if args.crew == 'tarot':
        # Run the tarot crew
        crew = create_tarot_crew()
        result = crew.kickoff()
        print("\n=== Tarot Crew Result ===")
        print(result)
    
    elif args.crew == 'development':
        # Run the development crew
        crew = create_development_crew()
        result = crew.kickoff()
        print("\n=== Development Crew Result ===")
        print(result)
    
    elif args.crew == 'integration':
        # Start the integration server
        print("Starting CrewAI integration server...")
        setup_integration_handlers()
        start_integration_server()
        
        # Keep the server running
        try:
            while True:
                import time
                time.sleep(1)
        except KeyboardInterrupt:
            print("Shutting down...")

if __name__ == "__main__":
    main()
