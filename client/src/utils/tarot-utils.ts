import { getActiveDeck } from '@client/config/tarot-deck-config';
import type { TarotCard } from '@client/data/tarot-cards';

export function getTarotCardImagePath(card: TarotCard): string {
  // Determine the desired format (prioritize JPG)
  const imageFormat = "jpg";

  // Get the active deck configuration
  const deckId = "rider-waite"; // Default deck
  const arcana = card.arcana.toLowerCase();

  // Format the card ID to match the file naming convention
  let formattedId = "";

  if (arcana === "major") {
    // Major arcana cards have a numeric prefix in the filename
    // Map the card ID to the correct filename format
    const majorArcanaMap: Record<string, string> = {
      fool: "00-fool",
      magician: "01-magician",
      "high-priestess": "02-high-priestess",
      empress: "03-empress",
      emperor: "04-emperor",
      hierophant: "05-hierophant",
      lovers: "06-lovers",
      chariot: "07-chariot",
      strength: "08-strength",
      hermit: "09-hermit",
      "wheel-of-fortune": "10-wheel-of-fortune",
      justice: "11-justice",
      "hanged-man": "12-hanged-man",
      death: "13-death",
      temperance: "14-temperance",
      devil: "15-devil",
      tower: "16-tower",
      star: "17-star",
      moon: "18-moon",
      sun: "19-sun",
      judgement: "20-judgement",
      world: "21-world",
    };

    formattedId = majorArcanaMap[card.id] || card.id;
  } else {
    // For minor arcana, use the card ID as is
    formattedId = card.id;
  }

  // Generate the path using the chosen format
  let path = "";
  let jpgPath = "";
  let svgPath = "";

  if (arcana === "major") {
    jpgPath = `/images/tarot/decks/${deckId}/major/${formattedId}.jpg`;
    svgPath = `/images/tarot/decks/${deckId}/major/${formattedId}.svg`;
  } else if (card.suit) {
    jpgPath = `/images/tarot/decks/${deckId}/minor/${card.suit.toLowerCase()}/${formattedId}.jpg`;
    svgPath = `/images/tarot/decks/${deckId}/minor/${card.suit.toLowerCase()}/${formattedId}.svg`;
  }

  // Use JPG if it exists, otherwise use SVG
  path = jpgPath;
  if (!path || !path.endsWith('.jpg')) {
    path = svgPath;
  }

  // Fallback logic remains the same
  if (!path) {
    console.error(
      `Cannot determine path for card: ${card.name}, using placeholder.`
    );
    path = "/images/tarot/placeholders/card-back.jpg";
  }

  // Special handling for problematic cards (07-chariot, 13-death, 16-tower)
  // These cards have placeholder JPG files (722 bytes)
  if (
    formattedId === "07-chariot" ||
    formattedId === "13-death" ||
    formattedId === "16-tower"
  ) {
    console.log(`Using placeholder for known problematic card: ${card.name}`);
    return `/images/tarot/placeholders/major-placeholder.svg`;
  }

  console.log(`Generated path for ${card.name}: ${path}`);
  return path;
}

export function getCardBackPath(): string {
  return getActiveDeck().cardBackImage;
}

export function getDailyCard(cards: TarotCard[]): {
  card: TarotCard;
  isReversed: boolean;
} {
  // Get a deterministic "random" card based on today's date
  const today = new Date();
  const dateString = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  // Use the date string to create a seed for the random selection
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use the hash to select a card
  const index = Math.abs(hash) % cards.length;
  const selectedCard = cards[index];

  // Determine if the card is reversed (also based on the date)
  const isReversed = (hash >> 4) % 2 === 1;

  return { card: selectedCard, isReversed };
}

/**
 * Handles image loading errors for tarot cards
 * @param card The tarot card that had an image loading error
 * @param setFallbackImage Function to set a fallback image
 */
export function getFallbackPlaceholderPath(card: TarotCard): string {
  if (card.arcana === "major") {
    return "/images/tarot/placeholders/major-placeholder.svg";
  } else if (card.arcana === "minor" && card.suit) {
    return `/images/tarot/placeholders/${card.suit.toLowerCase()}-placeholder.svg`;
  } else {
    return "/images/tarot/placeholders/card-back.svg"; // Default placeholder
  }
}

export function handleTarotImageError(
  card: TarotCard,
  failedPath: string,
  setFallbackImage: (path: string) => void
): void {
  console.warn(`Error loading image for card ${card.name} at path: ${failedPath}`);

  // Determine the appropriate next fallback based on what failed
  let nextAttemptPath = "";

  if (failedPath.endsWith('.jpg')) {
    // If JPG failed, try the SVG version
    nextAttemptPath = failedPath.replace('.jpg', '.svg');
    console.log(`Attempting fallback SVG: ${nextAttemptPath}`);
  } else if (failedPath.endsWith('.svg') && !failedPath.includes('/placeholders/')) {
    // If SVG failed (and it wasn't already a placeholder), use the placeholder
    nextAttemptPath = getFallbackPlaceholderPath(card); // Use helper
    console.log(`SVG failed, using placeholder: ${nextAttemptPath}`);
  } else {
    // If even the placeholder failed, use the absolute card back as last resort
    nextAttemptPath = "/images/tarot/card-back.svg";
    console.error(`All fallbacks failed for ${card.name}, using card back.`);
  }

  // Preload and set the next fallback
  const fallbackImg = new Image();
  fallbackImg.src = nextAttemptPath;

  fallbackImg.onload = () => {
    console.log(`Successfully loaded fallback: ${nextAttemptPath}`);
    setFallbackImage(nextAttemptPath);
  };

  fallbackImg.onerror = () => {
    console.error(`Fallback image failed to load: ${nextAttemptPath}`);
    // If this fallback also fails, maybe try the *next* level down (e.g., placeholder -> card back)
    // Or just give up and show the card back.
    if (!nextAttemptPath.includes('/placeholders/') && !nextAttemptPath.endsWith('card-back.svg')) {
       // If the SVG attempt failed, now try the placeholder
       const placeholderPath = getFallbackPlaceholderPath(card);
       console.log(`SVG failed, trying placeholder: ${placeholderPath}`);
       handleTarotImageError(card, nextAttemptPath, setFallbackImage); // Recursive call with placeholder path (careful!)
       // A safer approach might be needed to avoid infinite loops if placeholders also fail
    } else if (!nextAttemptPath.endsWith('card-back.svg')) {
       // If placeholder failed, use card back
       console.log(`Placeholder failed, using card back.`);
       setFallbackImage("/images/tarot/card-back.svg");
    }
  };
}
