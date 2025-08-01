// testLogger.ts

// Import the Log function from your middleware file
import { Log } from './Logging Middleware/logger';

// A simple function to run our test
async function runTest() {
  console.log("Attempting to send a test log...");

  // Call the log function with valid parameters
  await Log('frontend', 'info', 'component', 'This is a test log from a standalone script.');

  console.log("Test log function has been called.");
}

// Execute the test
runTest();