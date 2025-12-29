// AWS Amplify Configuration
// Environment-aware configuration for Auth and Storage

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
      identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID || '',
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
        name: {
          required: false,
        },
        phone_number: {
          required: false,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_AWS_S3_BUCKET || '',
      region: import.meta.env.VITE_AWS_REGION || 'me-south-1',
    },
  },
};

export default amplifyConfig;
