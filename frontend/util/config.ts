/**
 * Application configuration settings
 * Contains environment-specific variables like API URLs
 */

// Backend API URL - adjust this based on your environment
export const API_URL = 'http://10.0.2.2:8000';  // For Android emulator to connect to localhost
// If using physical device on same network as development machine, use your machine's IP address
// export const API_URL = 'http://192.168.1.XXX:8000';  // Replace XXX with your IP address
// For iOS simulator
// export const API_URL = 'http://localhost:8000';  

// Timeout for API requests in milliseconds
export const API_TIMEOUT = 30000;  // Increased to 30 seconds

// Other configuration constants
export const APP_VERSION = '1.0.0';