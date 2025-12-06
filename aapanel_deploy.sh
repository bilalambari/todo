#!/bin/bash

# ==============================================================================
# aaPanel Git Manager Deployment Script
# ==============================================================================
# This script is designed to be used in the aaPanel Git Manager "Script" section.
# It handles pulling the latest code, installing dependencies, and building the app.
# ==============================================================================

# 1. Set the correct working directory (usually passed by aaPanel or current dir)
# Adjust if necessary, but typically running in the repo root is correct.
echo "📂 Working Directory: $(pwd)"

# 2. Pull latest changes (aaPanel usually does this, but good to be safe/explicit if run manually)
echo "⬇️  Pulling latest changes..."
git pull

# 3. Install dependencies
# Using --legacy-peer-deps to avoid potential conflicts, though often not needed.
# Using ci (clean install) if package-lock.json exists for consistency.
echo "📦 Installing dependencies..."
if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi

# 4. Build the application
echo "🔨 Building application..."
npm run build

# 5. Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! 'dist' folder is ready."
    
    # Optional: Update permissions if needed
    # chmod -R 755 dist
    
    echo "🚀 Deployment complete."
else
    echo "❌ Build failed! 'dist' folder not found."
    exit 1
fi
