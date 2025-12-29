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
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      setUser({
        username: currentUser.username,
        userId: currentUser.userId,
        signInDetails: currentUser.signInDetails,
        tokens: session.tokens,
      });
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        await checkAuthState();
        return { success: true };
      }

      // Handle additional steps (MFA, etc.)
      return { success: false, nextStep };
    } catch (err) {
      setError(err.message || 'Failed to sign in');
      throw err;
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
      setError(err.message || 'Failed to sign up');
      throw err;
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
    refreshAuth: checkAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
