# Tarot Card Implementation Files

## Key Files for Modification

### 1. Image Path Handling
- `client/src/utils/tarot-utils.ts` - Contains the `getTarotCardImagePath` function that needs to be updated to use .jpg instead of .svg
- `client/src/config/tarot-deck-config.ts` - Contains deck configuration including image path templates

### 2. Card Flipping and Animation
- `client/src/components/tarot/animated-tarot-card.tsx` - Main component for card flipping animations
- `client/src/components/tarot/tarot-card.tsx` - Base tarot card component with animation variants
- `client/src/styles/card-flip.css` - CSS for card flip animations

### 3. Daily Card Functionality
- `client/src/components/tarot/daily-card-improved.tsx` - Daily card component that needs user click interaction
- `client/src/utils/tarot-utils.ts` - Contains `getDailyCard` function for deterministic card selection
- `netlify/functions/daily-tarot.js` - Serverless function for daily card API

### 4. Card Shuffling and Effects
- `client/src/components/tarot/tarot-deck.tsx` - Contains deck shuffling animations
- `client/src/index.css` - Contains animation keyframes for card effects

### 5. Error Handling and Skeleton UI
- `client/src/components/tarot/daily-card-improved.tsx` - Contains loading states
- `client/src/utils/tarot-utils.ts` - Contains `handleTarotImageError` function

## Implementation Requirements

1. **Rider-Waite Image Path Fix**:
   - Update `getTarotCardImagePath` to use .jpg instead of .svg
   - Fix error handling for image loading

2. **User-Initiated Card Flipping**:
   - Modify daily card component to require user click before flipping
   - Add instructional text to prompt user interaction

3. **Card Reversals**:
   - Update `getDailyCard` function to include data-driven probability for reversals
   - Ensure reversals are consistent for each user

4. **Consistent Daily Cards**:
   - Ensure cards don't change on refresh
   - Make cards user-specific when signed in

5. **Animation Enhancements**:
   - Add shuffling animation with sound effects
   - Implement randomized card reveal animations (glow, sparkle, etc.)

6. **Skeleton & Error UI**:
   - Add skeleton loading states
   - Implement graceful error handling UI
