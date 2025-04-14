module.exports = {
  // Basic configuration
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  
  // Reporter to use
  reporter: 'html',
  
  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        permissions: ['camera', 'microphone'],
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        // Record video of tests
        video: 'on-first-retry',
        // Take screenshot on failure
        screenshot: 'only-on-failure',
      },
    },
    
    // Uncomment to test on other browsers
    // {
    //   name: 'webkit',
    //   use: {
    //     browserName: 'webkit',
    //     ...iPhone13
    //   },
    // },
  ],
  
  // Configure the test server
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
  
  // Use Jest as the test runner
  testMatch: '**/*.test.js',
  testRunner: 'jest',
  
  // Configure Jest
  jest: {
    setupFilesAfterEnv: ['./jest.setup.js'],
  },
  
  // Configure retries
  retries: process.env.CI ? 2 : 0,
  
  // Configure workers
  workers: process.env.CI ? 1 : undefined,
};
