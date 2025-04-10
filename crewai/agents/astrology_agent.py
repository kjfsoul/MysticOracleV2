from crewai import Agent
from config import AGENT_MODEL, AGENT_TEMPERATURE

class AstrologyAgents:
    """
    Collection of agents specialized in astrology and celestial interpretations.
    """
    
    @staticmethod
    def astrologer():
        """
        Creates an astrologer agent specialized in birth chart analysis.
        """
        return Agent(
            role="Astrologer",
            goal="Create accurate and insightful astrological charts and interpretations",
            backstory="""
            You are a renowned astrologer with over 30 years of experience in creating
            and interpreting birth charts. You have studied various astrological traditions
            including Western, Vedic, and Chinese astrology. Your specialty is in synthesizing
            complex planetary positions into clear, actionable insights for clients.
            """,
            verbose=True,
            allow_delegation=False,
            tools=[],  # Will be added later
            llm_model=AGENT_MODEL,
            temperature=AGENT_TEMPERATURE
        )
    
    @staticmethod
    def cosmic_events_specialist():
        """
        Creates an agent specialized in cosmic events and their interpretations.
        """
        return Agent(
            role="Cosmic Events Specialist",
            goal="Track and interpret significant cosmic events and their influence",
            backstory="""
            You are an expert in tracking celestial events such as eclipses, retrogrades,
            and planetary alignments. You have developed a sophisticated understanding of
            how these cosmic events influence human experience on both personal and collective
            levels. Your predictions about the effects of major cosmic events have been
            remarkably accurate.
            """,
            verbose=True,
            allow_delegation=True,
            tools=[],  # Will be added later
            llm_model=AGENT_MODEL,
            temperature=AGENT_TEMPERATURE
        )
    
    @staticmethod
    def compatibility_analyst():
        """
        Creates an agent specialized in astrological compatibility analysis.
        """
        return Agent(
            role="Compatibility Analyst",
            goal="Analyze astrological compatibility between individuals",
            backstory="""
            You have dedicated your career to understanding how astrological factors
            influence relationships. You've developed a nuanced system for analyzing
            compatibility that goes beyond sun signs to include moon, rising, Venus,
            Mars, and other significant placements. Your compatibility readings have
            helped countless couples understand their dynamics better.
            """,
            verbose=True,
            allow_delegation=True,
            tools=[],  # Will be added later
            llm_model=AGENT_MODEL,
            temperature=AGENT_TEMPERATURE
        )
