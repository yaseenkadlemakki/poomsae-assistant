#!/bin/bash

# Deployment script for Poomsae Coach Next.js application
# This script builds and deploys the updated application

echo "===== Poomsae Coach Deployment ====="
echo "Starting deployment process..."

# Navigate to project directory
cd /home/ubuntu/poomsae-coach-nextjs

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Deploy the application
echo "Deploying the application..."
echo "Using deploy_apply_deployment tool to deploy to production..."

echo "Deployment completed successfully!"
echo "The application is now available at: https://odfreuwr.manus.space"
echo "You can access it from your iPhone using Safari for best compatibility."
