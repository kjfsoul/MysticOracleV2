# Augment MCP Integration for Mystic Arcana

This document provides instructions for integrating MCP servers with Augment for the Mystic Arcana project. It includes setup instructions, default behaviors, and best practices to ensure Augment automatically leverages the appropriate MCP servers without requiring explicit user prompting.

## Default Behavior Configuration

### 1. Initial Setup

Add the following to your VS Code settings.json to configure Augment's default behavior:

```json
{
  "augment.advanced": {
    "defaultMcpServers": ["nextjs", "react-ui", "netlify-edge", "fullstack-turbo", "ai-function-pack", "cms-headless", "commerce-stripe", "design-system-tailwind"],
    "autoConnectMcp": true,
    "mcpContextAwareness": true,
    "projectContext": "mystic-arcana"
  }
}
```

### 2. Project-Specific MCP Configuration

Create a `.augment/config.json` file in your project root:

```json
{
  "project": "Mystic Arcana",
  "description": "A mystical web application for tarot readings, astrology charts, and spiritual content",
  "mcpServers": {
    "default": ["nextjs", "react-ui"],
    "contextMapping": {
      "tarot": ["ai-function-pack", "react-ui", "design-system-tailwind"],
      "astrology": ["ai-function-pack", "react-ui", "design-system-tailwind"],
      "payment": ["commerce-stripe", "netlify-edge"],
      "blog": ["cms-headless", "nextjs"],
      "auth": ["fullstack-turbo", "netlify-edge"]
    },
    "fileTypeMapping": {
      "*.tsx": ["nextjs", "react-ui"],
      "*.jsx": ["nextjs", "react-ui"],
      "*.ts": ["fullstack-turbo"],
      "*.js": ["fullstack-turbo"],
      "*.css": ["design-system-tailwind"],
      "*.mdx": ["cms-headless"]
    },
    "pathMapping": {
      "app/": ["nextjs"],
      "components/": ["react-ui"],
      "netlify/functions/": ["netlify-edge"],
      "netlify/edge-functions/": ["netlify-edge"],
      "lib/api/": ["ai-function-pack"]
    }
  }
}
```

### 3. Custom Instructions for Augment

Create a `.augment/instructions.md` file:

```markdown
# Mystic Arcana - Augment Instructions

When assisting with the Mystic Arcana project:

1. **Automatically use MCP servers** based on the context of the task
2. **Inform the user which MCP servers** you're leveraging and why
3. **Follow the mystical aesthetic** of the project with cosmic themes
4. **Prioritize performance and accessibility** in all implementations
5. **Reference the project documentation** in cline_docs/ directory

## Default MCP Server Usage

- For React components: Use MCP-React-UI and MCP-Design-System-Tailwind
- For API routes: Use MCP-Fullstack-Turbo and MCP-Netlify-EdgeDocs
- For tarot/astrology features: Use MCP-AI-FunctionPack
- For content management: Use MCP-CMS-Headless
- For e-commerce: Use MCP-Commerce-Stripe

## Automatic Detection

Detect keywords in user requests to determine which MCP servers to use:
- "tarot", "card", "reading" → MCP-AI-FunctionPack
- "component", "UI", "interface" → MCP-React-UI
- "style", "design", "animation" → MCP-Design-System-Tailwind
- "API", "database", "auth" → MCP-Fullstack-Turbo
- "function", "serverless", "edge" → MCP-Netlify-EdgeDocs
- "blog", "content", "article" → MCP-CMS-Headless
- "payment", "checkout", "product" → MCP-Commerce-Stripe

Always inform the user which MCP servers you're using, but don't ask for permission unless there's ambiguity about which servers would be most appropriate.
```

## Implementation in Augment

### 1. Automatic MCP Connection

Augment should automatically connect to the appropriate MCP servers based on:

1. The file being edited
2. The user's request
3. The project context

For example, when a user asks to create a tarot card component, Augment should automatically connect to:
- MCP-React-UI
- MCP-Design-System-Tailwind
- MCP-AI-FunctionPack (if the component involves tarot card meanings)

### 2. Informing Users

When Augment uses MCP servers, it should inform the user with a brief message:

```
I'm leveraging the following MCP servers for this task:
- MCP-React-UI for component structure
- MCP-Design-System-Tailwind for styling
- MCP-AI-FunctionPack for tarot card meanings

This ensures optimal code quality and adherence to Mystic Arcana's patterns.
```

### 3. Context-Aware MCP Selection

Augment should analyze the user's request and current context to determine which MCP servers to use:

```javascript
// Pseudocode for Augment's internal logic
function determineMcpServers(request, context) {
  const servers = [];
  
  // Check file type
  if (context.file.endsWith('.tsx') || context.file.endsWith('.jsx')) {
    servers.push('nextjs', 'react-ui');
  }
  
  // Check file path
  if (context.file.includes('netlify/functions')) {
    servers.push('netlify-edge');
  }
  
  // Check request keywords
  if (request.includes('tarot') || request.includes('card') || request.includes('reading')) {
    servers.push('ai-function-pack');
  }
  
  // Check for styling needs
  if (request.includes('style') || request.includes('design') || request.includes('animation')) {
    servers.push('design-system-tailwind');
  }
  
  // Deduplicate
  return [...new Set(servers)];
}
```

## User Experience

### 1. Transparent MCP Usage

Users should be aware that Augment is using MCP servers, but shouldn't need to explicitly request them:

**User**: "Create a component for displaying a tarot card with flip animation"

**Augment**: "I'll create a flippable tarot card component for you. I'm leveraging MCP-React-UI and MCP-Design-System-Tailwind to ensure the component follows best practices and integrates well with the Mystic Arcana design system.

Here's the implementation:
[component code]

This component uses Framer Motion for the flip animation and includes accessibility features for screen readers."

### 2. MCP Server Override

Users should be able to explicitly request specific MCP servers if needed:

**User**: "Use MCP-AI-FunctionPack to create a tarot reading generator function"

**Augment**: "I'll use MCP-AI-FunctionPack to create a tarot reading generator function. I'll also leverage MCP-Netlify-EdgeDocs since this will likely be implemented as a serverless function.

Here's the implementation:
[function code]

This function uses OpenAI's API to generate personalized tarot readings based on the cards drawn and the user's question."

## Best Practices for Augment

1. **Always connect to relevant MCP servers** without being asked
2. **Inform users which servers you're using** for transparency
3. **Combine multiple MCP servers** when appropriate for the task
4. **Default to using MCP servers** rather than not using them
5. **Explain the benefits** of using specific MCP servers when relevant

By following these guidelines, Augment will automatically leverage the appropriate MCP servers for Mystic Arcana development tasks, providing optimal assistance without requiring users to explicitly request specific MCP servers.
