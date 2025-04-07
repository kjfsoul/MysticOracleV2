# Tarot-Specific MCP Prompts for Mystic Arcana

This document contains specialized prompts for developing the tarot card features of Mystic Arcana, leveraging our MCP servers for optimal results.

## Tarot Card Database Schema

```
Using MCP-Fullstack-Turbo, design a comprehensive Prisma schema for the tarot card system that includes:

1. Card entity with:
   - Unique identifier
   - Name (e.g., "The Fool", "Ten of Cups")
   - Suit (Major Arcana, Cups, Pentacles, Swords, Wands)
   - Number (0-21 for Major Arcana, 1-14 for Minor)
   - Keywords (array of related concepts)
   - Upright meaning (detailed interpretation)
   - Reversed meaning (detailed interpretation)
   - Image URLs (standard, high-res, thumbnail)
   - Elemental association (Fire, Water, Air, Earth)
   - Astrological association (planet or sign)
   - Numerological significance
   - Colors and symbols
   - Traditional and modern interpretations

2. Spread entity with:
   - Name (e.g., "Celtic Cross", "Three Card")
   - Description and purpose
   - Position definitions (array of positions with meanings)
   - Recommended question types
   - Difficulty level
   - Historical context

3. Reading entity with:
   - User reference
   - Timestamp
   - Question asked
   - Spread used
   - Cards drawn (with positions)
   - Interpretation
   - User notes
   - Favorited status

4. Relationships between:
   - Cards and their historical appearances in readings
   - Users and their favorite cards/spreads
   - Cards and their complementary/contrasting cards

Include appropriate indexes for query performance and consider versioning for card interpretations that may evolve over time.
```

## Tarot Card Component

```
Using MCP-React-UI and MCP-Design-System-Tailwind, create a versatile TarotCard component that:

1. Accepts the following props:
   - card: Full card data object
   - size: 'sm' | 'md' | 'lg' | 'xl'
   - variant: 'standard' | 'minimal' | 'detailed' | 'mystical'
   - orientation: 'upright' | 'reversed'
   - isRevealed: boolean
   - isSelectable: boolean
   - isSelected: boolean
   - onClick: Function
   - className: For additional styling

2. Features beautiful animations for:
   - Card flip (3D effect with backface visibility)
   - Card reveal (sliding up from a deck)
   - Card hover (subtle glow and elevation)
   - Card selection (golden border pulse)
   - Reversed orientation (smooth rotation)

3. Implements responsive design:
   - Adapts size based on viewport
   - Maintains aspect ratio
   - Optimizes images for different sizes
   - Ensures touch targets are accessible

4. Includes accessibility features:
   - Proper ARIA attributes
   - Keyboard navigation
   - Screen reader descriptions
   - Focus indicators

5. Provides theme variants:
   - Classic Rider-Waite-Smith style
   - Minimalist modern design
   - Cosmic/celestial theme
   - Custom theme support

The component should use Framer Motion for animations and implement proper loading states with skeleton placeholders. Include TypeScript types for all props and exported components.
```

## Tarot Spread Layout System

```
Using MCP-React-UI, create a flexible TarotSpreadLayout system that:

1. Supports common spread layouts:
   - Single Card (daily draw)
   - Three Card (past/present/future)
   - Celtic Cross (10 cards in traditional layout)
   - Horseshoe (7 cards in arc)
   - Star Spread (7 cards in star pattern)
   - Relationship Spread (mirrored layout)
   - Custom layouts with position mapping

2. Implements a layout engine that:
   - Positions cards based on spread type
   - Scales appropriately for different screen sizes
   - Maintains proper spacing between cards
   - Handles card overlap for complex spreads
   - Supports both horizontal and vertical orientations

3. Includes interactive features:
   - Zoom and pan for large spreads
   - Click/tap to focus on individual cards
   - Animated transitions between spread views
   - Sequential card reveal animations
   - Position labels with tooltips

4. Provides a developer API for:
   - Creating custom spread layouts
   - Defining card positions and meanings
   - Setting reveal sequences and timing
   - Customizing spacing and scaling
   - Handling card selection events

5. Optimizes for different devices:
   - Desktop (mouse interaction)
   - Tablet (touch with medium screen)
   - Mobile (touch with small screen)
   - Accessibility devices (keyboard navigation)

The system should be highly composable, allowing for reuse across different reading types while maintaining the mystical aesthetic of Mystic Arcana.
```

## AI Tarot Reading Generator

```
Using MCP-AI-FunctionPack and MCP-Netlify-EdgeDocs, create an advanced AI tarot reading generator that:

1. Implements a Netlify Function with:
   - Input validation for user questions and context
   - Card selection logic (random or weighted)
   - OpenAI API integration with proper error handling
   - Response formatting and structure
   - Caching for performance optimization

2. Designs a sophisticated prompt engineering system that:
   - Creates dynamic system prompts based on reading type
   - Incorporates card meanings and positions
   - Adapts to user's question context and emotional tone
   - Includes relevant astrological factors
   - Maintains consistent mystical voice and tone

3. Generates personalized readings with:
   - Overall theme and summary
   - Individual card interpretations in context
   - Connections between cards and their positions
   - Actionable insights and guidance
   - Follow-up reflection questions

4. Implements advanced features:
   - Progressive generation for longer readings
   - Streaming response for immediate feedback
   - Fallback mechanisms for API failures
   - Content filtering for appropriate guidance
   - Reading history for continuity in follow-ups

5. Optimizes for different reading types:
   - Quick daily card draws
   - Specific question readings
   - General life path guidance
   - Relationship dynamics analysis
   - Career and decision support
   - Spiritual growth exploration

The system should balance mystical insight with practical guidance, avoiding generic fortune-telling while providing meaningful, personalized interpretations.
```

## Tarot Journal System

```
Using MCP-Fullstack-Turbo and MCP-React-UI, create a tarot journaling system that:

1. Implements a data model for:
   - Journal entries linked to readings
   - Reflection prompts based on cards drawn
   - Mood and energy tracking
   - Pattern recognition across readings
   - Personal card associations and meanings

2. Creates an intuitive journaling interface with:
   - Rich text editor with formatting options
   - Card reference insertion
   - Image and symbol embedding
   - Mood and energy selectors
   - Private note sections

3. Develops reflection tools including:
   - Guided prompts based on card meanings
   - Comparison with past readings
   - Pattern visualization over time
   - Card frequency analysis
   - Theme extraction from journal content

4. Implements privacy and sharing features:
   - End-to-end encryption for private entries
   - Selective sharing options
   - Export functionality (PDF, markdown)
   - Backup and sync across devices
   - Optional community insights (anonymized)

5. Creates visualization components for:
   - Reading history timeline
   - Card appearance frequency
   - Mood correlations with cards
   - Seasonal patterns and cycles
   - Personal growth indicators

The journal system should feel like a sacred, private space while offering powerful insights through the connection of readings, reflections, and personal growth over time.
```

## Tarot Learning System

```
Using MCP-CMS-Headless and MCP-React-UI, create a comprehensive tarot learning system that:

1. Implements a structured curriculum with:
   - Beginner fundamentals (card meanings, basic spreads)
   - Intermediate techniques (intuitive reading, symbolism)
   - Advanced mastery (complex spreads, integration with other systems)
   - Specialized topics (historical context, different traditions)

2. Creates interactive learning components:
   - Card explorer with detailed meanings and symbolism
   - Symbol dictionary with visual references
   - Interactive spread tutorials with placement guides
   - Reading practice with feedback
   - Knowledge quizzes and assessments

3. Develops a progress tracking system:
   - Skill mastery indicators for different cards
   - Completion tracking for lessons and modules
   - Practice session logging and improvement metrics
   - Custom learning path recommendations
   - Achievement and milestone celebrations

4. Implements multimedia content delivery:
   - Text lessons with rich formatting
   - Illustrative animations for concepts
   - Video demonstrations of reading techniques
   - Audio guided meditations for intuition development
   - Interactive exercises and challenges

5. Creates a personalized learning experience:
   - Adaptive difficulty based on progress
   - Focus on cards that need more practice
   - Learning style adaptation (visual, auditory, kinesthetic)
   - Spaced repetition for optimal retention
   - Connection to personal readings for context

The learning system should make tarot accessible to beginners while offering depth for advanced practitioners, all within the mystical aesthetic of Mystic Arcana.
```

## Tarot Community Features

```
Using MCP-Fullstack-Turbo and MCP-Netlify-EdgeDocs, create a tarot community system that:

1. Implements community features:
   - Discussion forums for tarot topics
   - Reading exchanges between users
   - Deck showcases and reviews
   - Study groups for learning
   - Community challenges and events

2. Creates a moderation system:
   - Content guidelines and policies
   - User reputation and trust levels
   - Flagging and reporting mechanisms
   - Moderation queue and actions
   - Community self-moderation tools

3. Develops personalization features:
   - User profiles with tarot preferences
   - Reading style and deck showcases
   - Expertise badges and achievements
   - Following favorite readers and teachers
   - Personalized content feeds

4. Implements engagement mechanisms:
   - Upvoting and appreciation for helpful content
   - Featured readings and interpretations
   - Weekly challenges and prompts
   - Seasonal events and celebrations
   - Learning circles and mentorship

5. Creates privacy and safety features:
   - Granular privacy controls
   - Anonymous participation options
   - Content warnings for sensitive topics
   - Safe space policies and enforcement
   - Data minimization and protection

The community system should foster a supportive, mystical environment where users can deepen their tarot practice through shared wisdom while maintaining appropriate boundaries.
```

## Custom Deck Creator

```
Using MCP-React-UI and MCP-Design-System-Tailwind, create a custom tarot deck creator that:

1. Implements a deck management system:
   - Creating new deck projects
   - Naming and describing decks
   - Setting card count and structure
   - Choosing card back designs
   - Managing multiple deck projects

2. Creates a card editor with:
   - Image upload and manipulation
   - Text overlay with font options
   - Symbol library and placement
   - Color adjustments and filters
   - Template-based starting points

3. Develops a deck organization interface:
   - Card sorting and arrangement
   - Suit and number assignment
   - Meaning and keyword association
   - Bulk editing capabilities
   - Preview mode for full deck review

4. Implements sharing and export features:
   - High-quality image export
   - Printable PDF generation
   - Deck sharing with community
   - Collaborative editing options
   - Import from existing templates

5. Creates a usage system for custom decks:
   - Integration with reading tools
   - Custom spread designs
   - Personal meaning overrides
   - Usage tracking and statistics
   - Revision history and versioning

The deck creator should balance creative freedom with guidance, allowing users to express their unique vision while maintaining the structural integrity of tarot tradition.
```

## Tarot API System

```
Using MCP-Netlify-EdgeDocs and MCP-Fullstack-Turbo, create a comprehensive tarot API system that:

1. Implements RESTful endpoints for:
   - Card information retrieval
   - Random card drawing
   - Spread generation
   - Reading creation and retrieval
   - User preference management

2. Creates a GraphQL API for:
   - Complex queries across related entities
   - Custom field selection
   - Nested relationship traversal
   - Subscription for real-time updates
   - Batched operations for performance

3. Develops authentication and authorization:
   - API key management for external access
   - OAuth integration for user context
   - Rate limiting and usage tiers
   - Permission scopes and access control
   - Audit logging for security

4. Implements developer tools:
   - Interactive API documentation
   - SDK generation for common languages
   - Webhook integration for events
   - Playground for query testing
   - Usage analytics and monitoring

5. Creates integration capabilities:
   - Embedding readings in external sites
   - Social media sharing endpoints
   - Export formats (JSON, CSV, PDF)
   - Webhook notifications for events
   - Batch processing for enterprise use

The API system should be developer-friendly while maintaining the mystical essence of tarot, enabling both internal features and potential external integrations.
```

## Tarot Analytics Dashboard

```
Using MCP-Fullstack-Turbo and MCP-Design-System-Tailwind, create a tarot analytics dashboard that:

1. Visualizes personal reading patterns:
   - Card frequency analysis
   - Suit and element distribution
   - Reading type preferences
   - Temporal patterns (time of day, day of week, seasons)
   - Question themes and categories

2. Implements insight generation:
   - Recurring themes in readings
   - Cards that appear together frequently
   - Emotional response patterns
   - Progress on identified challenges
   - Guidance implementation tracking

3. Creates comparative analysis:
   - Personal vs. community averages
   - Historical trends over time
   - Before/after significant events
   - Cross-reference with journal entries
   - Correlation with reported outcomes

4. Develops predictive features:
   - Identifying potential upcoming themes
   - Suggesting beneficial spreads based on history
   - Recommending focus areas for growth
   - Highlighting blind spots in perspective
   - Suggesting timing for important decisions

5. Implements an intuitive interface with:
   - Interactive charts and graphs
   - Filtering and time range selection
   - Drill-down capabilities for details
   - Export and sharing options
   - Insight summaries and highlights

The analytics dashboard should transform raw reading data into meaningful insights while maintaining the mystical interpretation that makes tarot valuable.
```

Use these specialized prompts with the appropriate MCP servers to create a rich, immersive tarot experience within Mystic Arcana. Each prompt is designed to leverage the strengths of specific MCP servers while maintaining consistency with the overall mystical aesthetic and user experience of the platform.
