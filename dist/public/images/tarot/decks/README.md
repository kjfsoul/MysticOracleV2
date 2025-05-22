# Tarot Deck Images

This directory contains images for different tarot decks used in the Mystic Arcana application.

## Directory Structure

Each deck has its own subdirectory with the following structure:

```
/decks/
  /{deck-name}/
    /major/
      00-fool.jpg
      01-magician.jpg
      02-high-priestess.jpg
      ...
    /minor/
      /cups/
        ace-cups.jpg
        two-cups.jpg
        ...
      /wands/
        ace-wands.jpg
        two-wands.jpg
        ...
      /swords/
        ace-swords.jpg
        two-swords.jpg
        ...
      /pentacles/
        ace-pentacles.jpg
        two-pentacles.jpg
        ...
```

## Adding a New Deck

To add a new tarot deck:

1. Create a new directory under `/decks/` with your deck name (use kebab-case)
2. Create the subdirectories for major and minor arcana cards as shown above
3. Add your card images following the naming convention
4. Update the `tarot-deck-config.ts` file to include your new deck

### Image Naming Convention

#### Major Arcana
- Format: `{number}-{name}.jpg`
- Examples: 
  - `00-fool.jpg`
  - `01-magician.jpg`
  - `02-high-priestess.jpg`

#### Minor Arcana
- Format: `{rank}-{suit}.jpg`
- Examples:
  - `ace-cups.jpg`
  - `two-wands.jpg`
  - `queen-swords.jpg`
  - `king-pentacles.jpg`

### Image Requirements

- Format: JPG or PNG (JPG recommended for smaller file size)
- Resolution: 500-800px tall recommended (maintain aspect ratio)
- File size: Keep under 200KB per image for optimal performance

## Default Deck

The default deck is the Rider-Waite deck, which is the most widely recognized tarot deck.

## Placeholder Images

If a card image is missing, the application will fall back to placeholder images located in `/images/tarot/placeholders/`.

## Adding the Rider-Waite Deck

The Rider-Waite deck is in the public domain in many countries. You can download the images from various sources:

1. [Sacred Texts Archive](https://www.sacred-texts.com/tarot/pkt/index.htm)
2. [Wikipedia Commons](https://commons.wikimedia.org/wiki/Category:Rider-Waite_Tarot_deck)

After downloading, resize and optimize the images before adding them to the appropriate directories.

## Switching Decks

The application uses the deck configuration in `src/config/tarot-deck-config.ts` to determine which deck to use. You can modify this file to change the default deck or add new decks.
