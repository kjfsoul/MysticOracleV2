#!/bin/bash

# Install required dev dependencies
npm install --save-dev typescript ts-node @types/node @types/fs-extra

# Install runtime dependencies
npm install fs-extra

# Clean install
rm -rf node_modules package-lock.json
npm install
