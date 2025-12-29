# AWS Cognito Error Handling & Authentication Flows

This document describes all the Cognito authentication challenges and errors that are handled in the application.

## Authentication Challenge Flows (Sign-In Next Steps)

### ✅ Implemented Flows

#### 1. CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED
**Status:** Fully Implemented
**Description:** User must set a new password (typically after admin creates account)
**User Experience:** Form switches to new password entry with validation indicators
**Location:** [Login.jsx:39-43](src/pages/Login.jsx#L39-L43), [AuthContext.jsx:210-291](src/contexts/AuthContext.jsx#L210-L291)

#### 2. CONFIRM_SIGN_UP
**Status:** Handled with user message
**Description:** User needs to verify email address
**User Experience:** Error message: "Please verify your email address. Check your inbox for the verification code."
**Location:** [Login.jsx:44-45](src/pages/Login.jsx#L44-L45)

#### 3. RESET_PASSWORD
**Status:** Handled with user message
**Description:** Password reset is required
**User Experience:** Error message: "Password reset required. Please contact your administrator."
**Location:** [Login.jsx:46-47](src/pages/Login.jsx#L46-L47)

### 🔄 Not Yet Implemented (Future Enhancement)

#### 4. CONFIRM_SIGN_IN_WITH_SMS_CODE
**Status:** Not implemented
**Description:** SMS MFA verification required
**User Experience:** Error message directs user to contact administrator
**Location:** [Login.jsx:48-49](src/pages/Login.jsx#L48-L49)

#### 5. CONFIRM_SIGN_IN_WITH_TOTP_CODE
**Status:** Not implemented
**Description:** Time-based One-Time Password (TOTP) MFA required
**User Experience:** Error message directs user to contact administrator
**Location:** [Login.jsx:50-51](src/pages/Login.jsx#L50-L51)

#### 6. CONTINUE_SIGN_IN_WITH_MFA_SELECTION
**Status:** Not implemented
**Description:** User needs to select MFA method
**User Experience:** Error message directs user to contact administrator
**Location:** [Login.jsx:52-53](src/pages/Login.jsx#L52-L53)

#### 7. CONTINUE_SIGN_IN_WITH_TOTP_SETUP
**Status:** Not implemented
**Description:** User needs to set up TOTP MFA
**User Experience:** Error message directs user to contact administrator
**Location:** [Login.jsx:54-55](src/pages/Login.jsx#L54-L55)

#### 8. CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE
**Status:** Not implemented
**Description:** Custom authentication challenge configured in Cognito
**User Experience:** Error message directs user to contact administrator
**Location:** [Login.jsx:56-57](src/pages/Login.jsx#L56-L57)

## Error Handling

### Sign-In Errors ([AuthContext.jsx:92-119](src/contexts/AuthContext.jsx#L92-L119))

| Error Name | User-Friendly Message | Description |
|------------|----------------------|-------------|
| `UserNotFoundException` | "User not found. Please check your email address." | Email doesn't exist in user pool |
| `NotAuthorizedException` | "Incorrect email or password. Please try again." | Wrong password or user not authorized |
| `UserNotConfirmedException` | "Email not verified. Please check your inbox for the verification code." | User hasn't verified email |
| `PasswordResetRequiredException` | "Password reset required. Please contact your administrator." | User must reset password |
| `TooManyRequestsException` | "Too many failed attempts. Please try again later." | Rate limiting triggered |
| `InvalidParameterException` | "Invalid email or password format." | Input validation failed |

### Sign-Up Errors ([AuthContext.jsx:144-167](src/contexts/AuthContext.jsx#L144-L167))

| Error Name | User-Friendly Message | Description |
|------------|----------------------|-------------|
| `UsernameExistsException` | "An account with this email already exists." | Email already registered |
| `InvalidPasswordException` | "Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character." | Password policy violation |
| `InvalidParameterException` | "Invalid email or password format." | Input validation failed |
| `TooManyRequestsException` | "Too many requests. Please try again later." | Rate limiting triggered |

### New Password Errors ([AuthContext.jsx:269-291](src/contexts/AuthContext.jsx#L269-L291))

| Error Name | User-Friendly Message | Description |
|------------|----------------------|-------------|
| `InvalidPasswordException` | "Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character." | Password policy violation |
| `InvalidParameterException` | "Invalid password format." | Input validation failed |
| `NotAuthorizedException` | "Session expired. Please sign in again." | Auth session expired |
| `LimitExceededException` | "Too many attempts. Please try again later." | Rate limiting triggered |

## Password Requirements

All passwords must meet the following criteria:
- ✓ Minimum 8 characters
- ✓ At least one uppercase letter (A-Z)
- ✓ At least one lowercase letter (a-z)
- ✓ At least one number (0-9)
- ✓ At least one special character (!@#$%^&*)

## Admin-Only User Registration

- Public `/register` route is disabled
- Only authenticated administrators can create new users via `/users` route
- New users receive email verification codes
- First-time users must set a new password after signing in with temporary password

## Session Persistence

- User authentication state persists in Amplify session storage
- New password requirement flag persists in browser sessionStorage
- Handles component remounts gracefully during authentication challenges

## Testing Scenarios

### Scenario 1: First-Time User Login
1. Admin creates user with temporary password
2. User receives email with temporary password
3. User signs in with temporary password
4. System detects `CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED`
5. Form switches to new password entry
6. User sets new password meeting all requirements
7. User is authenticated and redirected to dashboard

### Scenario 2: Invalid Credentials
1. User enters wrong email or password
2. System returns `NotAuthorizedException`
3. User sees: "Incorrect email or password. Please try again."

### Scenario 3: Unverified Email
1. User tries to sign in before verifying email
2. System returns `UserNotConfirmedException`
3. User sees: "Email not verified. Please check your inbox for the verification code."

### Scenario 4: Too Many Failed Attempts
1. User makes multiple failed login attempts
2. System returns `TooManyRequestsException`
3. User sees: "Too many failed attempts. Please try again later."
4. User is temporarily locked out (Cognito-managed)

## Future Enhancements

- [ ] Implement SMS MFA flow
- [ ] Implement TOTP MFA flow
- [ ] Implement MFA setup wizard
- [ ] Implement custom authentication challenges
- [ ] Add forgot password flow
- [ ] Add password strength meter
- [ ] Add account lockout notifications
- [ ] Add session timeout warnings

## Security Best Practices

1. ✅ All authentication handled server-side by AWS Cognito
2. ✅ Passwords never stored in application state
3. ✅ Session tokens managed by Amplify SDK
4. ✅ Rate limiting enforced by Cognito
5. ✅ Password complexity requirements enforced
6. ✅ Email verification required for new accounts
7. ✅ Admin-only user creation (no self-registration)
8. ✅ Clear error messages without revealing sensitive information

## Support

For authentication issues:
1. Check AWS Cognito console logs
2. Review browser console for detailed error logs
3. Verify user exists in Cognito User Pool
4. Check user status (CONFIRMED, UNCONFIRMED, FORCE_CHANGE_PASSWORD, etc.)
5. Contact administrator for password reset or account issues
