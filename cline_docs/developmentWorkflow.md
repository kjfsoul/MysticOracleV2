# Mystic Arcana - Development Workflow

## Local Development

### Setup
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in `.env.local`
4. Start the development server with `npm run dev`

### MCP Server Integration
When working with Augment in VS Code, use the following MCP servers:

```json
{
  "augment.advanced": {
    "mcpServers": [
      {
        "name": "nextjs",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-nextjs"]
      },
      {
        "name": "react-ui",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-react-ui"]
      },
      {
        "name": "netlify",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-netlify-edge"]
      },
      {
        "name": "fullstack",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-fullstack-turbo"]
      },
      {
        "name": "ai-functions",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-ai-function-pack"]
      },
      {
        "name": "cms",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-cms-headless"]
      },
      {
        "name": "stripe",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-commerce-stripe"]
      },
      {
        "name": "tailwind",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-design-system-tailwind"]
      }
    ]
  }
}
```

## Netlify Deployment

### Setup
1. Connect repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
3. Set up environment variables in Netlify UI

### Netlify Functions
- Create functions in `netlify/functions/`
- Test locally with `netlify dev`
- Deploy with `netlify deploy`

### Netlify Edge Functions
- Create edge functions in `netlify/edge-functions/`
- Configure in `netlify.toml`
- Test locally with `netlify dev`

## Testing

### Unit Tests
- Run with `npm test`
- Write tests in `__tests__` directories

### E2E Tests
- Run with `npm run test:e2e`
- Write tests in `cypress/e2e/`

## CI/CD Pipeline

### Pull Requests
1. Create feature branch
2. Make changes and commit
3. Create PR to main branch
4. Netlify will create a preview deployment
5. Review and merge PR

### Production Deployment
1. Merge PR to main branch
2. Netlify will automatically deploy to production
3. Verify deployment in Netlify UI

## Monitoring

### Error Tracking
- Use Sentry for error tracking
- Configure in `lib/sentry.ts`

### Analytics
- Use Netlify Analytics for site metrics
- Configure in Netlify UI
