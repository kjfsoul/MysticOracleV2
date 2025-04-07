# MCP Server Usage Guide for Mystic Arcana

This guide provides detailed instructions on how to effectively use each MCP server for specific aspects of the Mystic Arcana project.

## Development MCP Servers

### 1. MCP-Dev-NextJS

**Best Used For:**
- App Router configuration
- Server components and data fetching
- API routes and serverless functions
- ISR/SSR implementation
- Route handlers and middleware

**Example Usage:**
```
Using MCP-Dev-NextJS, create a dynamic route for individual tarot card pages that:
1. Uses server components for SEO optimization
2. Implements ISR with a 24-hour revalidation period
3. Fetches card data from Supabase
4. Includes structured data for rich search results
5. Handles both static paths for known cards and fallback for custom cards
```

**Key Features to Leverage:**
- Next.js 13+ App Router patterns
- Server component data fetching
- Metadata API for SEO
- Image optimization
- Font optimization

### 2. MCP-React-UI

**Best Used For:**
- Tarot card components and animations
- Interactive astrology charts
- Custom UI components with Tailwind
- Form components with validation
- Modal and dialog components

**Example Usage:**
```
Using MCP-React-UI, create an interactive tarot spread component that:
1. Displays cards in a specific layout pattern (Celtic Cross, Three Card, etc.)
2. Animates card reveals with Framer Motion
3. Allows users to flip cards and view interpretations
4. Adapts layout responsively for different screen sizes
5. Includes accessibility features for screen readers
```

**Key Features to Leverage:**
- Component composition patterns
- Tailwind utility classes
- Animation libraries integration
- Responsive design techniques
- Accessibility best practices

### 3. MCP-Netlify-EdgeDocs

**Best Used For:**
- Netlify Functions for API endpoints
- Edge Functions for personalization
- Deployment configuration
- Serverless function optimization
- Authentication and authorization

**Example Usage:**
```
Using MCP-Netlify-EdgeDocs, create a Netlify Edge Function that:
1. Detects the user's location and time zone
2. Personalizes the daily tarot card based on local time
3. Applies theme preferences from cookies
4. Redirects to localized content when appropriate
5. Optimizes page loading with appropriate headers
```

**Key Features to Leverage:**
- Netlify Functions API
- Edge Function capabilities
- Geolocation and cookies
- Headers and redirects
- Environment variables

### 4. MCP-Fullstack-Turbo

**Best Used For:**
- Database schema design with Prisma
- Authentication flows with NextAuth
- API route implementation with tRPC
- Form validation with Zod
- State management patterns

**Example Usage:**
```
Using MCP-Fullstack-Turbo, implement a user profile system that:
1. Creates a Prisma schema for user profiles with astrological data
2. Implements NextAuth for authentication with multiple providers
3. Creates tRPC endpoints for profile CRUD operations
4. Validates input data with Zod schemas
5. Handles file uploads for profile images
```

**Key Features to Leverage:**
- Prisma schema design
- tRPC API endpoints
- NextAuth configuration
- Zod validation schemas
- React Query integration

### 5. MCP-AI-FunctionPack

**Best Used For:**
- OpenAI API integration
- Tarot reading generation
- Astrology interpretation
- Personalized content creation
- Natural language processing

**Example Usage:**
```
Using MCP-AI-FunctionPack, create an AI-powered tarot reading system that:
1. Accepts user questions and context
2. Constructs appropriate prompts for OpenAI
3. Processes and formats the AI response
4. Handles rate limiting and error cases
5. Implements caching for common interpretations
```

**Key Features to Leverage:**
- OpenAI API best practices
- Prompt engineering techniques
- Response parsing and formatting
- Error handling and fallbacks
- Caching strategies

### 6. MCP-CMS-Headless

**Best Used For:**
- Blog and content management
- MDX integration
- Content modeling
- Dynamic page generation
- Content search and filtering

**Example Usage:**
```
Using MCP-CMS-Headless, implement a blog system that:
1. Uses MDX for rich content with custom components
2. Creates a content model for articles with categories and tags
3. Implements a search function with relevance ranking
4. Generates dynamic OG images for social sharing
5. Includes a related content recommendation system
```

**Key Features to Leverage:**
- MDX configuration
- Content modeling patterns
- Search implementation
- Dynamic metadata
- Content relationships

### 7. MCP-Commerce-Stripe

**Best Used For:**
- Product catalog management
- Shopping cart implementation
- Checkout process
- Subscription management
- Payment processing

**Example Usage:**
```
Using MCP-Commerce-Stripe, create a subscription management system that:
1. Offers tiered subscription plans for premium features
2. Implements a secure checkout process with Stripe Elements
3. Handles subscription lifecycle events (renewal, cancellation)
4. Provides user account access to subscription management
5. Implements webhook handlers for Stripe events
```

**Key Features to Leverage:**
- Stripe API integration
- Checkout session creation
- Subscription management
- Webhook handling
- Payment element customization

### 8. MCP-Design-System-Tailwind

**Best Used For:**
- Custom theme creation
- Animation and transition effects
- Component styling
- Responsive design
- Dark mode implementation

**Example Usage:**
```
Using MCP-Design-System-Tailwind, create a cosmic theme system that:
1. Implements a custom color palette with mystical gradients
2. Creates reusable animation classes for magical effects
3. Designs card components with glowing borders and hover states
4. Implements a dark/light mode toggle with theme persistence
5. Creates responsive layouts for all device sizes
```

**Key Features to Leverage:**
- Tailwind configuration
- Custom plugin creation
- Animation utilities
- Theme variables
- Responsive utilities

## End-User Product MCP Servers

### 1. Netlify Functions

**Best Used For:**
- API endpoints
- Authentication
- Database operations
- Third-party API integration
- Secure operations

**Example Implementation:**
```javascript
// netlify/functions/generate-reading.js
import { OpenAI } from 'openai';
import { supabase } from '../../lib/supabaseClient';

export const handler = async (event, context) => {
  try {
    // Parse request
    const { question, spread, userId } = JSON.parse(event.body);
    
    // Get cards from database
    const { data: cards } = await supabase
      .from('tarot_cards')
      .select('*')
      .order('RANDOM()')
      .limit(spread.numCards);
    
    // Generate reading with OpenAI
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a mystical tarot reader providing insightful, personalized readings."
        },
        {
          role: "user",
          content: `Generate a tarot reading for the question: "${question}" with these cards: ${JSON.stringify(cards)}`
        }
      ]
    });
    
    // Save reading to database if user is logged in
    if (userId) {
      await supabase.from('readings').insert({
        user_id: userId,
        question,
        cards,
        interpretation: response.choices[0].message.content,
        created_at: new Date()
      });
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        cards,
        interpretation: response.choices[0].message.content
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 2. Netlify Edge Functions

**Best Used For:**
- Personalization
- A/B testing
- Geolocation-based content
- Performance optimization
- Request/response manipulation

**Example Implementation:**
```javascript
// netlify/edge-functions/personalize.js
export default async (request, context) => {
  // Get user data from cookies or headers
  const cookies = request.headers.get('cookie') || '';
  const themeCookie = cookies.split('; ').find(c => c.startsWith('theme='));
  const theme = themeCookie ? themeCookie.split('=')[1] : 'dark';
  
  // Get user's location
  const country = context.geo?.country?.code || 'US';
  const timezone = context.geo?.timezone || 'America/New_York';
  
  // Calculate local time for user
  const userLocalTime = new Date().toLocaleString('en-US', { timeZone: timezone });
  const userHour = new Date(userLocalTime).getHours();
  
  // Determine appropriate greeting based on time
  let greeting = 'Welcome';
  if (userHour < 12) greeting = 'Good morning';
  else if (userHour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';
  
  // Get the response from the origin
  const response = await context.next();
  
  // Clone the response so we can modify it
  const newResponse = new Response(response.body, response);
  
  // Add custom headers for client-side personalization
  newResponse.headers.set('x-user-theme', theme);
  newResponse.headers.set('x-user-country', country);
  newResponse.headers.set('x-user-greeting', greeting);
  
  return newResponse;
};
```

### 3. ISR/SSR Functions

**Best Used For:**
- Dynamic pages with some static elements
- Blog posts and articles
- Product pages
- User dashboards
- Content that changes periodically

**Example Implementation:**
```typescript
// app/blog/[slug]/page.tsx
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { components } from '@/components/mdx-components';

// Generate static params for known blog posts
export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published');
    
  return posts?.map(post => ({ slug: post.slug })) || [];
}

// Use ISR for blog posts with 1-hour revalidation
export const revalidate = 3600;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Fetch blog post data
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (!post) {
    notFound();
  }
  
  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-serif text-gold mb-4">{post.title}</h1>
      <div className="prose prose-invert prose-lg max-w-none">
        <MDXRemote source={post.content} components={components} />
      </div>
    </article>
  );
}
```

## Effective Usage Patterns

### 1. Combining MCP Servers for Complex Features

For complex features, combine multiple MCP servers to leverage their strengths:

```
Using MCP-React-UI, MCP-AI-FunctionPack, and MCP-Netlify-EdgeDocs, create a personalized daily tarot system that:

1. Uses React components for beautiful card display (MCP-React-UI)
2. Implements a Netlify Function to generate readings (MCP-Netlify-EdgeDocs)
3. Uses OpenAI to create personalized interpretations (MCP-AI-FunctionPack)
4. Adapts content based on user preferences (MCP-Netlify-EdgeDocs)
5. Caches results for performance (MCP-Netlify-EdgeDocs)
```

### 2. Progressive Enhancement Strategy

Build features with progressive enhancement to ensure they work for all users:

```
Using MCP-Dev-NextJS and MCP-React-UI, implement a progressive enhancement strategy for the tarot card explorer that:

1. Renders basic card information server-side for SEO and initial load (MCP-Dev-NextJS)
2. Enhances with client-side interactions and animations (MCP-React-UI)
3. Falls back to simpler views for older browsers
4. Optimizes images and assets for different devices
5. Implements keyboard navigation for accessibility
```

### 3. Performance Optimization Workflow

Use this workflow to ensure optimal performance:

```
Using MCP-Dev-NextJS and MCP-Netlify-EdgeDocs, implement a performance optimization workflow that:

1. Analyzes bundle sizes and identifies optimization opportunities (MCP-Dev-NextJS)
2. Implements code splitting and lazy loading for heavy components (MCP-Dev-NextJS)
3. Uses Edge Functions for response optimization (MCP-Netlify-EdgeDocs)
4. Implements a caching strategy with appropriate cache headers (MCP-Netlify-EdgeDocs)
5. Sets up monitoring and performance budgets (MCP-Dev-NextJS)
```

## Best Practices

1. **Start with clear requirements** before using MCP servers
2. **Use the right server for the job** based on the feature requirements
3. **Combine servers strategically** for complex features
4. **Test generated code thoroughly** before implementation
5. **Refine prompts iteratively** for better results
6. **Document MCP server usage** for team knowledge sharing
7. **Keep security in mind** when implementing serverless functions
8. **Optimize for performance** from the beginning
9. **Consider accessibility** in all UI components
10. **Maintain consistent coding style** across generated code
