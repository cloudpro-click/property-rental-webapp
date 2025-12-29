import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
  getCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth';
import amplifyConfig from '../lib/amplifyConfig';

// Configure Amplify
Amplify.configure(amplifyConfig);

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setLoading(true);
      console.log('Checking auth state...');

      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);

      const session = await fetchAuthSession();
      console.log('Session fetched:', { hasTokens: !!session.tokens });

      const userData = {
        username: currentUser.username,
        userId: currentUser.userId,
        signInDetails: currentUser.signInDetails,
        tokens: session.tokens,
      };

      console.log('Setting user data:', { username: userData.username, userId: userData.userId });
      setUser(userData);
    } catch (err) {
      console.log('No authenticated user:', err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log('Attempting sign in for:', email);

      const signInResult = await signIn({
        username: email,
        password,
      });

      console.log('Sign in result:', signInResult);

      if (signInResult.isSignedIn) {
        console.log('Sign in successful, checking auth state...');
        await checkAuthState();
        console.log('Auth state updated');
        return { success: true };
      }

      // Handle additional steps (MFA, etc.)
      console.log('Additional step required:', signInResult.nextStep);
      return { success: false, nextStep: signInResult.nextStep };
    } catch (err) {
      console.error('Sign in error:', err);

      // Handle specific Cognito errors
      let errorMessage = 'Failed to sign in';

      if (err.name === 'UserNotFoundException') {
        errorMessage = 'User not found. Please check your email address.';
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect email or password. Please try again.';
      } else if (err.name === 'UserNotConfirmedException') {
        errorMessage = 'Email not verified. Please check your inbox for the verification code.';
      } else if (err.name === 'PasswordResetRequiredException') {
        errorMessage = 'Password reset required. Please contact your administrator.';
      } else if (err.name === 'TooManyRequestsException') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (err.name === 'InvalidParameterException') {
        errorMessage = 'Invalid email or password format.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email, password, attributes = {}) => {
    try {
      setError(null);
      setLoading(true);

      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            ...attributes,
          },
          autoSignIn: true,
        },
      });

      return {
        success: true,
        isSignUpComplete,
        userId,
        nextStep,
      };
    } catch (err) {
      console.error('Sign up error:', err);

      // Handle specific Cognito errors
      let errorMessage = 'Failed to create user';

      if (err.name === 'UsernameExistsException') {
        errorMessage = 'An account with this email already exists.';
      } else if (err.name === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character.';
      } else if (err.name === 'InvalidParameterException') {
        errorMessage = 'Invalid email or password format.';
      } else if (err.name === 'TooManyRequestsException') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (email, code) => {
    try {
      setError(null);
      setLoading(true);

      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      return {
        success: true,
        isSignUpComplete,
        nextStep,
      };
    } catch (err) {
      setError(err.message || 'Failed to confirm sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmationCode = async (email) => {
    try {
      setError(null);
      await resendSignUpCode({ username: email });
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to resend confirmation code');
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut();
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to sign out');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      setError(null);
      const output = await resetPassword({ username: email });
      return {
        success: true,
        nextStep: output.nextStep,
      };
    } catch (err) {
      setError(err.message || 'Failed to initiate password reset');
      throw err;
    }
  };

  const handleConfirmForgotPassword = async (email, code, newPassword) => {
    try {
      setError(null);
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      throw err;
    }
  };

  const handleConfirmNewPassword = async (newPassword) => {
    try {
      setError(null);
      setLoading(true);

      console.log('Confirming new password...');

      const result = await confirmSignIn({
        challengeResponse: newPassword,
      });

      console.log('Confirm new password result:', result);

      if (result.isSignedIn) {
        console.log('Password updated, checking auth state...');
        await checkAuthState();
        console.log('Auth state check completed');
        return { success: true };
      }

      setLoading(false);
      return { success: false, nextStep: result.nextStep };
    } catch (err) {
      console.error('Confirm new password error:', err);

      // Handle specific Cognito errors
      let errorMessage = 'Failed to set new password';

      if (err.name === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character.';
      } else if (err.name === 'InvalidParameterException') {
        errorMessage = 'Invalid password format.';
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Session expired. Please sign in again.';
      } else if (err.name === 'LimitExceededException') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    confirmSignUp: handleConfirmSignUp,
    resendConfirmationCode: handleResendConfirmationCode,
    forgotPassword: handleForgotPassword,
    confirmForgotPassword: handleConfirmForgotPassword,
    confirmNewPassword: handleConfirmNewPassword,
    refreshAuth: checkAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
