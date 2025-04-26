#!/bin/bash
# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Next.js application
echo "Building the application..."
npm run build

# Success message
echo "Build completed successfully!" 