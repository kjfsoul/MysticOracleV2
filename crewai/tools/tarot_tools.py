import os
import json
import random
from typing import List, Dict, Any, Optional
from crewai import Tool

class TarotTools:
    """
    Collection of tools for tarot-related operations.
    """
    
    @staticmethod
    def get_tarot_database_tool() -> Tool:
        """
        Creates a tool for accessing the tarot card database.
        
        Returns:
            Tool: A CrewAI tool for accessing tarot card data
        """
        def get_tarot_database(query: Optional[str] = None) -> List[Dict[str, Any]]:
            """
            Access the tarot card database with optional filtering.
            
            Args:
                query: Optional query string to filter cards (e.g., "arcana:major", "suit:cups")
            
            Returns:
                List[Dict[str, Any]]: List of tarot cards matching the query
            """
            # Path to the tarot database relative to the project root
            db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 
                                  "client/src/data/tarot-cards.ts")
            
            # If the file doesn't exist, return a sample database
            if not os.path.exists(db_path):
                return [
                    {
                        "id": "00-fool",
                        "name": "The Fool",
                        "arcana": "major",
                        "number": 0,
                        "keywords": ["beginnings", "innocence", "spontaneity", "free spirit"],
                        "meanings": {
                            "upright": ["Beginnings", "Innocence", "Adventure", "Optimism"],
                            "reversed": ["Recklessness", "Risk-taking", "Carelessness", "Naivety"]
                        }
                    },
                    {
                        "id": "01-magician",
                        "name": "The Magician",
                        "arcana": "major",
                        "number": 1,
                        "keywords": ["manifestation", "power", "action", "resourcefulness"],
                        "meanings": {
                            "upright": ["Manifestation", "Power", "Action", "Resourcefulness"],
                            "reversed": ["Manipulation", "Poor planning", "Untapped talents"]
                        }
                    }
                ]
            
            # Read the tarot database file
            with open(db_path, 'r') as f:
                content = f.read()
            
            # Extract the JSON data from the TypeScript file
            # This is a simple approach and might need adjustment based on the actual file format
            start_idx = content.find('export const allTarotCards = ')
            if start_idx != -1:
                start_idx = content.find('[', start_idx)
                end_idx = content.rfind(']') + 1
                json_str = content[start_idx:end_idx]
                
                # Convert TypeScript to valid JSON
                json_str = json_str.replace("'", '"')
                
                try:
                    cards = json.loads(json_str)
                except json.JSONDecodeError:
                    # Fallback to a simple parsing approach
                    cards = []
                    # Implementation would depend on the exact format of the file
            else:
                cards = []
            
            # Filter cards based on query if provided
            if query:
                filtered_cards = []
                for card in cards:
                    if query.lower() in json.dumps(card).lower():
                        filtered_cards.append(card)
                return filtered_cards
            
            return cards
        
        return Tool(
            name="TarotDatabase",
            description="Access the database of tarot cards with optional filtering",
            func=get_tarot_database
        )
    
    @staticmethod
    def get_daily_card_tool() -> Tool:
        """
        Creates a tool for selecting a daily tarot card.
        
        Returns:
            Tool: A CrewAI tool for selecting a daily card
        """
        def get_daily_card(seed: Optional[str] = None) -> Dict[str, Any]:
            """
            Select a daily tarot card, optionally based on a seed.
            
            Args:
                seed: Optional seed for deterministic selection (e.g., date string)
            
            Returns:
                Dict[str, Any]: The selected tarot card and whether it's reversed
            """
            # Get the tarot database
            tarot_db_tool = TarotTools.get_tarot_database_tool()
            cards = tarot_db_tool.func()
            
            # Set random seed if provided
            if seed:
                random.seed(seed)
            
            # Select a random card
            card = random.choice(cards)
            
            # Determine if the card is reversed (30% chance)
            is_reversed = random.random() < 0.3
            
            return {
                "card": card,
                "isReversed": is_reversed
            }
        
        return Tool(
            name="DailyTarotCard",
            description="Select a daily tarot card, optionally based on a seed",
            func=get_daily_card
        )
    
    @staticmethod
    def get_spread_tool() -> Tool:
        """
        Creates a tool for generating a tarot spread.
        
        Returns:
            Tool: A CrewAI tool for generating a tarot spread
        """
        def generate_spread(spread_type: str, seed: Optional[str] = None) -> List[Dict[str, Any]]:
            """
            Generate a tarot spread of the specified type.
            
            Args:
                spread_type: The type of spread (e.g., "three-card", "celtic-cross")
                seed: Optional seed for deterministic selection
            
            Returns:
                List[Dict[str, Any]]: The cards in the spread with positions and orientations
            """
            # Get the tarot database
            tarot_db_tool = TarotTools.get_tarot_database_tool()
            cards = tarot_db_tool.func()
            
            # Set random seed if provided
            if seed:
                random.seed(seed)
            
            # Define spread positions based on type
            positions = {
                "three-card": ["Past", "Present", "Future"],
                "celtic-cross": [
                    "Present", "Challenge", "Foundation", "Recent Past", 
                    "Potential", "Near Future", "Self", "Environment", 
                    "Hopes/Fears", "Outcome"
                ],
                "relationship": ["You", "Partner", "Relationship", "Outcome"],
                "career": ["Current Situation", "Obstacle", "Action", "Outcome"],
                "decision": ["Option A", "Option B", "Advice", "Outcome"]
            }
            
            # Use three-card as default if spread_type is not recognized
            spread_positions = positions.get(spread_type.lower(), positions["three-card"])
            
            # Shuffle the cards
            shuffled_cards = random.sample(cards, len(cards))
            
            # Generate the spread
            spread = []
            for i, position in enumerate(spread_positions):
                if i < len(shuffled_cards):
                    card = shuffled_cards[i]
                    is_reversed = random.random() < 0.3  # 30% chance of reversal
                    
                    spread.append({
                        "card": card,
                        "position": position,
                        "isReversed": is_reversed
                    })
            
            return spread
        
        return Tool(
            name="TarotSpread",
            description="Generate a tarot spread of the specified type",
            func=generate_spread
        )
