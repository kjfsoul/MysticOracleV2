#!/bin/bash
# Script to install MCP servers for Mystic Arcana

echo "Installing MCP servers for Mystic Arcana..."

# Create directories if they don't exist
mkdir -p .vscode

# Install development MCP servers
echo "Installing development MCP servers..."
npm install -g @modelcontextprotocol/server-nextjs
npm install -g @modelcontextprotocol/server-react-ui
npm install -g @modelcontextprotocol/server-netlify-edge
npm install -g @modelcontextprotocol/server-fullstack-turbo
npm install -g @modelcontextprotocol/server-ai-function-pack
npm install -g @modelcontextprotocol/server-cms-headless
npm install -g @modelcontextprotocol/server-commerce-stripe
npm install -g @modelcontextprotocol/server-design-system-tailwind

# Create Netlify function directories if they don't exist
mkdir -p netlify/functions
mkdir -p netlify/edge-functions

echo "MCP servers installed successfully!"
echo "You can now use Augment with the following MCP servers:"
echo "- nextjs"
echo "- react-ui"
echo "- netlify-edge"
echo "- fullstack-turbo"
echo "- ai-function-pack"
echo "- cms-headless"
echo "- commerce-stripe"
echo "- design-system-tailwind"
echo ""
echo "To use these servers with Augment, open VS Code and use the prompts in cline_docs/augment-prompts.md"
