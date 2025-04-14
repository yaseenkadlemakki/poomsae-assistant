#!/bin/bash

# Setup test environment
echo "Setting up test environment..."
cd /home/ubuntu/poomsae-coach-nextjs

# Install required dependencies if not already installed
npm install --save-dev playwright @playwright/test jest-playwright-preset

# Create test directory if it doesn't exist
mkdir -p tests

# Run end-to-end integration tests
echo "Running end-to-end integration tests..."
echo "This will test the complete user workflow:"
echo "1. Register a new user"
echo "2. Login with the new user account"
echo "3. Capture a video for 15 secs"
echo "4. Save the video clip"
echo "5. Compare it with reference Poomsae videos"
echo "6. Verify recommendations and feedback"
echo ""

# Run the tests with video recording enabled
npx playwright test tests/end-to-end.test.js --config=playwright.config.js --video=on

# Output test results
echo "Test execution completed."
echo "Test results and videos are available in the test-results directory."
