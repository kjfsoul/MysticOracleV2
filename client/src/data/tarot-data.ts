
export interface TarotCardData {
  id: string;
  name: string;
  arcana: string;
  number: string;
  suit?: string;
  imageUrl: string;
  keywords: string[];
  description: string;
}

export interface CardDefinition {
  id: string;
  name: string;
  number: string;
  arcana: string;
  suit?: string;
  imageUrl?: string;
  meaning: string;
}

export const majorArcanaCards: TarotCardData[] = [
  {
    id: "major-0",
    name: "The Fool",
    arcana: "major",
    number: "0",
    imageUrl: "/images/tarot/major/the-fool.jpg",
    keywords: ["beginnings", "innocence", "spontaneity", "free spirit"],
    description: "The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner's luck, improvisation and believing in the universe."
  },
  {
    id: "major-1",
    name: "The Magician",
    arcana: "major",
    number: "I",
    imageUrl: "/images/tarot/major/the-magician.jpg",
    keywords: ["manifestation", "resourcefulness", "power", "inspired action"],
    description: "The Magician represents your ability to communicate clearly, to manifest your desires, and to make use of the tools available to you."
  },
  {
    id: "major-2",
    name: "The High Priestess",
    arcana: "major",
    number: "II",
    imageUrl: "/images/tarot/major/high-priestess.jpg",
    keywords: ["intuition", "sacred knowledge", "divine feminine", "subconscious mind"],
    description: "The High Priestess represents secrets, mystery, intuition, wisdom, and knowledge that is not yet manifested."
  },
  {
    id: "major-3",
    name: "The Empress",
    arcana: "major",
    number: "III",
    imageUrl: "/images/tarot/major/the-empress.jpg",
    keywords: ["abundance", "nurturing", "fertility", "creativity"],
    description: "The Empress represents fertility, nurturing, abundance, nature, and sensuality. She indicates material comfort, artistic ability, and enjoyment of life's pleasures."
  },
  {
    id: "major-4",
    name: "The Emperor",
    arcana: "major",
    number: "IV",
    imageUrl: "/images/tarot/major/the-emperor.jpg",
    keywords: ["authority", "structure", "leadership", "stability"],
    description: "The Emperor represents authority, structure, leadership, and organization. He signifies solid foundations, established order, and confidence in one's powers."
  },
  {
    id: "major-5",
    name: "The Hierophant",
    arcana: "major",
    number: "V",
    imageUrl: "/images/tarot/major/the-hierophant.jpg",
    keywords: ["tradition", "spiritual wisdom", "conformity", "education"],
    description: "The Hierophant represents tradition, established institutions, education, spiritual wisdom, and conformity. He indicates formal learning, adherence to rules, and organized belief systems."
  },
  {
    id: "major-6",
    name: "The Lovers",
    arcana: "major",
    number: "VI",
    imageUrl: "/images/tarot/major/the-lovers.jpg",
    keywords: ["love", "harmony", "choices", "alignment"],
    description: "The Lovers represents relationships, choices, alignment of values, and harmony. This card suggests significant decisions regarding partnerships, beliefs, or personal principles."
  },
  {
    id: "major-7",
    name: "The Chariot",
    arcana: "major",
    number: "VII",
    imageUrl: "/images/tarot/major/the-chariot.jpg",
    keywords: ["determination", "willpower", "victory", "direction"],
    description: "The Chariot represents determination, willpower, victory, and overcoming obstacles. It signifies focused intention, harnessed energy, and confident direction."
  },
  {
    id: "major-8",
    name: "Strength",
    arcana: "major",
    number: "VIII",
    imageUrl: "/images/tarot/major/strength.jpg",
    keywords: ["courage", "inner strength", "compassion", "patience"],
    description: "Strength represents inner courage, fortitude, compassion, and patience. It signifies the ability to overcome challenges through inner resolve rather than brute force."
  },
  {
    id: "major-9",
    name: "The Hermit",
    arcana: "major",
    number: "IX",
    imageUrl: "/images/tarot/major/the-hermit.jpg",
    keywords: ["introspection", "solitude", "inner guidance", "contemplation"],
    description: "The Hermit represents soul-searching, introspection, and inner guidance. This card suggests a period of deliberate solitude for greater understanding and personal growth."
  },
  {
    id: "major-10",
    name: "Wheel of Fortune",
    arcana: "major",
    number: "X",
    imageUrl: "/images/tarot/major/wheel-of-fortune.jpg",
    keywords: ["cycles", "fate", "turning point", "opportunity"],
    description: "The Wheel of Fortune represents life cycles, destiny, turning points, and opportunities. It signifies that change is inevitable and that fate may be taking a hand in current events."
  },
  {
    id: "major-11",
    name: "Justice",
    arcana: "major",
    number: "XI",
    imageUrl: "/images/tarot/major/justice.jpg",
    keywords: ["fairness", "truth", "cause and effect", "law"],
    description: "Justice represents fairness, truth, and the law of cause and effect. This card suggests impartiality, the need for balance, and accepting the consequences of one's actions."
  },
  {
    id: "major-12",
    name: "The Hanged Man",
    arcana: "major",
    number: "XII",
    imageUrl: "/images/tarot/major/the-hanged-man.jpg",
    keywords: ["surrender", "new perspective", "letting go", "sacrifice"],
    description: "The Hanged Man represents surrender, new perspectives, and suspension in time. It signifies a need to let go or sacrifice something to gain spiritual insight."
  },
  {
    id: "major-13",
    name: "Death",
    arcana: "major",
    number: "XIII",
    imageUrl: "/images/tarot/major/death.jpg",
    keywords: ["transformation", "endings", "transition", "renewal"],
    description: "Death represents profound transformation, endings, and renewal. This card suggests that something in your life needs to end to make way for a new beginning."
  },
  {
    id: "major-14",
    name: "Temperance",
    arcana: "major",
    number: "XIV",
    imageUrl: "/images/tarot/major/temperance.jpg",
    keywords: ["balance", "moderation", "patience", "purpose"],
    description: "Temperance represents balance, moderation, and patience. It signifies finding harmony, having a clear sense of purpose, and combining disparate elements into a unified whole."
  },
  {
    id: "major-15",
    name: "The Devil",
    arcana: "major",
    number: "XV",
    imageUrl: "/images/tarot/major/the-devil.jpg",
    keywords: ["shadow self", "attachment", "addiction", "restriction"],
    description: "The Devil represents shadow aspects, attachments, and self-imposed restrictions. This card suggests bondage to material concerns or unhealthy patterns that limit freedom."
  },
  {
    id: "major-16",
    name: "The Tower",
    arcana: "major",
    number: "XVI",
    imageUrl: "/images/tarot/major/the-tower.jpg",
    keywords: ["sudden change", "revelation", "upheaval", "awakening"],
    description: "The Tower represents sudden change, revelation, and upheaval. This card suggests a lightning bolt of truth that shatters illusions and forces rapid transformation."
  },
  {
    id: "major-17",
    name: "The Star",
    arcana: "major",
    number: "XVII",
    imageUrl: "/images/tarot/major/the-star.jpg",
    keywords: ["hope", "faith", "renewal", "inspiration"],
    description: "The Star represents hope, renewal, inspiration, and serenity. This card suggests healing, finding one's purpose, and having faith in the universe during challenging times."
  },
  {
    id: "major-18",
    name: "The Moon",
    arcana: "major",
    number: "XVIII",
    imageUrl: "/images/tarot/major/the-moon.jpg",
    keywords: ["illusion", "fear", "subconscious", "intuition"],
    description: "The Moon represents the realm of illusion, fear, and the subconscious. This card suggests a time of heightened intuition but also potential confusion or uncertainty."
  },
  {
    id: "major-19",
    name: "The Sun",
    arcana: "major",
    number: "XIX",
    imageUrl: "/images/tarot/major/the-sun.jpg",
    keywords: ["joy", "success", "celebration", "vitality"],
    description: "The Sun represents joy, success, celebration, and vitality. This card suggests illumination of truth, achievements recognized, and a time of happiness and positive energy."
  },
  {
    id: "major-20",
    name: "Judgement",
    arcana: "major",
    number: "XX",
    imageUrl: "/images/tarot/major/judgement.jpg",
    keywords: ["reflection", "reckoning", "awakening", "rebirth"],
    description: "Judgement represents reflection, reckoning, and spiritual awakening. This card suggests hearing a calling, making a life assessment, and preparing for rebirth or renewal."
  },
  {
    id: "major-21",
    name: "The World",
    arcana: "major",
    number: "XXI",
    imageUrl: "/images/tarot/major/the-world.jpg",
    keywords: ["completion", "achievement", "fulfillment", "wholeness"],
    description: "The World represents completion, achievement, fulfillment, and harmony. This card suggests reaching the end of a cycle, attaining a significant goal, and feeling a sense of wholeness."
  }
];

// Sample spreads for tarot readings
export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: string[];
}

export const tarotSpreads: TarotSpread[] = [
  {
    id: "single",
    name: "Single Card",
    description: "A simple one-card reading for quick guidance",
    cardCount: 1,
    positions: ["The Situation"]
  },
  {
    id: "past-present-future",
    name: "Past-Present-Future",
    description: "Three-card spread showing your journey's timeline",
    cardCount: 3,
    positions: ["Past", "Present", "Future"]
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross",
    description: "Comprehensive ten-card spread for deep insight",
    cardCount: 10,
    positions: [
      "Present", "Challenge", "Foundation", "Past", "Crown", 
      "Future", "Self", "Environment", "Hopes/Fears", "Outcome"
    ]
  }
];

function convertToCardDefinition(card: TarotCardData): CardDefinition {
  return {
    id: card.id,
    name: card.name,
    number: card.number,
    arcana: card.arcana,
    suit: card.suit,
    imageUrl: card.imageUrl,
    meaning: card.description
  };
}

// Minor Arcana - Wands (Fire)
export const wandsCards: TarotCardData[] = [
  {
    id: "wands-1",
    name: "Ace of Wands",
    arcana: "minor",
    suit: "wands",
    number: "1",
    imageUrl: "/images/tarot/minor/wands/ace-of-wands.jpg",
    keywords: ["creativity", "inspiration", "new opportunities", "growth"],
    description: "The Ace of Wands represents creativity, inspiration, and new opportunities. It signifies the initial spark of an idea or passion that has potential for growth."
  },
  {
    id: "wands-2",
    name: "Two of Wands",
    arcana: "minor",
    suit: "wands",
    number: "2",
    imageUrl: "/images/tarot/minor/wands/two-of-wands.jpg",
    keywords: ["planning", "decision", "future vision", "discovery"],
    description: "The Two of Wands represents planning, making decisions, and having a vision for the future. It signifies standing at a crossroads and contemplating your next move."
  },
  {
    id: "wands-3",
    name: "Three of Wands",
    arcana: "minor",
    suit: "wands",
    number: "3",
    imageUrl: "/images/tarot/minor/wands/three-of-wands.jpg",
    keywords: ["expansion", "foresight", "international ventures", "leadership"],
    description: "The Three of Wands represents expansion, foresight, and international ventures. It signifies looking ahead to future possibilities and taking the lead in a project."
  },
  {
    id: "wands-4",
    name: "Four of Wands",
    arcana: "minor",
    suit: "wands",
    number: "4",
    imageUrl: "/images/tarot/minor/wands/four-of-wands.jpg",
    keywords: ["celebration", "harmony", "home", "community"],
    description: "The Four of Wands represents celebration, harmony, and a sense of community. It signifies a milestone achievement and the joy that comes from shared success."
  },
  {
    id: "wands-5",
    name: "Five of Wands",
    arcana: "minor",
    suit: "wands",
    number: "5",
    imageUrl: "/images/tarot/minor/wands/five-of-wands.jpg",
    keywords: ["conflict", "competition", "tension", "disagreement"],
    description: "The Five of Wands represents conflict, competition, and disagreement. It signifies the tension that arises when different energies or ideas clash without clear direction."
  },
  {
    id: "wands-6",
    name: "Six of Wands",
    arcana: "minor",
    suit: "wands",
    number: "6",
    imageUrl: "/images/tarot/minor/wands/six-of-wands.jpg",
    keywords: ["victory", "recognition", "progress", "self-confidence"],
    description: "The Six of Wands represents victory, success, and public recognition. It signifies the achievement of goals and the acknowledgment of your efforts by others."
  },
  {
    id: "wands-7",
    name: "Seven of Wands",
    arcana: "minor",
    suit: "wands",
    number: "7",
    imageUrl: "/images/tarot/minor/wands/seven-of-wands.jpg",
    keywords: ["challenge", "defense", "perseverance", "standing your ground"],
    description: "The Seven of Wands represents defensiveness, perseverance, and standing your ground. It signifies the need to protect what you've achieved from challenges."
  },
  {
    id: "wands-8",
    name: "Eight of Wands",
    arcana: "minor",
    suit: "wands",
    number: "8",
    imageUrl: "/images/tarot/minor/wands/eight-of-wands.jpg",
    keywords: ["speed", "movement", "rapid change", "communication"],
    description: "The Eight of Wands represents swift action, progress, and communication. It signifies events moving quickly and the need to stay focused during a time of momentum."
  },
  {
    id: "wands-9",
    name: "Nine of Wands",
    arcana: "minor",
    suit: "wands",
    number: "9",
    imageUrl: "/images/tarot/minor/wands/nine-of-wands.jpg",
    keywords: ["resilience", "persistence", "determination", "fatigue"],
    description: "The Nine of Wands represents resilience, persistence, and nearing the finish line. It signifies having weathered many challenges but still having the determination to continue."
  },
  {
    id: "wands-10",
    name: "Ten of Wands",
    arcana: "minor",
    suit: "wands",
    number: "10",
    imageUrl: "/images/tarot/minor/wands/ten-of-wands.jpg",
    keywords: ["burden", "responsibility", "hard work", "completion"],
    description: "The Ten of Wands represents burden, responsibility, and overextension. It signifies taking on too much or the final push needed to complete a demanding project."
  },
  {
    id: "wands-page",
    name: "Page of Wands",
    arcana: "minor",
    suit: "wands",
    number: "11",
    imageUrl: "/images/tarot/minor/wands/page-of-wands.jpg",
    keywords: ["exploration", "enthusiasm", "discovery", "free spirit"],
    description: "The Page of Wands represents exploration, enthusiasm, and discovery. It signifies a youthful, creative energy and the early stages of a new idea or passion."
  },
  {
    id: "wands-knight",
    name: "Knight of Wands",
    arcana: "minor",
    suit: "wands",
    number: "12",
    imageUrl: "/images/tarot/minor/wands/knight-of-wands.jpg",
    keywords: ["action", "adventure", "impulsiveness", "passion"],
    description: "The Knight of Wands represents action, adventure, and impulsiveness. It signifies charging forward with passion and energy, sometimes without full consideration of consequences."
  },
  {
    id: "wands-queen",
    name: "Queen of Wands",
    arcana: "minor",
    suit: "wands",
    number: "13",
    imageUrl: "/images/tarot/minor/wands/queen-of-wands.jpg",
    keywords: ["courage", "confidence", "determination", "vivacious"],
    description: "The Queen of Wands represents courage, confidence, and determination. She signifies a natural leader who balances passion with practicality and inspires others with her energy."
  },
  {
    id: "wands-king",
    name: "King of Wands",
    arcana: "minor",
    suit: "wands",
    number: "14",
    imageUrl: "/images/tarot/minor/wands/king-of-wands.jpg",
    keywords: ["leadership", "vision", "entrepreneur", "honor"],
    description: "The King of Wands represents leadership, vision, and entrepreneurship. He signifies mastery of creative energy and the ability to inspire others to action through charisma and honor."
  }
];

// Minor Arcana - Cups (Water)
export const cupsCards: TarotCardData[] = [
  {
    id: "cups-1",
    name: "Ace of Cups",
    arcana: "minor",
    suit: "cups",
    number: "1",
    imageUrl: "/images/tarot/minor/cups/ace-of-cups.jpg",
    keywords: ["love", "new relationships", "compassion", "creativity"],
    description: "The Ace of Cups represents new feelings, relationships, and emotional beginnings. It signifies the wellspring of love, compassion, and emotional fulfillment."
  },
  {
    id: "cups-2",
    name: "Two of Cups",
    arcana: "minor",
    suit: "cups",
    number: "2",
    imageUrl: "/images/tarot/minor/cups/two-of-cups.jpg",
    keywords: ["partnership", "mutual attraction", "connection", "harmony"],
    description: "The Two of Cups represents partnership, mutual attraction, and deep connection. It signifies the harmonious union of two energies, whether in romance, friendship, or collaboration."
  },
  {
    id: "cups-3",
    name: "Three of Cups",
    arcana: "minor",
    suit: "cups",
    number: "3",
    imageUrl: "/images/tarot/minor/cups/three-of-cups.jpg",
    keywords: ["celebration", "friendship", "community", "joy"],
    description: "The Three of Cups represents celebration, friendship, and community. It signifies the joy that comes from connecting with others and sharing meaningful experiences together."
  },
  {
    id: "cups-4",
    name: "Four of Cups",
    arcana: "minor",
    suit: "cups",
    number: "4",
    imageUrl: "/images/tarot/minor/cups/four-of-cups.jpg",
    keywords: ["apathy", "contemplation", "disconnection", "missed opportunities"],
    description: "The Four of Cups represents contemplation, apathy, and missed opportunities. It signifies being too focused on what you lack to notice new possibilities being offered."
  },
  {
    id: "cups-5",
    name: "Five of Cups",
    arcana: "minor",
    suit: "cups",
    number: "5",
    imageUrl: "/images/tarot/minor/cups/five-of-cups.jpg",
    keywords: ["loss", "grief", "disappointment", "regret"],
    description: "The Five of Cups represents grief, disappointment, and focusing on loss. It signifies the need to acknowledge emotional pain while also recognizing what remains valuable in your life."
  },
  {
    id: "cups-6",
    name: "Six of Cups",
    arcana: "minor",
    suit: "cups",
    number: "6",
    imageUrl: "/images/tarot/minor/cups/six-of-cups.jpg",
    keywords: ["nostalgia", "childhood memories", "innocence", "joy"],
    description: "The Six of Cups represents nostalgia, childhood memories, and innocence. It signifies finding joy in simple pleasures and the gift of seeing the world through uncomplicated eyes."
  },
  {
    id: "cups-7",
    name: "Seven of Cups",
    arcana: "minor",
    suit: "cups",
    number: "7",
    imageUrl: "/images/tarot/minor/cups/seven-of-cups.jpg",
    keywords: ["choices", "fantasy", "illusion", "daydreaming"],
    description: "The Seven of Cups represents choices, illusions, and fantasy. It signifies the need to distinguish between realistic options and pipe dreams when faced with many possibilities."
  },
  {
    id: "cups-8",
    name: "Eight of Cups",
    arcana: "minor",
    suit: "cups",
    number: "8",
    imageUrl: "/images/tarot/minor/cups/eight-of-cups.jpg",
    keywords: ["walking away", "disillusionment", "leaving behind", "seeking truth"],
    description: "The Eight of Cups represents walking away, seeking something deeper, and emotional detachment. It signifies the courage to leave behind what no longer serves your soul's growth."
  },
  {
    id: "cups-9",
    name: "Nine of Cups",
    arcana: "minor",
    suit: "cups",
    number: "9",
    imageUrl: "/images/tarot/minor/cups/nine-of-cups.jpg",
    keywords: ["satisfaction", "contentment", "gratitude", "wish fulfillment"],
    description: "The Nine of Cups represents contentment, satisfaction, and wish fulfillment. It signifies emotional well-being and the joy that comes from gratitude for life's abundance."
  },
  {
    id: "cups-10",
    name: "Ten of Cups",
    arcana: "minor",
    suit: "cups",
    number: "10",
    imageUrl: "/images/tarot/minor/cups/ten-of-cups.jpg",
    keywords: ["harmony", "happiness", "alignment", "family"],
    description: "The Ten of Cups represents harmony, happiness, and alignment with your emotional purpose. It signifies the fulfillment that comes from secure and loving connections."
  },
  {
    id: "cups-page",
    name: "Page of Cups",
    arcana: "minor",
    suit: "cups",
    number: "11",
    imageUrl: "/images/tarot/minor/cups/page-of-cups.jpg",
    keywords: ["creative beginnings", "intuition", "sensitivity", "new ideas"],
    description: "The Page of Cups represents creative beginnings, intuitive messages, and emotional sensitivity. It signifies the youthful exploration of feelings and creative inspirations."
  },
  {
    id: "cups-knight",
    name: "Knight of Cups",
    arcana: "minor",
    suit: "cups",
    number: "12",
    imageUrl: "/images/tarot/minor/cups/knight-of-cups.jpg",
    keywords: ["romance", "charm", "imagination", "proposal"],
    description: "The Knight of Cups represents romance, charm, and idealism. It signifies the pursuit of emotional fulfillment and the willingness to follow your heart's desires."
  },
  {
    id: "cups-queen",
    name: "Queen of Cups",
    arcana: "minor",
    suit: "cups",
    number: "13",
    imageUrl: "/images/tarot/minor/cups/queen-of-cups.jpg",
    keywords: ["compassion", "empathy", "emotional stability", "intuition"],
    description: "The Queen of Cups represents compassion, empathy, and emotional security. She signifies deep intuition, nurturing energy, and the ability to understand others' feelings with clarity."
  },
  {
    id: "cups-king",
    name: "King of Cups",
    arcana: "minor",
    suit: "cups",
    number: "14",
    imageUrl: "/images/tarot/minor/cups/king-of-cups.jpg",
    keywords: ["emotional balance", "diplomacy", "compassion", "wisdom"],
    description: "The King of Cups represents emotional balance, diplomacy, and wisdom. He signifies mastery over feelings and the ability to remain calm and compassionate even in turbulent situations."
  }
];

// Minor Arcana - Swords (Air)
export const swordsCards: TarotCardData[] = [
  {
    id: "swords-1",
    name: "Ace of Swords",
    arcana: "minor",
    suit: "swords",
    number: "1",
    imageUrl: "/images/tarot/minor/swords/ace-of-swords.jpg",
    keywords: ["clarity", "truth", "breakthrough", "mental power"],
    description: "The Ace of Swords represents clarity, truth, and mental breakthroughs. It signifies cutting through confusion to find insight and the power of the intellect."
  },
  {
    id: "swords-2",
    name: "Two of Swords",
    arcana: "minor",
    suit: "swords",
    number: "2",
    imageUrl: "/images/tarot/minor/swords/two-of-swords.jpg",
    keywords: ["difficult choices", "stalemate", "denial", "indecision"],
    description: "The Two of Swords represents difficult choices, stalemate, and avoidance. It signifies being caught between two equally challenging options and the refusal to see a situation clearly."
  },
  {
    id: "swords-3",
    name: "Three of Swords",
    arcana: "minor",
    suit: "swords",
    number: "3",
    imageUrl: "/images/tarot/minor/swords/three-of-swords.jpg",
    keywords: ["heartbreak", "sorrow", "emotional pain", "grief"],
    description: "The Three of Swords represents heartbreak, sorrow, and emotional pain. It signifies the sharp clarity that often comes with grief and the process of acknowledging difficult truths."
  },
  {
    id: "swords-4",
    name: "Four of Swords",
    arcana: "minor",
    suit: "swords",
    number: "4",
    imageUrl: "/images/tarot/minor/swords/four-of-swords.jpg",
    keywords: ["rest", "restoration", "meditation", "recuperation"],
    description: "The Four of Swords represents rest, restoration, and contemplation. It signifies taking a necessary break from stress and allowing your mind to heal and recover."
  },
  {
    id: "swords-5",
    name: "Five of Swords",
    arcana: "minor",
    suit: "swords",
    number: "5",
    imageUrl: "/images/tarot/minor/swords/five-of-swords.jpg",
    keywords: ["conflict", "tension", "defeat", "win at all costs"],
    description: "The Five of Swords represents conflict, tension, and hollow victory. It signifies the consequences of winning at all costs and the aftermath of arguments where everyone loses something."
  },
  {
    id: "swords-6",
    name: "Six of Swords",
    arcana: "minor",
    suit: "swords",
    number: "6",
    imageUrl: "/images/tarot/minor/swords/six-of-swords.jpg",
    keywords: ["transition", "moving on", "leaving behind", "gradual change"],
    description: "The Six of Swords represents transition, moving on, and gradual change. It signifies journeying away from turbulent situations toward calmer waters and mental peace."
  },
  {
    id: "swords-7",
    name: "Seven of Swords",
    arcana: "minor",
    suit: "swords",
    number: "7",
    imageUrl: "/images/tarot/minor/swords/seven-of-swords.jpg",
    keywords: ["deception", "strategy", "stealth", "trickery"],
    description: "The Seven of Swords represents deception, strategy, and stealth. It signifies attempting to get away with something or using clever tactics rather than direct confrontation."
  },
  {
    id: "swords-8",
    name: "Eight of Swords",
    arcana: "minor",
    suit: "swords",
    number: "8",
    imageUrl: "/images/tarot/minor/swords/eight-of-swords.jpg",
    keywords: ["restriction", "imprisonment", "victim mentality", "powerlessness"],
    description: "The Eight of Swords represents restriction, imprisonment, and victim mentality. It signifies feeling trapped by circumstances while overlooking available solutions and paths to freedom."
  },
  {
    id: "swords-9",
    name: "Nine of Swords",
    arcana: "minor",
    suit: "swords",
    number: "9",
    imageUrl: "/images/tarot/minor/swords/nine-of-swords.jpg",
    keywords: ["anxiety", "worry", "fear", "nightmares"],
    description: "The Nine of Swords represents anxiety, worry, and nightmares. It signifies mental anguish and the tendency to spiral into worst-case scenarios in the darkness of night."
  },
  {
    id: "swords-10",
    name: "Ten of Swords",
    arcana: "minor",
    suit: "swords",
    number: "10",
    imageUrl: "/images/tarot/minor/swords/ten-of-swords.jpg",
    keywords: ["painful endings", "deep wounds", "betrayal", "loss"],
    description: "The Ten of Swords represents painful endings, deep wounds, and hitting rock bottom. It signifies a situation that cannot deteriorate further and the promise that things will improve from here."
  },
  {
    id: "swords-page",
    name: "Page of Swords",
    arcana: "minor",
    suit: "swords",
    number: "11",
    imageUrl: "/images/tarot/minor/swords/page-of-swords.jpg",
    keywords: ["curiosity", "mental energy", "new ideas", "communication"],
    description: "The Page of Swords represents curiosity, mental energy, and new ideas. It signifies a thirst for knowledge, verbal or written communication, and the early stages of intellectual pursuits."
  },
  {
    id: "swords-knight",
    name: "Knight of Swords",
    arcana: "minor",
    suit: "swords",
    number: "12",
    imageUrl: "/images/tarot/minor/swords/knight-of-swords.jpg",
    keywords: ["action", "impulsiveness", "defending beliefs", "intellectual assertiveness"],
    description: "The Knight of Swords represents action, impulsiveness, and assertive communication. It signifies charging ahead with intellectual arguments and pursuing goals with single-minded determination."
  },
  {
    id: "swords-queen",
    name: "Queen of Swords",
    arcana: "minor",
    suit: "swords",
    number: "13",
    imageUrl: "/images/tarot/minor/swords/queen-of-swords.jpg",
    keywords: ["independent", "unbiased judgment", "clear boundaries", "direct communication"],
    description: "The Queen of Swords represents independence, unbiased judgment, and clear boundaries. She signifies the ability to cut through deception, maintain emotional distance, and communicate directly."
  },
  {
    id: "swords-king",
    name: "King of Swords",
    arcana: "minor",
    suit: "swords",
    number: "14",
    imageUrl: "/images/tarot/minor/swords/king-of-swords.jpg",
    keywords: ["intellectual power", "authority", "truth", "ethical leadership"],
    description: "The King of Swords represents intellectual power, authority, and ethical leadership. He signifies mastery of logic and reason, clear thinking, and the ability to make fair judgments."
  }
];

// Minor Arcana - Pentacles (Earth)
export const pentaclesCards: TarotCardData[] = [
  {
    id: "pentacles-1",
    name: "Ace of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "1",
    imageUrl: "/images/tarot/minor/pentacles/ace-of-pentacles.jpg",
    keywords: ["opportunity", "prosperity", "new venture", "abundance"],
    description: "The Ace of Pentacles represents new opportunities, prosperity, and abundance. It signifies the seed of material success and the potential for financial or physical well-being."
  },
  {
    id: "pentacles-2",
    name: "Two of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "2",
    imageUrl: "/images/tarot/minor/pentacles/two-of-pentacles.jpg",
    keywords: ["balance", "adaptability", "time management", "prioritization"],
    description: "The Two of Pentacles represents balance, adaptability, and juggling priorities. It signifies the need to stay flexible while managing multiple responsibilities, especially financial ones."
  },
  {
    id: "pentacles-3",
    name: "Three of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "3",
    imageUrl: "/images/tarot/minor/pentacles/three-of-pentacles.jpg",
    keywords: ["teamwork", "collaboration", "skill", "recognition"],
    description: "The Three of Pentacles represents teamwork, skilled collaboration, and recognition of effort. It signifies the value of working together and having your expertise acknowledged."
  },
  {
    id: "pentacles-4",
    name: "Four of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "4",
    imageUrl: "/images/tarot/minor/pentacles/four-of-pentacles.jpg",
    keywords: ["security", "control", "conservation", "hoarding"],
    description: "The Four of Pentacles represents security, control, and conservation of resources. It signifies the tension between maintaining stability and becoming overly attached to material possessions."
  },
  {
    id: "pentacles-5",
    name: "Five of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "5",
    imageUrl: "/images/tarot/minor/pentacles/five-of-pentacles.jpg",
    keywords: ["hardship", "loss", "poverty", "isolation"],
    description: "The Five of Pentacles represents hardship, isolation, and material difficulty. It signifies feeling left out in the cold, but also overlooking sources of help that may be available."
  },
  {
    id: "pentacles-6",
    name: "Six of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "6",
    imageUrl: "/images/tarot/minor/pentacles/six-of-pentacles.jpg",
    keywords: ["generosity", "charity", "giving", "receiving"],
    description: "The Six of Pentacles represents generosity, charity, and the flow of resources. It signifies the balance between giving and receiving and the power dynamics involved in financial exchanges."
  },
  {
    id: "pentacles-7",
    name: "Seven of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "7",
    imageUrl: "/images/tarot/minor/pentacles/seven-of-pentacles.jpg",
    keywords: ["assessment", "patience", "long-term view", "investment"],
    description: "The Seven of Pentacles represents assessment, patience, and long-term vision. It signifies the moment of evaluation after putting in hard work and the decision of whether to continue or change course."
  },
  {
    id: "pentacles-8",
    name: "Eight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "8",
    imageUrl: "/images/tarot/minor/pentacles/eight-of-pentacles.jpg",
    keywords: ["diligence", "skill development", "craftsmanship", "mastery"],
    description: "The Eight of Pentacles represents diligence, skill development, and attention to detail. It signifies dedicated work to master a craft and the satisfaction that comes from improving your abilities."
  },
  {
    id: "pentacles-9",
    name: "Nine of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "9",
    imageUrl: "/images/tarot/minor/pentacles/nine-of-pentacles.jpg",
    keywords: ["luxury", "self-sufficiency", "financial independence", "refinement"],
    description: "The Nine of Pentacles represents luxury, self-sufficiency, and accomplishment. It signifies enjoying the fruits of your labor and the independence that comes from disciplined effort."
  },
  {
    id: "pentacles-10",
    name: "Ten of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "10",
    imageUrl: "/images/tarot/minor/pentacles/ten-of-pentacles.jpg",
    keywords: ["legacy", "inheritance", "family wealth", "establishment"],
    description: "The Ten of Pentacles represents legacy, inheritance, and family wealth. It signifies long-term security, the establishment of lasting foundations, and the prosperity that spans generations."
  },
  {
    id: "pentacles-page",
    name: "Page of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "11",
    imageUrl: "/images/tarot/minor/pentacles/page-of-pentacles.jpg",
    keywords: ["manifestation", "opportunity", "study", "careful planning"],
    description: "The Page of Pentacles represents manifestation, study, and new opportunities in material matters. It signifies a practical approach to learning and the early stages of bringing ideas into tangible form."
  },
  {
    id: "pentacles-knight",
    name: "Knight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "12",
    imageUrl: "/images/tarot/minor/pentacles/knight-of-pentacles.jpg",
    keywords: ["reliability", "routine", "conservation", "patience"],
    description: "The Knight of Pentacles represents reliability, responsibility, and methodical progress. It signifies steady advancement toward goals through consistent effort rather than dramatic action."
  },
  {
    id: "pentacles-queen",
    name: "Queen of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "13",
    imageUrl: "/images/tarot/minor/pentacles/queen-of-pentacles.jpg",
    keywords: ["nurturing", "practical", "providing", "security"],
    description: "The Queen of Pentacles represents nurturing, practicality, and abundance. She signifies the ability to create comfort and security while maintaining a connection to nature and physical well-being."
  },
  {
    id: "pentacles-king",
    name: "King of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: "14",
    imageUrl: "/images/tarot/minor/pentacles/king-of-pentacles.jpg",
    keywords: ["wealth", "business", "leadership", "stability"],
    description: "The King of Pentacles represents wealth, business acumen, and material success. He signifies mastery of the material world, reliable leadership, and the rewards of methodical planning."
  }
];

// Combine all cards into one complete tarot deck
export const allTarotCards: TarotCardData[] = [
  ...majorArcanaCards,
  ...wandsCards,
  ...cupsCards,
  ...swordsCards,
  ...pentaclesCards
];

// Create and export the tarotDeck array needed by the components
export const tarotDeck: CardDefinition[] = allTarotCards.map(convertToCardDefinition);

// Helper function to get random cards
export function getRandomCards(count: number): CardDefinition[] {
  const shuffled = [...tarotDeck].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Get spread configuration by ID
export function getSpreadById(spreadId: string): TarotSpread | undefined {
  return tarotSpreads.find(spread => spread.id === spreadId);
}

// Helper function to filter cards by arcana
export function getCardsByArcana(arcana: string): CardDefinition[] {
  return tarotDeck.filter(card => card.arcana === arcana);
}

// Helper function to filter cards by suit
export function getCardsBySuit(suit: string): CardDefinition[] {
  return tarotDeck.filter(card => card.suit === suit);
}
