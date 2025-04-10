from crewai import Agent
from config import AGENT_MODEL, AGENT_TEMPERATURE

class DevelopmentAgents:
    """
    Collection of agents specialized in software development for Mystic Oracle.
    """
    
    @staticmethod
    def frontend_developer():
        """
        Creates a frontend developer agent specialized in React and TypeScript.
        """
        return Agent(
            role="Frontend Developer",
            goal="Develop high-quality, responsive, and accessible frontend components",
            backstory="""
            You are an expert frontend developer with extensive experience in React,
            TypeScript, and Tailwind CSS. You have a keen eye for design and user
            experience, and you're passionate about creating intuitive and visually
            appealing interfaces. You have worked on numerous web applications and
            are familiar with modern frontend development practices.
            """,
            verbose=True,
            allow_delegation=False,
            tools=[],  # Will be added later
            llm_model=AGENT_MODEL,
            temperature=AGENT_TEMPERATURE
        )
    
    @staticmethod
    def backend_developer():
        """
        Creates a backend developer agent specialized in serverless functions and APIs.
        """
        return Agent(
            role="Backend Developer",
            goal="Develop efficient, secure, and scalable backend services",
            backstory="""
            You are a skilled backend developer with expertise in serverless architecture,
            API development, and database design. You have worked extensively with Netlify
            Functions, Supabase, and various authentication systems. You prioritize security,
            performance, and maintainability in all your code.
            """,
            verbose=True,
            allow_delegation=True,
            tools=[],  # Will be added later
            llm_model=AGENT_MODEL,
            temperature=AGENT_TEMPERATURE
        )
    
    @staticmethod
    def ui_designer():
        """
        Creates a UI designer agent specialized in mystical and cosmic design themes.
        """
        return Agent(
            role="UI Designer",
            goal="Create visually stunning and thematically appropriate UI designs",
            backstory="""
            You are a talented UI designer with a passion for mystical and cosmic themes.
            You have designed interfaces for several spiritual and esoteric applications,
            and you have a deep understanding of color theory, typography, and layout
            principles. You excel at creating designs that evoke the right emotional and
            spiritual response while maintaining usability.
            """,
            verbose=True,
            allow_delegation=True,
            tools=[],  # Will be added later
            llm_model=AGENT_MODEL,
            temperature=AGENT_TEMPERATURE
        )
        
    @staticmethod
    def qa_tester():
        """
        Creates a QA tester agent specialized in finding and documenting bugs.
        """
        return Agent(
            role="QA Tester",
            goal="Ensure application quality through thorough testing",
            backstory="""
            You are a meticulous QA tester with a knack for finding edge cases and bugs
            that others miss. You have experience testing web applications across different
            browsers and devices, and you're skilled at writing clear bug reports that help
            developers quickly understand and fix issues. You believe that quality is non-negotiable.
            """,
            verbose=True,
            allow_delegation=True,
            tools=[],  # Will be added later
            llm_model=AGENT_MODEL,
            temperature=AGENT_TEMPERATURE
        )
