// Jest setup file for Playwright tests
const { expect } = require('@playwright/test');

// Make expect available globally
global.expect = expect;

// Add custom matchers if needed
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Setup global test environment
beforeAll(async () => {
  console.log('Starting iPhone compatibility tests...');
});

afterAll(async () => {
  console.log('iPhone compatibility tests completed.');
});
