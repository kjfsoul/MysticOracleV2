# Mystic Arcana - System Patterns

## Project Structure
```
mystic-arcana/
├── client/                  # Frontend code
│   ├── public/              # Static assets
│   └── src/                 # Source code
│       ├── app/             # Next.js App Router
│       ├── components/      # React components
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utility functions
│       ├── styles/          # Global styles
│       └── types/           # TypeScript types
├── netlify/                 # Netlify configuration
│   ├── edge-functions/      # Edge functions
│   └── functions/           # Serverless functions
├── shared/                  # Shared code between client and server
└── supabase/                # Supabase configuration
```

## Component Patterns

### UI Components
- Use functional components with TypeScript
- Implement Tailwind CSS for styling
- Create reusable components in `components/ui/`
- Use composition over inheritance

### Data Fetching
- Use React Query for client-side data fetching
- Implement server components for SSR data fetching
- Use ISR for semi-static content like blog posts
- Implement edge functions for personalization

### Authentication
- Use Supabase Auth for authentication
- Implement protected routes with middleware
- Store user preferences in Supabase

### State Management
- Use React Context for global state
- Implement React Query for server state
- Use local state for component-specific state

## API Patterns

### Netlify Functions
- Create RESTful API endpoints
- Implement proper error handling
- Use TypeScript for type safety
- Validate input with Zod

### Edge Functions
- Use for personalization and A/B testing
- Implement for geolocation-based content
- Keep logic minimal for performance

### Database Access
- Use Supabase client for database access
- Implement Row Level Security (RLS)
- Create database helpers in `lib/db/`

## Deployment Patterns

### Netlify Deployment
- Use Netlify CLI for local development
- Implement preview deployments for PRs
- Set up environment variables in Netlify UI

### CI/CD
- Use GitHub Actions for CI/CD
- Run tests before deployment
- Implement automatic preview deployments

## Testing Patterns
- Use Jest for unit testing
- Implement React Testing Library for component tests
- Use Cypress for E2E testing
- Write tests for critical user flows
