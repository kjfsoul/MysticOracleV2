# Tarot Deck System for Mystic Arcana

This document provides an overview of the tarot deck system implemented in Mystic Arcana, which allows for easy swapping between different tarot decks.

## Directory Structure

The tarot deck images are organized in the following directory structure:

```
/client/public/images/tarot/
├── card-back.jpg                # Default card back image
├── card-back-pattern.jpg        # Pattern for card backs
├── decks/                       # Directory containing all decks
│   ├── README.md                # Instructions for adding new decks
│   └── rider-waite/             # Rider-Waite deck (default)
│       ├── major/               # Major arcana cards
│       │   ├── 00-fool.jpg
│       │   ├── 01-magician.jpg
│       │   └── ...
│       └── minor/               # Minor arcana cards
│           ├── cups/            # Cups suit
│           │   ├── ace-cups.jpg
│           │   └── ...
│           ├── wands/           # Wands suit
│           │   ├── ace-wands.jpg
│           │   └── ...
│           ├── swords/          # Swords suit
│           │   ├── ace-swords.jpg
│           │   └── ...
│           └── pentacles/       # Pentacles suit
│               ├── ace-pentacles.jpg
│               └── ...
└── placeholders/                # Placeholder images for missing cards
    ├── major-placeholder.svg
    ├── cups-placeholder.svg
    ├── wands-placeholder.svg
    ├── swords-placeholder.svg
    └── pentacles-placeholder.svg
```

## Configuration

The tarot deck system is configured in `client/src/config/tarot-deck-config.ts`. This file defines the available decks and provides functions for working with them.

### Adding a New Deck

To add a new deck:

1. Create a new directory under `/client/public/images/tarot/decks/` with your deck name (use kebab-case)
2. Add your card images following the naming convention (see below)
3. Update the `TAROT_DECKS` array in `tarot-deck-config.ts` to include your new deck

## Utilities

The system includes several utilities to help work with tarot decks:

1. **Tarot Image Utilities** (`client/src/utils/tarot-image-utils.ts`):
   - Functions for getting image paths
   - Functions for preloading images
   - Error handling for missing images

2. **Deck Manager** (`client/src/utils/deck-manager.ts`):
   - Functions for validating decks
   - Functions for checking missing cards
   - Utility functions for working with deck data

3. **Deck Selector Component** (`client/src/components/tarot/deck-selector.tsx`):
   - UI component for selecting a deck
   - Can be used in any page that needs deck selection

## Deck Management Page

A deck management page is available at `/tarot-decks`. This page allows users to:

- View all available decks
- See which cards are missing from each deck
- Set the active deck
- Get instructions for downloading the Rider-Waite deck

## Downloading the Rider-Waite Deck

The Rider-Waite deck is in the public domain in many countries. A script is provided to download and prepare the deck:

```bash
npm run tarot:download-rider-waite
```

This script will:
1. Download the Rider-Waite deck images from a public source
2. Resize and optimize the images
3. Save them to the appropriate directories

## Image Naming Convention

### Major Arcana
- Format: `{number}-{name}.jpg`
- Examples: 
  - `00-fool.jpg`
  - `01-magician.jpg`
  - `02-high-priestess.jpg`

### Minor Arcana
- Format: `{rank}-{suit}.jpg`
- Examples:
  - `ace-cups.jpg`
  - `two-wands.jpg`
  - `queen-swords.jpg`
  - `king-pentacles.jpg`

## Using the Deck System in Components

To use the deck system in your components:

```typescript
import { getTarotCardImagePath, handleTarotImageError } from '../utils/tarot-image-utils';
import { getActiveDeck } from '../config/tarot-deck-config';

// Get the active deck
const activeDeck = getActiveDeck();

// Get the image path for a card
const imagePath = getTarotCardImagePath('00-fool', 'major');

// In your JSX
<img 
  src={imagePath} 
  alt="The Fool"
  onError={(e) => handleTarotImageError(e, 'major')}
/>
```

## Fallback Images

If a card image is missing, the system will automatically fall back to placeholder images. These placeholders are located in `/client/public/images/tarot/placeholders/`.

## Future Improvements

Potential future improvements to the deck system:

1. Implement the deck upload feature in the deck management page
2. Add user preferences to store the selected deck
3. Add more default decks
4. Implement a card preview feature in the deck management page
5. Add support for custom card backs per deck
