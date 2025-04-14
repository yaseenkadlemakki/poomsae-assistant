// Functional Tests for Virtual Poomsae Coach Enhanced Features
// This script tests the new features: Poomsae selection, video comparison, and feedback rating

// Test configuration
const config = {
  baseUrl: 'https://odfreuwr.manus.space',
  testUser: {
    username: 'testuser_' + Date.now(),
    email: 'test_' + Date.now() + '@example.com',
    password: 'Password123!'
  },
  poomsaeTypes: [
    'Taegeuk 1 Jang',
    'Taegeuk 2 Jang',
    'Taegeuk 3 Jang',
    'Taegeuk 4 Jang',
    'Taegeuk 5 Jang',
    'Taegeuk 6 Jang',
    'Taegeuk 7 Jang'
  ]
};

// Helper functions
function log(message, isError = false) {
  const style = isError 
    ? 'color: red; font-weight: bold;' 
    : 'color: green; font-weight: bold;';
  console.log(`%c${message}`, style);
}

function logTestStart(testName) {
  console.log(`\n%c=== STARTING TEST: ${testName} ===`, 'color: blue; font-weight: bold;');
}

function logTestResult(testName, success, message) {
  const result = success ? 'PASSED ✅' : 'FAILED ❌';
  const style = success ? 'color: green; font-weight: bold;' : 'color: red; font-weight: bold;';
  console.log(`%c${testName}: ${result} - ${message}`, style);
}

// Main test runner
async function runTests() {
  log('STARTING FUNCTIONAL TESTS FOR VIRTUAL POOMSAE COACH ENHANCED FEATURES', false);
  
  try {
    // Test 1: User Registration
    await testUserRegistration();
    
    // Test 2: Poomsae Selection Feature
    await testPoomsaeSelection();
    
    // Test 3: Video Comparison Feature
    await testVideoComparison();
    
    // Test 4: Feedback Rating System
    await testFeedbackRating();
    
    log('ALL TESTS COMPLETED', false);
  } catch (error) {
    log(`TEST EXECUTION ERROR: ${error.message}`, true);
    console.error(error);
  }
}

// Individual test functions
async function testUserRegistration() {
  logTestStart('User Registration');
  
  try {
    // Navigate to registration page
    window.location.href = `${config.baseUrl}/register`;
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we're on the registration page
    if (!document.title.includes('Virtual Poomsae Coach')) {
      throw new Error('Not on registration page');
    }
    
    // Fill in registration form
    document.querySelector('input[id="username"]').value = config.testUser.username;
    document.querySelector('input[id="email"]').value = config.testUser.email;
    document.querySelector('input[id="password"]').value = config.testUser.password;
    document.querySelector('input[id="confirmPassword"]').value = config.testUser.password;
    
    // Submit form
    document.querySelector('button[type="submit"]').click();
    
    // Wait for redirect to dashboard
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we're on the dashboard
    const onDashboard = window.location.href.includes('/dashboard') || 
                        document.querySelector('h2')?.textContent.includes('Your Poomsae Videos');
    
    if (!onDashboard) {
      throw new Error('Registration failed - not redirected to dashboard');
    }
    
    logTestResult('User Registration', true, 'Successfully registered and redirected to dashboard');
    return true;
  } catch (error) {
    logTestResult('User Registration', false, error.message);
    // Continue with tests using localStorage directly if registration UI fails
    localStorage.setItem('currentUser', JSON.stringify({
      id: Date.now(),
      username: config.testUser.username,
      email: config.testUser.email
    }));
    localStorage.setItem('authToken', `demo-token-${Date.now()}`);
    window.location.href = `${config.baseUrl}/dashboard`;
    await new Promise(resolve => setTimeout(resolve, 2000));
    return false;
  }
}

async function testPoomsaeSelection() {
  logTestStart('Poomsae Selection Feature');
  
  try {
    // Make sure we're on the dashboard
    if (!window.location.href.includes('/dashboard')) {
      window.location.href = `${config.baseUrl}/dashboard`;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Check if the upload button exists
    const uploadButton = Array.from(document.querySelectorAll('button')).find(
      button => button.textContent.includes('Upload New Video')
    );
    
    if (!uploadButton) {
      throw new Error('Upload button not found on dashboard');
    }
    
    // Click upload button to open modal
    uploadButton.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if modal opened
    const modal = document.querySelector('.fixed.inset-0');
    if (!modal) {
      throw new Error('Upload modal did not open');
    }
    
    // Check if Poomsae selection dropdown exists
    const poomsaeSelect = document.querySelector('select[id="poomsaeType"]');
    if (!poomsaeSelect) {
      throw new Error('Poomsae type selection dropdown not found');
    }
    
    // Check if all Poomsae types are available in the dropdown
    const options = Array.from(poomsaeSelect.options).map(option => option.text);
    const missingTypes = config.poomsaeTypes.filter(type => !options.includes(type));
    
    if (missingTypes.length > 0) {
      throw new Error(`Missing Poomsae types in dropdown: ${missingTypes.join(', ')}`);
    }
    
    // Select a Poomsae type
    const selectedType = config.poomsaeTypes[0]; // Taegeuk 1 Jang
    poomsaeSelect.value = selectedType;
    
    // Trigger change event
    const event = new Event('change', { bubbles: true });
    poomsaeSelect.dispatchEvent(event);
    
    // Fill in title
    const titleInput = document.querySelector('input[id="title"]');
    if (!titleInput) {
      throw new Error('Title input not found');
    }
    
    titleInput.value = `Test ${selectedType} Performance`;
    
    // Submit form
    const submitButton = Array.from(modal.querySelectorAll('button')).find(
      button => button.textContent.includes('Upload')
    );
    
    if (!submitButton) {
      throw new Error('Submit button not found in upload modal');
    }
    
    submitButton.click();
    
    // Wait for upload simulation to complete
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if video was added to the list
    const videos = document.querySelectorAll('.grid > div');
    const newVideo = Array.from(videos).find(
      video => video.textContent.includes(`Test ${selectedType} Performance`)
    );
    
    if (!newVideo) {
      throw new Error('Newly uploaded video not found in the list');
    }
    
    // Check if the video has the correct Poomsae type
    if (!newVideo.textContent.includes(selectedType)) {
      throw new Error('Uploaded video does not show the selected Poomsae type');
    }
    
    logTestResult('Poomsae Selection Feature', true, 'Successfully selected Poomsae type and uploaded video');
    return true;
  } catch (error) {
    logTestResult('Poomsae Selection Feature', false, error.message);
    return false;
  }
}

async function testVideoComparison() {
  logTestStart('Video Comparison Feature');
  
  try {
    // Make sure we're on the dashboard
    if (!window.location.href.includes('/dashboard')) {
      window.location.href = `${config.baseUrl}/dashboard`;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Find a video to compare
    const compareButtons = Array.from(document.querySelectorAll('button')).filter(
      button => button.textContent.includes('Compare')
    );
    
    if (compareButtons.length === 0) {
      throw new Error('No Compare buttons found on dashboard');
    }
    
    // Click the first Compare button
    compareButtons[0].click();
    
    // Wait for navigation to comparison page
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we're on a video page
    if (!window.location.href.includes('/video/')) {
      throw new Error('Not redirected to video comparison page');
    }
    
    // Check if the Analyze button exists
    const analyzeButton = Array.from(document.querySelectorAll('button')).find(
      button => button.textContent.includes('Analyze and Compare')
    );
    
    if (!analyzeButton) {
      throw new Error('Analyze and Compare button not found');
    }
    
    // Click the Analyze button
    analyzeButton.click();
    
    // Wait for analysis to complete
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if comparison results are displayed
    const resultsSection = document.querySelector('h3.text-xl.font-semibold');
    if (!resultsSection || !resultsSection.textContent.includes('Detailed Analysis')) {
      throw new Error('Comparison results not displayed after analysis');
    }
    
    // Check if YouTube iframe is displayed
    const youtubeEmbed = document.querySelector('iframe[src*="youtube.com"]');
    if (!youtubeEmbed) {
      throw new Error('YouTube reference video not embedded');
    }
    
    // Check if scores are displayed
    const scoreElements = document.querySelectorAll('[class*="bg-"][class*="-500"]');
    if (scoreElements.length === 0) {
      throw new Error('Performance scores not displayed');
    }
    
    logTestResult('Video Comparison Feature', true, 'Successfully compared video with reference and displayed results');
    return true;
  } catch (error) {
    logTestResult('Video Comparison Feature', false, error.message);
    return false;
  }
}

async function testFeedbackRating() {
  logTestStart('Feedback Rating System');
  
  try {
    // Navigate to dashboard
    window.location.href = `${config.baseUrl}/dashboard`;
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find a video to get feedback for
    const viewDetailsButtons = Array.from(document.querySelectorAll('button')).filter(
      button => button.textContent.includes('View Details')
    );
    
    if (viewDetailsButtons.length === 0) {
      throw new Error('No View Details buttons found on dashboard');
    }
    
    // Get the video ID from the parent element
    const videoElement = viewDetailsButtons[0].closest('div[key]');
    let videoId;
    
    if (videoElement && videoElement.getAttribute('key')) {
      videoId = videoElement.getAttribute('key');
    } else {
      // If we can't get the ID from the DOM, create a mock video in localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const userVideos = JSON.parse(localStorage.getItem(`videos_${currentUser.id}`) || '[]');
      
      if (userVideos.length > 0) {
        videoId = userVideos[0].id;
      } else {
        throw new Error('No videos found for feedback testing');
      }
    }
    
    // Navigate directly to feedback page
    window.location.href = `${config.baseUrl}/feedback/${videoId}`;
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we're on the feedback page
    if (!window.location.href.includes('/feedback/')) {
      throw new Error('Not redirected to feedback page');
    }
    
    // Check if the Generate Feedback button exists
    const generateButton = Array.from(document.querySelectorAll('button')).find(
      button => button.textContent.includes('Generate Detailed Feedback')
    );
    
    if (!generateButton) {
      throw new Error('Generate Detailed Feedback button not found');
    }
    
    // Click the Generate button
    generateButton.click();
    
    // Wait for feedback generation to complete
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if detailed feedback is displayed
    const assessmentSection = Array.from(document.querySelectorAll('h4')).find(
      heading => heading.textContent.includes('Overall Assessment')
    );
    
    if (!assessmentSection) {
      throw new Error('Overall Assessment section not found after generating feedback');
    }
    
    // Check if performance metrics are displayed
    const metricsSection = Array.from(document.querySelectorAll('h4')).find(
      heading => heading.textContent.includes('Performance Metrics')
    );
    
    if (!metricsSection) {
      throw new Error('Performance Metrics section not found');
    }
    
    // Check if improvement suggestions are displayed
    const suggestionsSection = Array.from(document.querySelectorAll('h4')).find(
      heading => heading.textContent.includes('Improvement Suggestions')
    );
    
    if (!suggestionsSection) {
      throw new Error('Improvement Suggestions section not found');
    }
    
    // Check if scores are displayed
    const scoreElements = document.querySelectorAll('[class*="bg-"][class*="-500"]');
    if (scoreElements.length === 0) {
      throw new Error('Performance scores not displayed in feedback');
    }
    
    logTestResult('Feedback Rating System', true, 'Successfully generated and displayed detailed feedback with ratings');
    return true;
  } catch (error) {
    logTestResult('Feedback Rating System', false, error.message);
    return false;
  }
}

// Execute all tests
runTests().then(() => {
  console.log('Test execution completed');
});
