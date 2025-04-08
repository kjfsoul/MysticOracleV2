#!/bin/bash
# Script to install MCP servers for Mystic Arcana

echo "Installing MCP servers for Mystic Arcana..."

# Create directories if they don't exist
mkdir -p .vscode

# Install development MCP servers
echo "Installing development MCP servers..."

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "Error: npx is not installed or not in PATH"
    echo "Please install Node.js with npm to get npx"
    exit 1
fi

# Install MCP servers using npx instead of global installation
echo "Setting up MCP servers for on-demand usage with npx..."

# Create a local package.json for MCP server dependencies if it doesn't exist
if [ ! -f .mcp/package.json ]; then
    mkdir -p .mcp
    cat > .mcp/package.json << EOF
{
  "name": "mystic-arcana-mcp-servers",
  "version": "1.0.0",
  "description": "MCP servers for Mystic Arcana",
  "dependencies": {
    "@modelcontextprotocol/server-filesystem": "latest",
    "@modelcontextprotocol/server-github": "latest",
    "@modelcontextprotocol/server-puppeteer": "latest",
    "@modelcontextprotocol/server-brave-search": "latest",
    "@modelcontextprotocol/server-sequential-thinking": "latest",
    "@modelcontextprotocol/server-memory": "latest",
    "@modelcontextprotocol/server-google-maps": "latest",
    "@modelcontextprotocol/server-everything": "latest"
  }
}
EOF
    echo "Created .mcp/package.json with MCP server dependencies"
fi

# Install the dependencies in the .mcp directory
echo "Installing MCP server dependencies..."
(
    cd .mcp || { echo "Error: Failed to change to .mcp directory"; exit 1; }
    npm install
)

# Create Netlify function directories if they don't exist
mkdir -p netlify/functions
mkdir -p netlify/edge-functions

# Update VS Code settings to use local MCP servers
echo "Updating VS Code settings to use local MCP servers..."
cat > .vscode/settings.json << EOF
{
  "augment.advanced": {
    "mcpServers": [
      {
        "name": "nextjs",
        "command": "npx",
        "args": ["-y", "--prefix", "${PWD}/.mcp", "@modelcontextprotocol/server-filesystem"]
      },
      {
        "name": "react-ui",
        "command": "npx",
        "args": ["-y", "--prefix", "${PWD}/.mcp", "@modelcontextprotocol/server-github"]
      },
      {
        "name": "netlify",
        "command": "npx",
        "args": ["-y", "--prefix", "${PWD}/.mcp", "@modelcontextprotocol/server-puppeteer"]
      },
      {
        "name": "fullstack",
        "command": "npx",
        "args": ["-y", "--prefix", "${PWD}/.mcp", "@modelcontextprotocol/server-brave-search"]
      },
      {
        "name": "ai-functions",
        "command": "npx",
        "args": ["-y", "--prefix", "${PWD}/.mcp", "@modelcontextprotocol/server-sequential-thinking"]
      },
      {
        "name": "cms",
        "command": "npx",
        "args": ["-y", "--prefix", "${PWD}/.mcp", "@modelcontextprotocol/server-memory"]
      },
      {
        "name": "stripe",
        "command": "npx",
        "args": ["-y", "--prefix", "${PWD}/.mcp", "@modelcontextprotocol/server-google-maps"]
      },
      {
        "name": "tailwind",
        "command": "npx",
        "args": ["-y", "--prefix", "${PWD}/.mcp", "@modelcontextprotocol/server-everything"]
      },
      {
        "name": "web-search",
        "command": "npx",
        "args": ["-y", "--prefix", "${PWD}/.mcp", "@modelcontextprotocol/server-brave-search"]
      }
    ]
  }
}
EOF

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
echo "- web-search"
echo ""
echo "To use these servers with Augment, open VS Code and use the prompts in cline_docs/augment-prompts.md"
