from crewai import Task
from config import MAX_ITERATIONS

class DevelopmentTasks:
    """
    Collection of tasks related to software development for Mystic Oracle.
    """
    
    @staticmethod
    def analyze_ui_issues(ui_designer, screenshot_path=None):
        """
        Creates a task for analyzing UI issues from a screenshot.
        
        Args:
            ui_designer: The UI designer agent
            screenshot_path: Optional path to a screenshot
        
        Returns:
            Task: A CrewAI task for analyzing UI issues
        """
        screenshot_context = f"Screenshot available at: {screenshot_path}" if screenshot_path else "No screenshot provided."
        
        return Task(
            description=f"""
            Analyze the UI of the Mystic Oracle application and identify issues and improvements.
            
            {screenshot_context}
            
            Your task:
            1. Identify any visual inconsistencies or design flaws
            2. Analyze the layout and spacing issues
            3. Evaluate the color scheme and typography
            4. Assess the overall user experience and navigation flow
            5. Identify accessibility concerns
            6. Provide specific recommendations for improvements
            
            The analysis should be detailed, constructive, and actionable.
            """,
            agent=ui_designer,
            expected_output="A comprehensive analysis of UI issues with specific recommendations for improvements.",
            max_iterations=MAX_ITERATIONS
        )
    
    @staticmethod
    def implement_component(frontend_developer, component_name, requirements):
        """
        Creates a task for implementing a frontend component.
        
        Args:
            frontend_developer: The frontend developer agent
            component_name: The name of the component to implement
            requirements: The requirements for the component
        
        Returns:
            Task: A CrewAI task for implementing a component
        """
        return Task(
            description=f"""
            Implement the {component_name} component according to the provided requirements.
            
            Requirements:
            {requirements}
            
            Your task:
            1. Design the component structure and interface
            2. Implement the component using React and TypeScript
            3. Style the component using Tailwind CSS
            4. Ensure the component is responsive and accessible
            5. Add appropriate tests for the component
            6. Document the component's usage and props
            
            The implementation should be clean, efficient, and follow best practices.
            """,
            agent=frontend_developer,
            expected_output=f"Complete implementation of the {component_name} component with code, tests, and documentation.",
            max_iterations=MAX_ITERATIONS
        )
    
    @staticmethod
    def implement_api_endpoint(backend_developer, endpoint_name, requirements):
        """
        Creates a task for implementing an API endpoint.
        
        Args:
            backend_developer: The backend developer agent
            endpoint_name: The name of the endpoint to implement
            requirements: The requirements for the endpoint
        
        Returns:
            Task: A CrewAI task for implementing an API endpoint
        """
        return Task(
            description=f"""
            Implement the {endpoint_name} API endpoint according to the provided requirements.
            
            Requirements:
            {requirements}
            
            Your task:
            1. Design the endpoint structure and interface
            2. Implement the endpoint using Netlify Functions
            3. Set up appropriate database interactions with Supabase
            4. Implement authentication and authorization
            5. Add error handling and validation
            6. Document the endpoint's usage and parameters
            
            The implementation should be secure, efficient, and follow best practices.
            """,
            agent=backend_developer,
            expected_output=f"Complete implementation of the {endpoint_name} API endpoint with code and documentation.",
            max_iterations=MAX_ITERATIONS
        )
    
    @staticmethod
    def test_feature(qa_tester, feature_name, test_scenarios):
        """
        Creates a task for testing a feature.
        
        Args:
            qa_tester: The QA tester agent
            feature_name: The name of the feature to test
            test_scenarios: The test scenarios to cover
        
        Returns:
            Task: A CrewAI task for testing a feature
        """
        return Task(
            description=f"""
            Test the {feature_name} feature according to the provided test scenarios.
            
            Test Scenarios:
            {test_scenarios}
            
            Your task:
            1. Design test cases for each scenario
            2. Execute the test cases
            3. Document any bugs or issues found
            4. Provide detailed reproduction steps for each issue
            5. Suggest potential fixes or improvements
            6. Compile a comprehensive test report
            
            The testing should be thorough, methodical, and well-documented.
            """,
            agent=qa_tester,
            expected_output=f"A comprehensive test report for the {feature_name} feature with documented issues and recommendations.",
            max_iterations=MAX_ITERATIONS
        )
