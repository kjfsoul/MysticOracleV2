#!/bin/bash

# Install core MCP servers
npm install @modelcontextprotocol/server-sequential-thinking
npm install @modelcontextprotocol/server-everything
npm install @modelcontextprotocol/server-memory

# Install image generation capabilities
npm install @modelcontextprotocol/server-puppeteer

# Install visual analysis capabilities
npm install @modelcontextprotocol/server-filesystem

# Install web search capability
npm install @modelcontextprotocol/server-brave-search

# Create local configuration directory if it doesn't exist
mkdir -p .mcp

# Configure environment
echo "Configuring MCP environment..."
npx mcp-cli init --project mystic-arcana

# Update configuration
cat > .mcp/config.json << EOF
{
  "servers": {
    "sequential-thinking": {
      "features": ["imageGeneration", "promptEngineering"],
      "models": {
        "primary": "openai/dall-e-3",
        "fallback": "stability-ai/stable-diffusion"
      }
    },
    "memory": {
      "features": ["assetManagement", "metadataStorage"],
      "plugins": ["image-metadata", "symbolism-analysis"]
    },
    "brave-search": {
      "enabled": true,
      "topics": [
        "tarot symbolism",
        "art styles",
        "mystical imagery"
      ]
    }
  }
}
EOF

echo "MCP servers and plugins installed successfully!"
