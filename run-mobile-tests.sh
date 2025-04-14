#!/bin/bash

# Setup test environment
echo "Setting up test environment..."
cd /home/ubuntu/poomsae-coach-nextjs

# Install required dependencies if not already installed
npm install --save-dev playwright @playwright/test jest-playwright-preset

# Create test directory if it doesn't exist
mkdir -p tests

# Run mobile compatibility tests
echo "Running mobile compatibility tests..."
npx playwright test tests/mobile-compatibility.test.js --config=playwright.config.js

# Output test results
echo "Test execution completed."
