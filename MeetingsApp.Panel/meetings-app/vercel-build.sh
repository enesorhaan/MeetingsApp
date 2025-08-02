#!/bin/bash

echo "Starting Vercel build process..."

# Install dependencies
npm install

# Build the application
npm run build

# List the contents of dist directory
echo "Contents of dist directory:"
ls -la dist/

echo "Build completed!" 