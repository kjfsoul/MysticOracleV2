# Mystic Arcana - Augment Prompts

## MCP Server Setup Prompt

```
## Mystic Arcana: Project Setup

This project is a personalized spirituality platform with AI tarot, astrology charts, custom tarot decks, a store, a blog, and personalized experiences. Built in React + Next.js 13+ (App Router), deployed to Netlify.

Connect the following MCP servers:

- MCP-Dev-NextJS
- MCP-React-UI
- MCP-Netlify-EdgeDocs
- MCP-Fullstack-Turbo
- MCP-AI-FunctionPack
- MCP-CMS-Headless
- MCP-Commerce-Stripe
- MCP-Design-System-Tailwind

These will be used for:
- Generating personalized dynamic API routes
- Creating edge handlers for personalization
- Building custom UI components (card spreads, charts, deck editor)
- Handling secure checkout and CMS-based blog rendering
- Calling OpenAI-based tarot and astrology services

Use your custom instructions. Reference `productContext.md`, `activeContext.md`, and `systemPatterns.md`. Document assumptions. Modularize large components. Use Tailwind and app directory structure.

To ensure you understand my request, confirm your understanding before executing. Provide a confidence score (0–10) before and after execution.

Acknowledge when MCP servers are ready.
```

## Feature-Specific Prompts

### AI Tarot API

```
Create a Netlify Function that handles POST requests with tarot spread config, calls OpenAI API, and returns personalized reading. The function should:

1. Accept user information and spread configuration
2. Validate inputs and handle errors
3. Call OpenAI API with appropriate prompt
4. Format and return the personalized reading

Use MCP-AI-FunctionPack and MCP-Netlify-EdgeDocs for implementation guidance.
```

### Astrology Chart

```
Generate a serverless function that accepts birth info, calls an astrology API (Swiss Ephemeris), and formats it for frontend display. The function should:

1. Accept date, time, and location of birth
2. Calculate planetary positions using Swiss Ephemeris
3. Generate chart interpretation based on positions
4. Return formatted data for frontend visualization

Use MCP-AI-FunctionPack and MCP-Fullstack-Turbo for implementation guidance.
```

### Custom Deck Builder

```
Scaffold components and state management logic to let users customize and save tarot decks (name, images, categories). Use Tailwind for styling. The components should:

1. Allow users to create and name a new deck
2. Upload or select images for each card
3. Add descriptions and keywords
4. Save and share the custom deck

Use MCP-React-UI and MCP-Design-System-Tailwind for implementation guidance.
```

### Shop Checkout

```
Implement a Netlify Function that creates Stripe checkout sessions from cart input. Validate securely and return redirect URL. The function should:

1. Accept cart items and user information
2. Validate inputs and calculate totals
3. Create a Stripe checkout session
4. Return the session ID and redirect URL

Use MCP-Commerce-Stripe and MCP-Netlify-EdgeDocs for implementation guidance.
```

### Blog System

```
Configure ISR to revalidate blog posts every 60 minutes. Source content from MDX files with frontmatter. The system should:

1. Load blog posts from MDX files
2. Parse frontmatter for metadata
3. Implement pagination and filtering
4. Set up ISR with 60-minute revalidation

Use MCP-CMS-Headless and MCP-Dev-NextJS for implementation guidance.
```

### Personalization

```
Create a Netlify Edge Function that uses cookies to apply user themes, zodiac signs, and preferred language before SSR. The function should:

1. Read user preferences from cookies
2. Detect user's location and language
3. Apply theme and preferences
4. Pass context to the SSR process

Use MCP-Netlify-EdgeDocs for implementation guidance.
```
