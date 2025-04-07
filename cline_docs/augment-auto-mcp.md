# Augment Auto-MCP Configuration for Mystic Arcana

This document provides configuration and guidance to ensure Augment automatically leverages the appropriate MCP servers for Mystic Arcana development tasks, even when the user doesn't explicitly request them.

## Default MCP Server Selection

Augment should automatically select and use the appropriate MCP servers based on the file type, path, and context of the development task:

### File Type-Based Selection

```json
{
  "fileTypeMapping": {
    "*.tsx": ["nextjs", "react-ui", "design-system-tailwind"],
    "*.jsx": ["nextjs", "react-ui", "design-system-tailwind"],
    "*.ts": ["fullstack-turbo", "netlify-edge"],
    "*.js": ["fullstack-turbo", "netlify-edge"],
    "*.css": ["design-system-tailwind"],
    "*.scss": ["design-system-tailwind"],
    "*.mdx": ["cms-headless"],
    "*.md": ["cms-headless"]
  }
}
```

### Path-Based Selection

```json
{
  "pathMapping": {
    "app/": ["nextjs"],
    "components/": ["react-ui", "design-system-tailwind"],
    "netlify/functions/": ["netlify-edge", "fullstack-turbo"],
    "netlify/edge-functions/": ["netlify-edge"],
    "lib/api/": ["ai-function-pack", "fullstack-turbo"],
    "styles/": ["design-system-tailwind"],
    "content/": ["cms-headless"],
    "pages/api/": ["fullstack-turbo", "netlify-edge"],
    "hooks/": ["fullstack-turbo", "react-ui"],
    "utils/": ["fullstack-turbo"],
    "store/": ["commerce-stripe"]
  }
}
```

### Feature-Based Selection

```json
{
  "featureMapping": {
    "tarot": ["ai-function-pack", "react-ui", "design-system-tailwind"],
    "astrology": ["ai-function-pack", "react-ui", "design-system-tailwind"],
    "auth": ["fullstack-turbo", "netlify-edge"],
    "payment": ["commerce-stripe", "netlify-edge"],
    "blog": ["cms-headless", "nextjs"],
    "shop": ["commerce-stripe", "react-ui"],
    "user": ["fullstack-turbo", "netlify-edge"],
    "chart": ["react-ui", "design-system-tailwind"],
    "card": ["react-ui", "design-system-tailwind", "ai-function-pack"],
    "reading": ["ai-function-pack", "react-ui"],
    "spread": ["react-ui", "design-system-tailwind"]
  }
}
```

## Automatic MCP Server Detection

Augment should analyze the user's request and current context to automatically determine which MCP servers to use:

### Context Analysis Rules

1. **File Context**:
   - When editing a React component, automatically use `react-ui` and `design-system-tailwind`
   - When working with API routes, automatically use `fullstack-turbo` and `netlify-edge`
   - When developing AI features, automatically use `ai-function-pack`

2. **Request Analysis**:
   - Detect keywords like "tarot", "card", "reading", "astrology", "chart", etc.
   - Map these keywords to the appropriate MCP servers using the feature mapping
   - Combine multiple MCP servers when the request spans multiple domains

3. **Project Structure Awareness**:
   - Understand the Mystic Arcana project structure
   - Use path-based mapping to determine the appropriate MCP servers
   - Consider the relationship between files when making suggestions

## Implementation Guidance

### For Augment

When implementing code for Mystic Arcana, Augment should:

1. **Automatically Connect to MCP Servers**:
   ```javascript
   // Internal Augment logic (pseudocode)
   function handleUserRequest(request, context) {
     const relevantMcpServers = determineRelevantMcpServers(request, context);
     connectToMcpServers(relevantMcpServers);
     // Process the request with MCP server assistance
     return generateResponse(request, context);
   }
   ```

2. **Inform User of MCP Usage**:
   ```
   I'm leveraging the following MCP servers to help with this task:
   - MCP-React-UI for component design
   - MCP-AI-FunctionPack for tarot reading logic
   - MCP-Design-System-Tailwind for styling
   
   This ensures optimal code quality and adherence to Mystic Arcana's patterns.
   ```

3. **Explain MCP Benefits**:
   ```
   The MCP-AI-FunctionPack server is helping me generate optimized OpenAI API calls 
   that follow best practices for tarot reading generation, including proper prompt 
   engineering and response handling.
   ```

### For Users

Users should be aware that:

1. Augment will automatically use the appropriate MCP servers
2. They can still explicitly request specific MCP servers if needed
3. They can ask Augment which MCP servers it's using for a particular task
4. They can request Augment to use different MCP servers if desired

## Example Automatic MCP Usage Scenarios

### Scenario 1: Tarot Card Component

**User Request**: "Create a tarot card component that flips when clicked"

**Automatic MCP Selection**:
- `react-ui` (detected "component" and "tarot card")
- `design-system-tailwind` (detected UI work)

**Response**: "I'll create a flippable tarot card component using React and Tailwind CSS. I'm leveraging MCP-React-UI and MCP-Design-System-Tailwind to ensure the component follows best practices and integrates well with the Mystic Arcana design system."

### Scenario 2: Astrology Chart Calculation

**User Request**: "Write a function to calculate planetary positions"

**Automatic MCP Selection**:
- `fullstack-turbo` (detected backend calculation)
- `ai-function-pack` (detected astrology domain)

**Response**: "I'll create a function to calculate planetary positions using the Swiss Ephemeris library. I'm leveraging MCP-Fullstack-Turbo and MCP-AI-FunctionPack to ensure efficient calculations and proper integration with the rest of the Mystic Arcana backend."

### Scenario 3: Checkout Process

**User Request**: "Implement the checkout page for the shop"

**Automatic MCP Selection**:
- `commerce-stripe` (detected "checkout" and "shop")
- `react-ui` (detected UI work)
- `netlify-edge` (detected potential API integration)

**Response**: "I'll implement the checkout page for the Mystic Arcana shop. I'm leveraging MCP-Commerce-Stripe for Stripe integration, MCP-React-UI for the component structure, and MCP-Netlify-Edge for the serverless functions needed to process payments securely."

## MCP Server Fallback Strategy

If specific MCP servers are unavailable or not applicable, Augment should:

1. Use the most relevant available MCP servers
2. Inform the user of the limitation
3. Proceed with the best available alternative
4. Suggest improvements that could be made with the ideal MCP server

## Continuous Improvement

This auto-MCP configuration should be regularly updated based on:

1. New MCP servers that become available
2. Feedback on the effectiveness of automatic selection
3. Changes to the Mystic Arcana project structure
4. New features and domains added to the project

By implementing this automatic MCP server selection, Augment will provide optimal assistance for Mystic Arcana development without requiring users to explicitly request specific MCP servers.
