/**
 * Environment configuration
 * Access environment variables with type safety and defaults
 */

const env = {
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'RentManager',
  appVersion: import.meta.env.VITE_APP_VERSION || '0.1.0',

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,

  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),

  // Feature Flags
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  enablePWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',

  // External Services
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
};

export default env;
