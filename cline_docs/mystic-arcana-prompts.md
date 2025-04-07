# Mystic Arcana - Specialized MCP Prompts

These prompts are specifically tailored for the Mystic Arcana project, designed to leverage the full capabilities of our MCP servers. Each prompt focuses on a specific feature or component of the platform.

## Core Features

### 1. Tarot Card Component System

```
Using MCP-React-UI and MCP-Design-System-Tailwind, create a comprehensive tarot card component system for Mystic Arcana. The system should include:

1. A base TarotCard component with front/back faces and flip animation
2. Card state management (selected, highlighted, flipped)
3. Responsive sizing for different devices
4. Accessibility features for screen readers
5. Animation effects using Framer Motion for card reveals
6. Theme variants (mystical, minimalist, vintage)
7. Support for custom card images and backs

The components should follow our design system with cosmic gradients, subtle glow effects, and ethereal animations. Include TypeScript types and Storybook documentation.

Reference the Major and Minor Arcana structure with 78 cards total (22 Major, 56 Minor across 4 suits).
```

### 2. AI-Powered Tarot Reading System

```
Using MCP-AI-FunctionPack and MCP-Netlify-EdgeDocs, develop an AI-powered tarot reading system that:

1. Accepts user questions and personal context
2. Selects appropriate spread based on question type:
   - Three-card (past/present/future)
   - Celtic Cross (detailed situation analysis)
   - Relationship spread (self/other/connection)
   - Career path spread (strengths/challenges/advice)

3. Generates personalized interpretations by:
   - Analyzing card combinations and positions
   - Incorporating user's zodiac sign and birth date
   - Considering question context and emotional tone
   - Adapting language to user's spiritual experience level

4. Implements a Netlify Function that:
   - Securely calls OpenAI API with appropriate system prompts
   - Handles rate limiting and error cases
   - Caches common interpretations for performance
   - Logs readings (anonymized) for training improvements

Include a prompt engineering system that creates dynamic, personalized prompts based on the cards drawn and user context.
```

### 3. Interactive Astrology Chart Visualization

```
Using MCP-React-UI and MCP-Dev-NextJS, create an interactive astrology chart visualization system that:

1. Renders a beautiful, interactive natal chart using:
   - SVG for precise planetary positions
   - Canvas for performance with animations
   - Responsive design that works on all devices

2. Displays:
   - Zodiac wheel with houses and degrees
   - Planetary positions with accurate symbols
   - Aspect lines with appropriate colors (trine, square, opposition)
   - Rising sign and house cusps

3. Includes interactive features:
   - Zoom and pan capabilities
   - Click/tap to view detailed planet information
   - Toggle different chart elements (aspects, houses, etc.)
   - Animation for transits and progressions

4. Implements Swiss Ephemeris calculations via a Netlify Function

The design should use our cosmic theme with a deep space background, constellation patterns, and subtle particle animations for celestial bodies.
```

### 4. Personalized User Dashboard

```
Using MCP-Fullstack-Turbo and MCP-Netlify-EdgeDocs, create a personalized user dashboard for Mystic Arcana that:

1. Implements a Netlify Edge Function for real-time personalization based on:
   - User's zodiac sign and birth chart
   - Previous readings and saved favorites
   - Current astrological transits
   - User preferences and theme settings

2. Displays:
   - Daily tarot card with personalized interpretation
   - Current planetary positions affecting the user
   - Recommended spreads based on user history
   - Upcoming astrological events relevant to user's chart

3. Uses tRPC for type-safe API calls to:
   - Fetch user data and preferences
   - Retrieve saved readings and custom decks
   - Update user settings and favorites

4. Implements ISR for semi-dynamic content with 1-hour revalidation

The dashboard should adapt its appearance based on user's zodiac element (fire, earth, air, water) with appropriate color schemes and animations.
```

## E-Commerce Features

### 5. Mystical Product Catalog

```
Using MCP-CMS-Headless and MCP-Commerce-Stripe, create a mystical product catalog system that:

1. Implements a product data structure for:
   - Physical items (tarot decks, crystals, ritual supplies)
   - Digital products (reading PDFs, meditation audio, courses)
   - Subscription services (monthly readings, premium content)

2. Creates a filterable, searchable product grid with:
   - Beautiful card layouts with hover effects
   - Quick view modals with product details
   - Filtering by category, price, and magical properties
   - Sorting options (popularity, price, newest)

3. Includes product detail pages with:
   - Image galleries with zoom functionality
   - Detailed descriptions with mystical properties
   - Related products based on magical correspondences
   - Reviews and ratings

4. Integrates with Stripe for:
   - Secure checkout process
   - Subscription management
   - Digital product delivery

The design should use rich, mystical imagery with product cards that have subtle animations on hover (glowing effects, slight rotations).
```

### 6. Secure Checkout Experience

```
Using MCP-Commerce-Stripe and MCP-Netlify-EdgeDocs, create a secure, mystical checkout experience that:

1. Implements a multi-step checkout flow:
   - Cart review with beautiful product cards
   - Shipping information (for physical products)
   - Payment details with Stripe Elements
   - Order confirmation with mystical animations

2. Creates Netlify Functions for:
   - Cart validation and tax calculation
   - Stripe payment intent creation
   - Order processing and fulfillment
   - Email notification sending

3. Includes security features:
   - CSRF protection
   - Input validation and sanitization
   - Secure handling of sensitive information
   - Error handling and recovery

4. Provides a seamless experience for:
   - Guest checkout
   - Registered user checkout
   - Subscription management
   - Digital product delivery

The checkout process should maintain the mystical theme with subtle animations between steps, constellation patterns in the background, and a "magical" confirmation animation.
```

## Content Features

### 7. Mystical Blog System

```
Using MCP-CMS-Headless and MCP-Dev-NextJS, create a mystical blog system that:

1. Implements a content structure for:
   - Tarot card deep dives
   - Astrological event explanations
   - Spiritual practice guides
   - Mystical history articles

2. Creates a beautiful blog index with:
   - Featured article with parallax effect
   - Category filtering with animated transitions
   - Reading time and difficulty indicators
   - Author information with profile images

3. Designs article pages with:
   - Rich typography with drop caps and pull quotes
   - Embedded interactive elements (tarot cards, charts)
   - Table of contents with smooth scrolling
   - Related article suggestions

4. Implements MDX for:
   - Custom components within content
   - Interactive demonstrations
   - Embedded tarot spreads
   - Animated diagrams

The blog should use ISR with a 60-minute revalidation period and include social sharing capabilities with preview images.
```

### 8. Interactive Tarot Learning Center

```
Using MCP-React-UI and MCP-AI-FunctionPack, create an interactive tarot learning center that:

1. Designs an immersive card explorer with:
   - 3D card flipping animations
   - Detailed card meanings (upright and reversed)
   - Symbol explanations with hover tooltips
   - Historical context and variations

2. Implements interactive lessons on:
   - Card meanings and symbolism
   - Spread techniques and layouts
   - Reading interpretation methods
   - Intuitive development exercises

3. Creates practice exercises with:
   - AI-generated scenarios to interpret
   - Multiple-choice meaning quizzes
   - Spread practice with feedback
   - Journal prompts for reflection

4. Includes progress tracking with:
   - Completed lessons and exercises
   - Mastery levels for different cards
   - Personalized learning recommendations
   - Achievements and milestones

The learning center should use gamification elements with celestial-themed progress indicators and "unlocking" animations for new content.
```

## Advanced Features

### 9. Personalization Engine

```
Using MCP-AI-FunctionPack and MCP-Netlify-EdgeDocs, create a sophisticated personalization engine that:

1. Implements a Netlify Edge Function that:
   - Analyzes user behavior and preferences
   - Adapts content based on astrological profile
   - Personalizes language and imagery
   - Adjusts difficulty of interpretations

2. Creates a recommendation system for:
   - Tarot spreads based on current transits
   - Products aligned with user's spiritual path
   - Content relevant to current life situations
   - Practices for spiritual development

3. Develops a user profiling system that tracks:
   - Preferred reading styles and decks
   - Frequently asked question themes
   - Engagement patterns with different content
   - Spiritual interests and focus areas

4. Implements A/B testing for:
   - UI variations and color schemes
   - Content presentation styles
   - Interpretation depth and language
   - Feature discovery approaches

The system should respect privacy while creating a deeply personalized experience that feels magically attuned to each user.
```

### 10. Custom Tarot Deck Creator

```
Using MCP-React-UI and MCP-Design-System-Tailwind, create a custom tarot deck creator that:

1. Implements a drag-and-drop interface for:
   - Uploading custom card images
   - Arranging cards in a deck
   - Adding text and symbols
   - Applying filters and effects

2. Creates a deck management system with:
   - Saving and loading custom decks
   - Sharing decks with other users
   - Exporting decks as images or PDFs
   - Applying deck to readings

3. Includes customization options for:
   - Card backs and borders
   - Text styles and placements
   - Color schemes and filters
   - Symbolism and correspondences

4. Provides templates and starting points:
   - Traditional RWS structure
   - Minimalist designs
   - Nature-themed elements
   - Abstract patterns

The interface should be intuitive with smooth animations, real-time previews, and a gallery of user creations for inspiration.
```

## Integration Features

### 11. Social Sharing System

```
Using MCP-Netlify-EdgeDocs and MCP-React-UI, create a social sharing system for Mystic Arcana that:

1. Generates beautiful, shareable cards for:
   - Tarot readings with card images
   - Astrology charts with key insights
   - Daily horoscopes with cosmic imagery
   - Custom deck creations

2. Implements a Netlify Function that:
   - Creates dynamic Open Graph images
   - Generates unique sharing URLs
   - Tracks sharing analytics
   - Handles deep linking

3. Designs social media integrations for:
   - One-click sharing to platforms
   - Embedding readings in social posts
   - Inviting friends for comparative readings
   - Community challenges and events

4. Creates a privacy system that:
   - Allows users to control what's shared
   - Provides public/private options
   - Enables temporary links that expire
   - Anonymizes personal details

The sharing experience should include magical animations when sharing is completed and beautiful preview cards for social media.
```

### 12. Subscription and Notification System

```
Using MCP-Fullstack-Turbo and MCP-Commerce-Stripe, create a subscription and notification system that:

1. Implements tiered membership levels:
   - Free (basic daily readings)
   - Seeker (additional spreads, no ads)
   - Mystic (premium content, custom features)
   - Oracle (all features, early access, personal readings)

2. Creates a Stripe-integrated subscription management system:
   - Seamless upgrade/downgrade process
   - Prorated billing calculations
   - Gift subscriptions
   - Special offers and discounts

3. Develops a notification system for:
   - Daily card draws and horoscopes
   - Significant astrological events
   - New content relevant to interests
   - Subscription status and renewals

4. Implements delivery channels:
   - In-app notifications with animations
   - Email digests with beautiful templates
   - Push notifications (optional)
   - SMS for premium members (optional)

The subscription interface should clearly communicate value with magical comparison animations and special "unlock" effects when upgrading.
```

## Technical Infrastructure

### 13. Performance Optimization System

```
Using MCP-Dev-NextJS and MCP-Netlify-EdgeDocs, create a performance optimization system that:

1. Implements advanced image handling:
   - Responsive images with srcset
   - Lazy loading with blur placeholders
   - WebP/AVIF format conversion
   - Image optimization pipeline

2. Creates a sophisticated caching strategy:
   - Edge caching for static assets
   - ISR for semi-dynamic content
   - Client-side caching for user data
   - Prefetching for likely user paths

3. Develops code optimization techniques:
   - Code splitting and lazy loading
   - Tree shaking for minimal bundles
   - Critical CSS extraction
   - Font loading optimization

4. Implements monitoring and analytics:
   - Core Web Vitals tracking
   - User experience metrics
   - Performance budgets
   - Automated performance testing

The system should ensure the site feels magical and responsive, with transitions and animations that never feel sluggish.
```

### 14. Analytics and Insights Dashboard

```
Using MCP-Fullstack-Turbo and MCP-AI-FunctionPack, create an analytics and insights dashboard that:

1. Tracks user engagement with:
   - Reading types and frequencies
   - Card appearance patterns
   - Question themes and topics
   - Feature usage and flows

2. Visualizes data with:
   - Interactive charts and graphs
   - Heatmaps of card selections
   - User journey flowcharts
   - Cohort analysis views

3. Provides business insights on:
   - Conversion rates and funnels
   - Subscription metrics and retention
   - Content performance and engagement
   - Product popularity and reviews

4. Implements AI-powered trend analysis:
   - Identifying emerging question patterns
   - Detecting seasonal trends
   - Recommending content creation priorities
   - Suggesting feature improvements

The dashboard should use the mystical theme with constellation-style data visualizations and cosmic color schemes.
```

## Use these prompts with the appropriate MCP servers to generate code that is:
- Specifically tailored to Mystic Arcana's unique needs
- Optimized for performance and user experience
- Consistent with the mystical, cosmic design language
- Structured for maintainability and future expansion

When using these prompts with Augment:
1. Select the appropriate prompt for your current task
2. Ensure the relevant MCP servers are connected
3. Provide any additional context specific to your implementation
4. Review and refine the generated code as needed
