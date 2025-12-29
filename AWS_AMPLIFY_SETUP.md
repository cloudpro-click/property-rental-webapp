# AWS Amplify Integration Guide

## Overview

This project uses AWS Amplify for authentication (AWS Cognito) and file storage (Amazon S3). The integration provides a complete authentication flow with email verification, password management, and secure file uploads.

## AWS Services Configured

### 1. Amazon Cognito (Authentication)

**User Pool ID**: `me-south-1_lOu0NNkLl`
**User Pool Client ID**: `38qbhusip33c3pgip0dgp361f6`
**Identity Pool ID**: `me-south-1:0806456a-344b-40c5-b2fe-0eb60cc0508b`
**Region**: `me-south-1` (Middle East - Bahrain)

#### Features:
- Email-based authentication
- Email verification for new accounts
- Password requirements enforcement
- Automatic session management
- Token refresh handling

### 2. Amazon S3 (File Storage)

**Bucket Name**: `property-rentals-file-dev-bucket`
**Region**: `me-south-1`

#### Purpose:
- Store building photos
- Store tenant documents
- Store rental agreements
- Store receipts and invoices

## Environment Setup

### Development (.env.development)

```env
VITE_AWS_REGION=me-south-1
VITE_AWS_USER_POOL_ID=me-south-1_lOu0NNkLl
VITE_AWS_USER_POOL_CLIENT_ID=38qbhusip33c3pgip0dgp361f6
VITE_AWS_IDENTITY_POOL_ID=me-south-1:0806456a-344b-40c5-b2fe-0eb60cc0508b
VITE_AWS_S3_BUCKET=property-rentals-file-dev-bucket
```

### Production (.env.production)

```env
VITE_AWS_REGION=me-south-1
VITE_AWS_USER_POOL_ID=<production-user-pool-id>
VITE_AWS_USER_POOL_CLIENT_ID=<production-client-id>
VITE_AWS_IDENTITY_POOL_ID=<production-identity-pool-id>
VITE_AWS_S3_BUCKET=<production-s3-bucket>
```

**Note**: Update production values before deploying to production!

## Authentication Flow

### 1. Sign Up

```javascript
import { useAuth } from './contexts/AuthContext';

const { signUp } = useAuth();

// Sign up new user
const result = await signUp(email, password, {
  name: 'John Doe',
});

if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
  // Show verification code input
}
```

### 2. Email Verification

```javascript
const { confirmSignUp } = useAuth();

// Verify email with code sent to user's email
await confirmSignUp(email, verificationCode);
```

### 3. Sign In

```javascript
const { signIn } = useAuth();

const result = await signIn(email, password);

if (result.success) {
  // User is authenticated
  // Navigate to dashboard
}
```

### 4. Sign Out

```javascript
const { signOut } = useAuth();

await signOut();
// User is logged out
```

### 5. Forgot Password

```javascript
const { forgotPassword, confirmForgotPassword } = useAuth();

// Step 1: Request password reset
await forgotPassword(email);
// Code sent to user's email

// Step 2: Confirm with code and new password
await confirmForgotPassword(email, code, newPassword);
```

## AuthContext API

### Properties

- `user`: Current user object with tokens (null if not authenticated)
- `loading`: Boolean indicating auth state check in progress
- `error`: Error message from last auth operation
- `isAuthenticated`: Boolean - true if user is signed in

### Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `signIn` | email, password | Promise<{success, nextStep}> | Authenticate user |
| `signUp` | email, password, attributes | Promise<{success, userId, nextStep}> | Register new user |
| `confirmSignUp` | email, code | Promise<{success, isSignUpComplete}> | Verify email |
| `resendConfirmationCode` | email | Promise<{success}> | Resend verification code |
| `signOut` | - | Promise<{success}> | Log out user |
| `forgotPassword` | email | Promise<{success, nextStep}> | Initiate password reset |
| `confirmForgotPassword` | email, code, newPassword | Promise<{success}> | Complete password reset |
| `refreshAuth` | - | Promise<void> | Refresh authentication state |

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

## Protected Routes

Use the `useAuth` hook to protect routes:

```javascript
import { useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedPage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <YourComponent />;
};
```

## File Upload to S3 (Future Implementation)

```javascript
import { uploadData } from 'aws-amplify/storage';

// Upload file
const result = await uploadData({
  key: `buildings/${buildingId}/photos/${filename}`,
  data: file,
  options: {
    contentType: file.type,
  }
}).result;

console.log('File uploaded:', result.key);
```

## User Attributes

Default attributes stored in Cognito:

- `email` (required) - User's email address
- `name` (optional) - User's full name
- `phone_number` (optional) - User's phone number
- `email_verified` (auto) - Email verification status
- `sub` (auto) - Unique user ID (UUID)

## Security Best Practices

1. **Never commit .env files** with real credentials
2. **Use HTTPS** in production
3. **Enable MFA** for admin accounts (optional)
4. **Rotate credentials** periodically
5. **Monitor CloudWatch** for suspicious activity
6. **Set up Cognito triggers** for custom validation
7. **Implement rate limiting** on auth endpoints
8. **Use AWS WAF** to protect against attacks

## Troubleshooting

### Common Errors

#### 1. "User is not confirmed"
**Solution**: User needs to verify email. Use `confirmSignUp()` with verification code.

#### 2. "Invalid session"
**Solution**: Token expired. Call `refreshAuth()` or ask user to sign in again.

#### 3. "Network error"
**Solution**: Check AWS region and endpoint URLs. Ensure network connectivity.

#### 4. "Access denied to S3"
**Solution**: Check Identity Pool permissions and IAM roles.

## AWS Console Links

- **Cognito User Pool**: https://me-south-1.console.aws.amazon.com/cognito/v2/idp/user-pools/me-south-1_lOu0NNkLl
- **S3 Bucket**: https://s3.console.aws.amazon.com/s3/buckets/property-rentals-file-dev-bucket
- **CloudWatch Logs**: https://me-south-1.console.aws.amazon.com/cloudwatch/

## Testing Authentication Locally

1. Start dev server: `yarn dev`
2. Navigate to http://localhost:3000/register
3. Create account with valid email
4. Check email for verification code
5. Enter code on confirmation screen
6. Sign in with credentials
7. Access protected routes

## Production Deployment Checklist

- [ ] Update .env.production with production AWS credentials
- [ ] Create production Cognito User Pool
- [ ] Create production S3 bucket
- [ ] Configure Identity Pool for production
- [ ] Set up CloudWatch alarms
- [ ] Configure backup policies for S3
- [ ] Enable S3 encryption at rest
- [ ] Set up CORS policies for S3 bucket
- [ ] Configure lifecycle policies for old files
- [ ] Test authentication flow in staging
- [ ] Monitor CloudWatch logs after deployment

## Support

For AWS-related issues:
- AWS Support Center: https://console.aws.amazon.com/support/
- AWS Documentation: https://docs.aws.amazon.com/amplify/

For application issues:
- Create an issue in the project repository
