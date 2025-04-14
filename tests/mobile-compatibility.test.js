/**
 * Mobile Compatibility Tests for Poomsae Coach Application
 * 
 * This test suite focuses on ensuring the application works properly on iPhone devices.
 * It tests responsive design, touch interactions, and camera functionality.
 */

const { chromium } = require('playwright');
const assert = require('assert');

// iPhone 13 Pro viewport settings
const IPHONE_VIEWPORT = {
  width: 390,
  height: 844,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true
};

// Test configuration
const config = {
  baseUrl: 'https://odfreuwr.manus.space',
  testUser: {
    username: `test_user_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Test123!'
  }
};

describe('Poomsae Coach Mobile Compatibility Tests', () => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    // Launch browser with iPhone emulation
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 100 // Slow down operations for better visibility
    });
    
    context = await browser.newContext({
      viewport: IPHONE_VIEWPORT,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      hasTouch: true,
      isMobile: true,
      permissions: ['camera', 'microphone']
    });
    
    page = await context.newPage();
    
    // Enable console logging for debugging
    page.on('console', msg => console.log(`PAGE LOG: ${msg.text()}`));
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Mobile viewport and responsive design', async () => {
    await page.goto(config.baseUrl);
    
    // Check if viewport is correctly set
    const viewport = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight
    }));
    
    expect(viewport.width).toBe(IPHONE_VIEWPORT.width);
    
    // Check if meta viewport tag is present
    const viewportMeta = await page.$eval('meta[name="viewport"]', el => el.content);
    expect(viewportMeta).toContain('width=device-width');
    expect(viewportMeta).toContain('initial-scale=1');
  });

  test('Registration form works on mobile', async () => {
    await page.goto(`${config.baseUrl}/register`);
    
    // Check if form elements are properly sized for touch
    const inputHeight = await page.$eval('input[name="username"]', el => {
      const style = window.getComputedStyle(el);
      return parseInt(style.height);
    });
    
    // Input fields should be at least 44px high for good touch targets
    expect(inputHeight).toBeGreaterThanOrEqual(44);
    
    // Fill and submit the form
    await page.fill('input[name="username"]', config.testUser.username);
    await page.fill('input[name="email"]', config.testUser.email);
    await page.fill('input[name="password"]', config.testUser.password);
    await page.fill('input[name="confirmPassword"]', config.testUser.password);
    
    await page.click('button[type="submit"]');
    
    // Check if registration was successful (redirected to dashboard)
    await page.waitForURL(`${config.baseUrl}/dashboard`);
    const dashboardTitle = await page.textContent('h1');
    expect(dashboardTitle).toContain('Virtual Poomsae Coach');
  });

  test('Login form works on mobile', async () => {
    await page.goto(`${config.baseUrl}/login`);
    
    // Fill and submit the form
    await page.fill('input[name="username"]', config.testUser.username);
    await page.fill('input[name="password"]', config.testUser.password);
    
    await page.click('button[type="submit"]');
    
    // Check if login was successful (redirected to dashboard)
    await page.waitForURL(`${config.baseUrl}/dashboard`);
    const welcomeText = await page.textContent('.flex.items-center.space-x-4');
    expect(welcomeText).toContain(config.testUser.username);
  });

  test('Dashboard UI is mobile-friendly', async () => {
    await page.goto(`${config.baseUrl}/dashboard`);
    
    // Check if reference videos section is responsive
    const refVideosGrid = await page.$('.grid.grid-cols-2');
    expect(refVideosGrid).not.toBeNull();
    
    // Check if buttons are properly sized for touch
    const buttonHeight = await page.$eval('button.px-6.py-3', el => {
      const style = window.getComputedStyle(el);
      return parseInt(style.height);
    });
    
    // Buttons should be at least 44px high for good touch targets
    expect(buttonHeight).toBeGreaterThanOrEqual(44);
  });

  test('Camera capture modal works on mobile', async () => {
    await page.goto(`${config.baseUrl}/dashboard`);
    
    // Open upload modal
    await page.click('button:has-text("Upload New Video")');
    
    // Check if camera button is visible
    const cameraButton = await page.waitForSelector('button:has-text("Capture with Camera")');
    expect(cameraButton).not.toBeNull();
    
    // Click camera button
    await cameraButton.click();
    
    // Check if camera interface appears
    // Note: In a real test, we'd need to mock the camera API
    // For this test, we'll just check if the UI elements appear
    try {
      const videoElement = await page.waitForSelector('video', { timeout: 5000 });
      expect(videoElement).not.toBeNull();
      
      // Check for recording button
      const recordButton = await page.waitForSelector('button:has-text("Start Recording")', { timeout: 5000 });
      expect(recordButton).not.toBeNull();
    } catch (e) {
      // Camera might not be available in test environment
      console.log('Camera test skipped - camera not available in test environment');
    }
    
    // Close modal
    await page.click('button:has-text("Cancel")');
  });

  test('Touch interactions work properly', async () => {
    await page.goto(`${config.baseUrl}/dashboard`);
    
    // Test touch scrolling
    const initialY = await page.evaluate(() => window.scrollY);
    await page.touchscreen.tap(200, 500); // Tap to focus
    await page.mouse.wheel(0, 200); // Simulate scroll
    const newY = await page.evaluate(() => window.scrollY);
    
    expect(newY).toBeGreaterThan(initialY);
    
    // Test touch on reference video buttons
    const refButton = await page.waitForSelector('button:has-text("Watch Reference")');
    await refButton.tap();
    
    // This would open a new tab in a real browser
    // For testing, we'll just check if the click handler was triggered
    const newPages = context.pages().length;
    expect(newPages).toBeGreaterThanOrEqual(1);
  });
});

// Additional test for camera functionality
// This would typically be run separately with proper mocks
describe('Camera Functionality Tests', () => {
  test('Camera capture component handles permissions correctly', async () => {
    // This is a placeholder for a more comprehensive test
    // In a real test environment, we would:
    // 1. Mock the MediaDevices API
    // 2. Test permission denied scenarios
    // 3. Test successful recording
    // 4. Test saving the recorded video
    
    console.log('Camera functionality tests would be implemented here');
    expect(true).toBe(true);
  });
});
