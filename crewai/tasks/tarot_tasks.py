from crewai import Task
from config import MAX_ITERATIONS

class TarotTasks:
    """
    Collection of tasks related to tarot card reading and interpretation.
    """
    
    @staticmethod
    def generate_daily_card_reading(tarot_reader, user_context=None):
        """
        Creates a task for generating a daily tarot card reading.
        
        Args:
            tarot_reader: The tarot reader agent
            user_context: Optional context about the user
        
        Returns:
            Task: A CrewAI task for generating a daily tarot card reading
        """
        context = f"User context: {user_context}" if user_context else "No specific user context provided."
        
        return Task(
            description=f"""
            Generate a daily tarot card reading that provides insight and guidance.
            
            {context}
            
            Your task:
            1. Select an appropriate card for today based on cosmic energies
            2. Provide a detailed interpretation of the card
            3. Explain how the card's energy might manifest in the user's day
            4. Offer practical advice based on the card's message
            5. Format the reading in a way that's engaging and easy to understand
            
            The reading should be personalized, insightful, and actionable.
            """,
            agent=tarot_reader,
            expected_output="A complete daily tarot card reading with card selection, interpretation, and practical guidance.",
            max_iterations=MAX_ITERATIONS
        )
    
    @staticmethod
    def generate_spread_reading(tarot_reader, spread_type, question=None, user_context=None):
        """
        Creates a task for generating a tarot spread reading.
        
        Args:
            tarot_reader: The tarot reader agent
            spread_type: The type of spread (e.g., "three-card", "celtic-cross")
            question: Optional specific question from the user
            user_context: Optional context about the user
        
        Returns:
            Task: A CrewAI task for generating a tarot spread reading
        """
        question_context = f"Question: {question}" if question else "No specific question provided."
        user_info = f"User context: {user_context}" if user_context else "No specific user context provided."
        
        return Task(
            description=f"""
            Generate a {spread_type} tarot spread reading that provides deep insight and guidance.
            
            {question_context}
            {user_info}
            
            Your task:
            1. Select appropriate cards for the {spread_type} spread
            2. Provide a detailed interpretation of each card in its position
            3. Analyze the relationships between the cards
            4. Synthesize an overall message from the spread
            5. Offer practical advice based on the spread's message
            6. Format the reading in a way that's engaging and easy to understand
            
            The reading should be personalized, insightful, and actionable.
            """,
            agent=tarot_reader,
            expected_output=f"A complete {spread_type} tarot spread reading with card selections, interpretations, and practical guidance.",
            max_iterations=MAX_ITERATIONS
        )
    
    @staticmethod
    def research_card_symbolism(tarot_historian, card_name):
        """
        Creates a task for researching the symbolism of a specific tarot card.
        
        Args:
            tarot_historian: The tarot historian agent
            card_name: The name of the card to research
        
        Returns:
            Task: A CrewAI task for researching card symbolism
        """
        return Task(
            description=f"""
            Research and compile detailed information about the symbolism of the {card_name} tarot card.
            
            Your task:
            1. Research the historical origins of the {card_name}
            2. Analyze the visual elements and symbols on the card
            3. Explain the traditional interpretations across different tarot systems
            4. Explore how the symbolism has evolved over time
            5. Compile a comprehensive report on the card's symbolism
            
            The research should be thorough, accurate, and well-organized.
            """,
            agent=tarot_historian,
            expected_output=f"A comprehensive report on the symbolism of the {card_name} tarot card.",
            max_iterations=MAX_ITERATIONS
        )
