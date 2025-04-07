#!/bin/bash
# Install dependencies including dev dependencies
npm install

# Ensure vite is installed
npm install vite --save-dev

# Run the Netlify-specific build command
npm run build:netlify
