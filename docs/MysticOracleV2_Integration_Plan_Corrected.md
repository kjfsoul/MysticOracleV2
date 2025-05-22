# Comprehensive Integration Plan for MysticOracleV2

## Executive Summary

This plan synthesizes the technical alternatives I proposed with the Continuous Learning Framework from the Mystic Arcana Deep Personalization strategy. The result is a cohesive roadmap that addresses immediate technical issues while laying the groundwork for an advanced personalization system.

## Phase 1: Foundation Stabilization (Weeks 1-2)

### 1.1 Fix Critical UI Issues

- **Fix the purple circle background issue**
  - Remove SVG elements causing the issue
  - Implement proper z-indexing for background elements
  - Ensure responsive design across devices

- **Improve spacing and layout**
  - Standardize component padding and margins
  - Implement consistent grid system
  - Fix responsive breakpoints

### 1.2 Implement Core Calculation Engine

- **Integrate Swiss Ephemeris via WebAssembly**

  ```javascript
  // Implementation approach
  class AstrologyEngine {
    constructor() {
      this.ephemeris = new SwissEphemerisWASM();
      this.ready = this.ephemeris.initialize('/ephemeris-data/');
    }

    async calculateChart(birthData) {
      await this.ready;
      return this.ephemeris.calculateNatalChart(birthData);
    }
  }
  ```

- **Set up client-side caching with IndexedDB**
  - Cache common calculations
  - Store user's personal chart data
  - Implement versioning for cached data

### 1.3 Establish Resilient API Layer

- **Implement Circuit Breaker Pattern for OpenAI**
  - Add fallback to template-based interpretations
  - Set up monitoring for API health
  - Implement exponential backoff strategy

- **Create Upstash Redis integration for server-side caching**
  - Cache API responses
  - Store frequently accessed data
  - Implement TTL-based cache invalidation

## Phase 2: User Profile Foundation (Weeks 3-4)

### 2.1 Implement Basic User Archetype System

- **Create User Spiritual Profile Schema**

  ```typescript
  interface SpiritualProfile {
    userId: string;
    zodiacPlacements: Record<string, string>;
    dominantElements: Record<string, number>;
    cardAffinities: Record<string, number>;
    readingHistory: ReadingRecord[];
    journalTags: string[];
    lastUpdated: Date;
  }
  ```

- **Set up Supabase Tables for Profile Storage**
  - Users table with profile metadata
  - Reading history with timestamps
  - Journal entries with emotion tags

### 2.2 Implement Tarot System Enhancements

- **Create Content Management System for Tarot Deck**
  - Use Contentful for card descriptions and images
  - Implement seasonal variants
  - Set up versioning for interpretations

- **Develop Daily Tarot Feature**
  - Implement card selection algorithm
  - Create interpretation generation system
  - Add user feedback mechanism

### 2.3 Set up Basic Feedback Loop

- **Implement Simple Feedback UI**
  - Add like/dislike buttons to interpretations
  - Create emoji reaction system
  - Store feedback in Supabase

- **Create Analytics Pipeline**
  - Track user interactions
  - Measure time spent on readings
  - Record which cards resonate most

## Phase 3: Vector Embedding System (Weeks 5-6)

### 3.1 Implement Vector Database

- **Set up pgvector Extension in Supabase**

  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;

  CREATE TABLE user_embeddings (
    id UUID PRIMARY KEY REFERENCES users(id),
    profile_embedding VECTOR(1536),
    journal_embedding VECTOR(1536),
    last_updated TIMESTAMP WITH TIME ZONE
  );
  ```

- **Create Embedding Generation Service**
  - Use OpenAI embeddings API
  - Implement batching for efficiency
  - Set up background job for processing

### 3.2 Develop Journal Analysis System

- **Create Emotion Tagging Service**

  ```javascript
  class JournalAnalyzer {
    async analyzeEntry(text) {
      // Generate embeddings
      const embedding = await this.generateEmbedding(text);

      // Extract emotion tags
      const emotions = await this.extractEmotions(text);

      // Store in database
      await this.storeAnalysis(text, embedding, emotions);

      return { embedding, emotions };
    }
  }
  ```

- **Implement Journal Prompt System**
  - Create prompt templates based on user profile
  - Implement seasonal and moon phase variations
  - Set up recommendation engine

### 3.3 Integrate Background Processing

- **Implement Netlify Background Functions**
  - Set up chart calculation jobs
  - Create embedding generation pipeline
  - Implement periodic profile updates

- **Create Job Scheduling System**
  - Schedule daily tarot draws
  - Set up astrological transit notifications
  - Implement retry mechanism for failed jobs

## Phase 4: Personalization Engine (Weeks 7-8)

### 4.1 Implement Adaptive Interpretation Engine

- **Create Dynamic Prompt Templates**

  ```javascript
  class InterpretationEngine {
    generatePrompt(card, userProfile) {
      const basePrompt = this.getBasePrompt(card);

      // Personalize based on user profile
      const personalizedPrompt = this.injectPersonalization(
        basePrompt,
        userProfile
      );

      return personalizedPrompt;
    }
  }
  ```

- **Set up Multi-Model Fallback System**
  - Implement OpenAI as primary
  - Add Anthropic Claude as secondary
  - Create template-based fallback

### 4.2 Develop Continuous Learning System

- **Create Profile Update Pipeline**
  - Update profile after each reading
  - Incorporate feedback into profile
  - Adjust weights based on recency

- **Implement A/B Testing Framework**
  - Test different interpretation styles
  - Measure engagement metrics
  - Automatically adjust based on results

### 4.3 Build Visualization Components

- **Create User Journey Timeline**
  - Visualize archetype evolution
  - Show significant readings and insights
  - Highlight patterns and trends

- **Implement Interactive Birth Chart**
  - Show planetary positions
  - Highlight aspects and patterns
  - Provide interactive explanations

## Phase 5: Advanced Features & Integration (Weeks 9-10)

### 5.1 Implement Real-time Updates

- **Set up Supabase Realtime**

  ```javascript
  class RealtimeManager {
    constructor() {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
      );
    }

    subscribeToUpdates(userId, callback) {
      return this.supabase
        .channel(`user-${userId}`)
        .on('broadcast', { event: 'profile-update' }, callback)
        .subscribe();
    }
  }
  ```

- **Implement Progressive Web App Features**
  - Add offline support
  - Implement background sync
  - Create push notifications

### 5.2 Develop Ritual Recommendation System

- **Create Ritual Database**
  - Organize by moon phase
  - Categorize by intention
  - Link to astrological events

- **Implement Recommendation Algorithm**
  - Match rituals to user profile
  - Consider seasonal factors
  - Incorporate feedback history

### 5.3 Finalize UI/UX Personalization

- **Implement Theme Adaptation**
  - Adjust colors based on user preferences
  - Customize imagery and symbols
  - Adapt layout to usage patterns

- **Create Personalized Dashboard**
  - Show relevant insights
  - Highlight recommended actions
  - Display personalized content

## Technical Architecture Integration

### Data Flow Architecture

```ascii
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Client Layer   │     │  Serverless     │     │  Data Storage   │
│                 │     │  Functions      │     │                 │
│ - React/TS UI   │     │ - Netlify Funcs │     │ - Supabase      │
│ - IndexedDB     │◄───►│ - Background    │◄───►│ - Upstash Redis │
│ - Web Workers   │     │   Processing    │     │ - pgvector      │
│ - PWA Features  │     │ - WebAssembly   │     │ - Contentful    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                        ▲                       ▲
        │                        │                       │
        └────────────────────────┼───────────────────────┘
                                 │
                       ┌─────────────────┐
                       │ External APIs   │
                       │                 │
                       │ - OpenAI        │
                       │ - Anthropic     │
                       │ - Swiss Eph     │
                       └─────────────────┘
```

### Personalization System Architecture

```ascii
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    User Interaction Layer                   │
│                                                             │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                                                             │
│                    Event Tracking System                    │
│                                                             │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                                                             │
│                 Vector Embedding Generation                 │
│                                                             │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                                                             │
│                  User Archetype Profiling                   │
│                                                             │
└──────────┬────────────────────┬────────────────┬────────────┘
           │                    │                │
┌──────────▼──────────┐ ┌───────▼───────┐ ┌──────▼───────────┐
│                     │ │               │ │                  │
│ Adaptive Content    │ │ Personalized  │ │ Recommendation   │
│ Generation          │ │ UI/UX         │ │ Engine           │
│                     │ │               │ │                  │
└─────────────────────┘ └───────────────┘ └──────────────────┘
```

## Implementation Timeline

| Week | Focus Area | Key Deliverables |
|------|------------|------------------|
| 1-2 | Foundation Stabilization | Fixed UI issues, Swiss Ephemeris integration, Circuit breaker pattern |
| 3-4 | User Profile Foundation | User profile schema, Tarot CMS, Basic feedback system |
| 5-6 | Vector Embedding System | pgvector setup, Embedding generation, Journal analysis |
| 7-8 | Personalization Engine | Adaptive interpretations, Continuous learning, Visualizations |
| 9-10 | Advanced Features | Realtime updates, Ritual recommendations, UI personalization |

## Risk Assessment & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| OpenAI API instability | High | Medium | Implement multi-model fallback and caching |
| Performance issues with vector calculations | Medium | High | Use WebAssembly and background processing |
| User privacy concerns | High | Medium | Implement clear opt-in and data controls |
| Complex personalization overwhelming users | Medium | Medium | Gradual rollout with A/B testing |
| Technical debt from rapid implementation | Medium | High | Regular refactoring sprints and code reviews |

## Success Metrics

1. **Technical Performance**
   - API response time < 200ms
   - Client-side calculation time < 1s
   - Offline functionality working 100%

2. **User Engagement**
   - 30% increase in time spent in app
   - 25% increase in return rate
   - 40% increase in journal entries

3. **Personalization Effectiveness**
   - 50% positive feedback on interpretations
   - 35% increase in ritual completion
   - 20% increase in premium conversions

## Next Steps

1. ✅ Fix the immediate UI issues (purple circle, spacing)
   - Fixed the purple circle background issue by conditionally rendering the AstrologyWheel background
   - Fixed the share-modal.js error by improving the initialization logic
   - Fixed the Framer Motion errors by removing problematic animations
2. ✅ Implement Swiss Ephemeris for accurate calculations
   - Created a TypeScript wrapper for Swiss Ephemeris
   - Implemented client-side caching with IndexedDB
   - Added Web Worker support for offloading calculations
   - Created a unified facade for easy integration
3. ✅ Implement cosmic background redesign
   - Created a multi-layered animated cosmic background
   - Improved typography with proper font selection
   - Enhanced visual hierarchy and readability
   - Optimized performance with CSS animations
4. ✅ Develop the daily tarot feature
   - Created placeholder tarot card images
   - Implemented tarot card data model
   - Created daily card component with local data
   - Added card flipping animation
5. ✅ Set up the basic user profile system
   - Created authentication components for login and signup
   - Implemented user profile data model
   - Set up Supabase authentication integration
   - Created profile management UI
6. ✅ Implement vector embedding system
   - Set up pgvector extension in Supabase
   - Created embedding generation service
   - Implemented journal analysis with embeddings
   - Added similarity search functionality
7. Enhance personalization features
8. Implement premium subscription features

## Progress Updates

### 2024-05-15: Implemented Swiss Ephemeris for Accurate Calculations

1. **Created Swiss Ephemeris Integration**
   - Implemented a TypeScript wrapper for Swiss Ephemeris calculations
   - Created interfaces for planetary positions and chart data
   - Added mock implementations for testing until WebAssembly is integrated

2. **Implemented Client-side Caching**
   - Created an IndexedDB cache for ephemeris calculations
   - Implemented TTL-based cache invalidation
   - Added methods for caching planetary positions and birth charts

3. **Added Web Worker Support**
   - Created a Web Worker for offloading calculations from the main thread
   - Implemented message passing for calculation requests and responses
   - Added fallback to direct calculation when Web Workers are not supported

4. **Created a Unified Facade**
   - Implemented a facade that combines Swiss Ephemeris, caching, and Web Workers
   - Added error handling and fallbacks for robustness
   - Created a birth chart service for calculating and interpreting charts

### 2024-05-15: Fixed Critical UI Issues

1. **Fixed the purple circle background issue**
   - Added a `hideBackground` prop to the AstrologyWheel component
   - Made the background conditional based on the prop
   - Updated all instances of AstrologyWheel to use the prop appropriately

2. **Fixed the share-modal.js error**
   - Improved the initialization logic to check document readiness
   - Added proper error handling to prevent console errors

3. **Fixed the Framer Motion errors**
   - Removed problematic motion animations from the landing page
   - Replaced motion components with standard HTML elements
   - Maintained the visual appearance while improving stability

### 2024-05-16: Implemented Vector Embedding System

1. **Set up pgvector in Supabase**
   - Enabled the pgvector extension for vector similarity search
   - Added embedding column to journal_entries table
   - Created index for efficient similarity queries
   - Implemented SQL function for finding similar entries

2. **Created Serverless Functions for Embeddings**
   - Implemented generate-embedding function for text analysis
   - Created store-journal-entry function for saving with embeddings
   - Added find-similar-entries function for similarity search
   - Set up proper authentication and error handling

3. **Developed Client-Side Embedding Service**
   - Created TypeScript interface for embedding operations
   - Implemented journal analysis with emotion and tag extraction
   - Added similarity search functionality
   - Created mock embedding generation for development

4. **Enhanced Journal Component**
   - Added title field to journal entries
   - Implemented emotion and tag analysis
   - Created UI for displaying similar entries
   - Added personalized journal prompts

### 2024-05-16: Implemented User Authentication System

1. **Set Up Supabase Authentication**
   - Configured authentication providers
   - Implemented secure token handling
   - Set up row-level security policies
   - Created user profile table

2. **Developed Authentication Components**
   - Created login and signup forms
   - Implemented password reset functionality
   - Added social login options
   - Created protected routes

3. **Built User Profile Management**
   - Created profile editing interface
   - Implemented settings management
   - Added birth information for astrology features
   - Created saved readings section

### 2024-05-15: Implemented Cosmic Background Redesign

1. **Created Cosmic Background Component**
   - Implemented a multi-layered animated cosmic background
   - Added parallax star layers for depth perception
   - Created shooting star animations for visual interest
   - Added subtle mystic symbol overlays with glow effects

2. **Improved Typography and Visual Hierarchy**
   - Added Cormorant Garamond and Marcellus serif fonts
   - Enhanced heading styles with proper tracking and sizing
   - Improved text readability with gradient overlays
   - Maintained consistent spacing and alignment

3. **Optimized Performance**
   - Used CSS animations for better performance
   - Implemented conditional rendering for effects
   - Added responsive design considerations
   - Ensured proper z-indexing for all elements

### 2024-05-15: Implemented Daily Tarot Feature

1. **Created Placeholder Tarot Card Images**
   - Designed SVG placeholders for major and minor arcana cards
   - Implemented card back design with mystical symbols
   - Created directory structure for tarot card organization
   - Added metadata to cards for proper categorization

2. **Implemented Tarot Card Data Model**
   - Created comprehensive data structure for tarot cards
   - Added card meanings, keywords, and descriptions
   - Implemented functions for card selection and filtering
   - Created daily card selection algorithm based on date

3. **Developed Card Components**
   - Created daily card component with local data
   - Implemented card flipping animation with CSS
   - Added fallback handling for missing card images
   - Ensured responsive design for all screen sizes

## Alternative Technical Solutions

### 1. Planetary Position Calculation Optimization

**Recommended Solution**: Redis + Worker Threads

**Better Alternative**:

- Use **Swiss Ephemeris** library with a local ephemeris file instead of API calls
- Implement **Web Workers** for client-side calculations to offload from the main thread
- Use **IndexedDB** for client-side caching of common calculations

```javascript
// Implementation example
import * as SwissEph from 'swisseph';

export class LocalEphemerisCalculator {
  private ephemeris: SwissEph;

  constructor() {
    this.ephemeris = new SwissEph('/ephemeris-data/');
  }

  calculatePlanetaryPositions(date, time, location) {
    // Check IndexedDB cache first
    const cachedResult = await this.checkCache(date, time, location);
    if (cachedResult) return cachedResult;

    // Use Web Worker for calculation
    return new Promise((resolve) => {
      const worker = new Worker('/workers/ephemeris-worker.js');
      worker.postMessage({date, time, location});
      worker.onmessage = (e) => {
        this.cacheResult(date, time, location, e.data);
        resolve(e.data);
      };
    });
  }
}
```

**Benefits**:

- Eliminates network latency completely
- Works offline
- Reduces server costs
- More accurate calculations

### 2. Caching Solution with Supabase + Netlify

**Recommended Solution**: Redis + Supabase

**Better Alternative**:

- Use **Cloudflare KV** for edge caching
- Implement **Netlify Edge Functions** with built-in caching
- Use **Upstash Redis** for serverless Redis that works well with Netlify

```javascript
// Implementation example
import { createClient } from '@netlify/edge-functions';
import { Redis } from '@upstash/redis';

export class EdgeCacheManager {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
  }

  async getCachedData(key) {
    return await this.redis.get(key);
  }

  async setCachedData(key, data, ttl = 3600) {
    await this.redis.setex(key, ttl, JSON.stringify(data));
  }
}
```

**Benefits**:

- Better integration with Netlify's serverless architecture
- Lower latency with edge caching
- Pay-per-use pricing model fits serverless architecture
- Simpler implementation

### 3. WebSocket Architecture

**Recommended Solution**: WebSocketServer + Supabase Realtime

**Better Alternative**:

- Use **Supabase Realtime** exclusively
- Implement **Server-Sent Events (SSE)** for one-way updates
- Use **Pusher** for managed WebSocket service

```javascript
// Implementation example
import { createClient } from '@supabase/supabase-js';

export class RealtimeAstrologyUpdates {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  subscribeToUpdates(userId, callback) {
    return this.supabase
      .channel(`user-${userId}`)
      .on('broadcast', { event: 'astrology-update' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  }

  async broadcastUpdate(data) {
    await this.supabase
      .from('broadcast')
      .insert([{ type: 'astrology-update', data }]);
  }
}
```

**Benefits**:

- Eliminates need for additional WebSocket server
- Leverages existing Supabase infrastructure
- Simpler authentication and authorization
- Reduced operational complexity

### 4. Background Job Processing

**Recommended Solution**: Bull + Redis

**Better Alternative**:

- Use **Netlify Background Functions**
- Implement **AWS Step Functions** for complex workflows
- Use **Temporal.io** for durable execution

```javascript
// Implementation example
export async function backgroundCalculation(event, context) {
  // This is a Netlify background function
  const { userId, calculationType } = JSON.parse(event.body);

  try {
    // Perform long-running calculation
    const result = await performCalculation(calculationType, userId);

    // Store result in database
    await storeCalculationResult(userId, result);

    // Notify user via Supabase Realtime
    await notifyUser(userId, 'calculation-complete');

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error('Background calculation failed:', error);
    await notifyUser(userId, 'calculation-failed');
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
```

**Benefits**:

- Native integration with Netlify
- No additional infrastructure needed
- Simpler deployment and monitoring
- Cost-effective for sporadic workloads

### 5. OpenAI Error Recovery

**Recommended Solution**: Retry with exponential backoff

**Better Alternative**:

- Implement **Circuit Breaker Pattern**
- Use **Fallback Content** from pre-generated templates
- Implement **Multiple LLM Providers** (OpenAI, Anthropic, etc.)

```javascript
// Implementation example
import { CircuitBreaker } from 'opossum';

export class ResilientAIClient {
  private openaiBreaker;
  private anthropicBreaker;

  constructor() {
    this.openaiBreaker = new CircuitBreaker(this.callOpenAI, {
      failureThreshold: 3,
      resetTimeout: 30000,
    });

    this.anthropicBreaker = new CircuitBreaker(this.callAnthropic, {
      failureThreshold: 3,
      resetTimeout: 30000,
    });

    // Register fallback strategy
    this.openaiBreaker.fallback(async (params) => {
      try {
        // Try Anthropic if OpenAI fails
        return await this.anthropicBreaker.fire(params);
      } catch (error) {
        // If all AI services fail, use template
        return this.getTemplateResponse(params);
      }
    });
  }

  async generateInterpretation(params) {
    return await this.openaiBreaker.fire(params);
  }
}
```

**Benefits**:

- More robust error handling
- Graceful degradation
- Multiple fallback options
- Better user experience during API outages

### 6. Tarot Deck Versioning

**Recommended Solution**: Database versioning with metadata

**Better Alternative**:

- Use **Content Management System** (Contentful, Sanity)
- Implement **GraphQL API** for flexible querying
- Use **Feature Flags** for seasonal variants

```javascript
// Implementation example
import { createClient } from 'contentful';

export class TarotDeckManager {
  private contentful;

  constructor() {
    this.contentful = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    });
  }

  async getTarotDeck(season = null, variant = 'standard') {
    const query = {
      content_type: 'tarotCard',
      include: 2,
      'fields.variant': variant,
    };

    if (season) {
      query['fields.seasons'] = season;
    }

    const response = await this.contentful.getEntries(query);
    return this.transformContentfulResponse(response);
  }
}
```

**Benefits**:

- Non-technical users can update content
- Preview capabilities
- Versioning and publishing workflow
- Separation of content and code

### 7. External Ephemeris Integration

**Recommended Solution**: Direct API integration with caching

**Better Alternative**:

- Use **Swiss Ephemeris** as a local library
- Implement **Progressive Enhancement** with basic calculations first
- Use **WebAssembly** for high-performance calculations

```javascript
// Implementation example
import * as SwissEph from 'swisseph';

export class HybridEphemerisCalculator {
  private swissEph;

  constructor() {
    // Initialize Swiss Ephemeris with local data files
    this.swissEph = new SwissEph('/ephemeris-data/');
  }

  async calculatePlanetaryPositions(date, options) {
    try {
      // Start with basic calculations immediately
      const basicPositions = this.calculateBasicPositions(date);

      // Then enhance with more detailed calculations
      const detailedPositions = await this.calculateDetailedPositions(date, options);

      return {
        ...basicPositions,
        ...detailedPositions
      };
    } catch (error) {
      // Fallback to basic calculations if detailed ones fail
      return this.calculateBasicPositions(date);
    }
  }
}
```

**Benefits**:

- Works offline
- Progressive loading for better UX
- No API rate limits or costs
- More control over calculation accuracy

## Continuous Learning Framework Integration

### 1. User Spiritual Archetype Profile

- Continuously update a dynamic profile for each user:
  - Zodiac placements (natal chart + updates)
  - Most drawn cards (e.g., repeats of The Tower)
  - Emotion tags from journal entries
  - Preferred themes (e.g., shadow work, clarity, rebirth)
- Use a vector or embedding model to link journal input and interpretations to emotional/spiritual resonance.

### 2. Adaptive Interpretation Engine

- Shift tone, depth, and voice of AI interpretations based on user's profile.
- Example: If user journals reflect trauma release, The Devil card interpretation may emphasize liberation.
- Multi-model fallback (OpenAI, Claude, fallback templates)
- Circuit breaker + cache stored per archetype to ensure consistency

### 3. Feedback Loop System

- Explicit feedback prompts:
  - "Did this interpretation resonate with you today?" [Yes/No]
  - Emoji/mood sliders for insights
- Implicit feedback detection:
  - Time spent reading
  - Scroll patterns, bookmarking, or journaling post-reading
- Feedback fed into user profile for continuous refinement

### 4. Customization Channels

| Channel | Personalization Approach |
|--------|----------------------------|
| Tarot | Mood-aware and archetype-aware reading tone |
| Astrology | Customize chart overlays, offer astro guidance aligned to user path |
| Journal | Prompt types vary by current archetype or emotional state |
| UI Theme | Automatically adjust background, tones, or symbols |
| Ritual Suggestions | Offered based on full moon phase, journal history, season |

This plan provides a comprehensive roadmap that addresses both immediate technical needs and strategic personalization goals, creating a unique, evolving spiritual companion for users.
