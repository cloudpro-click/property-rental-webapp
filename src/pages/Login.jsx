import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, confirmNewPassword, forgotPassword, confirmForgotPassword, error: authError } = useAuth();

  // Initialize email from localStorage if "remember me" was checked
  const [formData, setFormData] = useState(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    return {
      email: savedEmail || 'prabukamal@gmail.com',
      password: '8wC!$5tOKuxE'
    };
  });

  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('rememberedEmail') !== null;
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Check sessionStorage for persisted new password requirement state
  const [needsNewPassword, setNeedsNewPassword] = useState(() => {
    return sessionStorage.getItem('needsNewPassword') === 'true';
  });

  // Forgot password states
  const [viewMode, setViewMode] = useState('login'); // 'login', 'forgotPassword', 'resetCode'
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);
      console.log('Login.jsx - Sign in result:', result);

      if (result.success) {
        console.log('Login.jsx - Success, navigating to dashboard');

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        navigate('/dashboard');
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        console.log('Login.jsx - Setting needsNewPassword to true');
        sessionStorage.setItem('needsNewPassword', 'true');
        setNeedsNewPassword(true);
        console.log('Login.jsx - needsNewPassword state should now be true');
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        setError('Please verify your email address. Check your inbox for the verification code.');
      } else if (result.nextStep?.signInStep === 'RESET_PASSWORD') {
        setError('Password reset required. Please contact your administrator.');
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        setError('SMS verification required. This feature is not yet implemented. Please contact your administrator.');
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
        setError('MFA verification required. This feature is not yet implemented. Please contact your administrator.');
      } else if (result.nextStep?.signInStep === 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION') {
        setError('MFA setup required. This feature is not yet implemented. Please contact your administrator.');
      } else if (result.nextStep?.signInStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP') {
        setError('MFA setup required. This feature is not yet implemented. Please contact your administrator.');
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
        setError('Custom authentication challenge. Please contact your administrator.');
      } else if (result.nextStep) {
        console.log('Login.jsx - Other step required:', result.nextStep.signInStep);
        setError(`Additional step required: ${result.nextStep.signInStep}. Please contact your administrator.`);
      }
    } catch (err) {
      console.error('Login.jsx - Sign in error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/(?=.*[a-z])/.test(newPassword)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    if (!/(?=.*[A-Z])/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/(?=.*\d)/.test(newPassword)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!/(?=.*[!@#$%^&*])/.test(newPassword)) {
      setError('Password must contain at least one special character (!@#$%^&*)');
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting new password...');
      const result = await confirmNewPassword(newPassword);
      console.log('New password result:', result);

      if (result.success) {
        console.log('Password change successful, navigating to dashboard...');
        // Clear sessionStorage flag
        sessionStorage.removeItem('needsNewPassword');
        // Reset form state
        setNeedsNewPassword(false);
        setNewPassword('');
        setConfirmPassword('');
        setFormData({ email: '', password: '' });
        // Navigate immediately - auth state is already updated
        console.log('Navigating to dashboard now...');
        navigate('/dashboard', { replace: true });
      } else if (result.nextStep) {
        setError(`Additional step required: ${result.nextStep.signInStep}`);
        setLoading(false);
      }
    } catch (err) {
      console.error('New password error:', err);
      setError(err.message || 'Failed to set new password. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPasswordClick = () => {
    setViewMode('forgotPassword');
    setForgotPasswordEmail(formData.email);
    setError('');
  };

  const handleBackToLogin = () => {
    setViewMode('login');
    setForgotPasswordEmail('');
    setResetCode('');
    setResetNewPassword('');
    setResetConfirmPassword('');
    setError('');
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!forgotPasswordEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(forgotPasswordEmail);
      console.log('Forgot password result:', result);

      if (result.success) {
        setViewMode('resetCode');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to initiate password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resetCode || !resetNewPassword || !resetConfirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (resetNewPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/(?=.*[a-z])/.test(resetNewPassword)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    if (!/(?=.*[A-Z])/.test(resetNewPassword)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/(?=.*\d)/.test(resetNewPassword)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!/(?=.*[!@#$%^&*])/.test(resetNewPassword)) {
      setError('Password must contain at least one special character (!@#$%^&*)');
      return;
    }

    setLoading(true);

    try {
      const result = await confirmForgotPassword(forgotPasswordEmail, resetCode, resetNewPassword);
      console.log('Reset password result:', result);

      if (result.success) {
        // Reset was successful, go back to login
        setViewMode('login');
        setResetCode('');
        setResetNewPassword('');
        setResetConfirmPassword('');
        setForgotPasswordEmail('');
        setError('');
        // Show success message
        alert('Password reset successful! Please sign in with your new password.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  console.log('Login.jsx - Render - needsNewPassword:', needsNewPassword);
  console.log('Login.jsx - Render - viewMode:', viewMode);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Philippine Sun Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-48 h-48 text-accent-500">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="15"/>
              {[...Array(8)].map((_, i) => (
                <polygon
                  key={i}
                  points="50,50 45,25 55,25"
                  transform={`rotate(${i * 45} 50 50)`}
                />
              ))}
            </svg>
          </div>
          <div className="absolute bottom-20 left-20 w-32 h-32 text-accent-500 opacity-50">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="15"/>
              {[...Array(8)].map((_, i) => (
                <polygon
                  key={i}
                  points="50,50 45,25 55,25"
                  transform={`rotate(${i * 45} 50 50)`}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-10 xl:px-12 text-white max-w-lg">
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-xl mb-5 shadow-lg overflow-hidden">
              <img
                src="/logo.jpg"
                alt="Property Rental Manager Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-display font-bold mb-3 leading-tight">
              Property Rental Manager
            </h1>
            <p className="text-base text-primary-100 leading-relaxed">
              Streamline your property management with powerful tools
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Manage Buildings & Units</h3>
                <p className="text-primary-200 text-sm leading-relaxed">Track all your properties and rental units in one place</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Tenant Management</h3>
                <p className="text-primary-200 text-sm leading-relaxed">Keep track of tenant information and lease agreements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">Billing & Collections</h3>
                <p className="text-primary-200 text-sm leading-relaxed">Automate rent collection and track payments effortlessly</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-10">
            <p className="text-xs text-primary-200 opacity-80">
              © 2025 Property Rental Manager. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-neutral-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-md overflow-hidden border border-neutral-200">
              <img
                src="/logo.jpg"
                alt="Property Rental Manager Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-display font-bold text-neutral-900 mb-2">
              Property Rental Manager
            </h1>
            <p className="text-neutral-600">
              Manage your properties with ease
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
            {needsNewPassword
              ? 'Set New Password'
              : viewMode === 'forgotPassword'
                ? 'Reset Password'
                : viewMode === 'resetCode'
                  ? 'Enter Reset Code'
                  : 'Welcome Back'}
          </h2>

          {needsNewPassword && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
              <p className="font-medium mb-1">Password Change Required</p>
              <p>Please set a new password to continue. Your password must meet the security requirements below.</p>
            </div>
          )}

          {viewMode === 'forgotPassword' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
              <p>Enter your email address and we'll send you a verification code to reset your password.</p>
            </div>
          )}

          {viewMode === 'resetCode' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
              <p>We sent a verification code to <strong>{forgotPasswordEmail}</strong>. Enter the code and your new password below.</p>
            </div>
          )}

          {(error || authError) && (
            <div className="mb-4 p-3 bg-secondary-50 border border-secondary-200 text-secondary-700 rounded-lg text-sm">
              {error || authError}
            </div>
          )}

          {viewMode === 'forgotPassword' ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
              <div>
                <label htmlFor="forgotPasswordEmail" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgotPasswordEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  ← Back to login
                </button>
              </div>
            </form>
          ) : viewMode === 'resetCode' ? (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
              <div>
                <label htmlFor="resetCode" className="block text-sm font-medium text-neutral-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="resetCode"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Enter 6-digit code"
                />
              </div>

              <div>
                <label htmlFor="resetNewPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="resetNewPassword"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="resetConfirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="resetConfirmPassword"
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 text-xs text-neutral-600">
                <p className="font-medium text-neutral-700 mb-2">Password Requirements:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <span className={resetNewPassword.length >= 8 ? 'text-green-600' : 'text-neutral-400'}>
                      {resetNewPassword.length >= 8 ? '✓' : '○'}
                    </span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/(?=.*[a-z])/.test(resetNewPassword) ? 'text-green-600' : 'text-neutral-400'}>
                      {/(?=.*[a-z])/.test(resetNewPassword) ? '✓' : '○'}
                    </span>
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/(?=.*[A-Z])/.test(resetNewPassword) ? 'text-green-600' : 'text-neutral-400'}>
                      {/(?=.*[A-Z])/.test(resetNewPassword) ? '✓' : '○'}
                    </span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/(?=.*\d)/.test(resetNewPassword) ? 'text-green-600' : 'text-neutral-400'}>
                      {/(?=.*\d)/.test(resetNewPassword) ? '✓' : '○'}
                    </span>
                    One number
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/(?=.*[!@#$%^&*])/.test(resetNewPassword) ? 'text-green-600' : 'text-neutral-400'}>
                      {/(?=.*[!@#$%^&*])/.test(resetNewPassword) ? '✓' : '○'}
                    </span>
                    One special character (!@#$%^&*)
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  ← Back to login
                </button>
              </div>
            </form>
          ) : !needsNewPassword ? (
            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPasswordClick}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          ) : (
            <form onSubmit={handleNewPasswordSubmit} className="space-y-5">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                  New Password <span className="text-secondary-600">*</span>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm New Password <span className="text-secondary-600">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 text-xs text-neutral-600">
                <p className="font-medium text-neutral-700 mb-2">Password Requirements:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <span className={newPassword.length >= 8 ? 'text-green-600' : 'text-neutral-400'}>
                      {newPassword.length >= 8 ? '✓' : '○'}
                    </span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/(?=.*[a-z])/.test(newPassword) ? 'text-green-600' : 'text-neutral-400'}>
                      {/(?=.*[a-z])/.test(newPassword) ? '✓' : '○'}
                    </span>
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/(?=.*[A-Z])/.test(newPassword) ? 'text-green-600' : 'text-neutral-400'}>
                      {/(?=.*[A-Z])/.test(newPassword) ? '✓' : '○'}
                    </span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/(?=.*\d)/.test(newPassword) ? 'text-green-600' : 'text-neutral-400'}>
                      {/(?=.*\d)/.test(newPassword) ? '✓' : '○'}
                    </span>
                    One number
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={/(?=.*[!@#$%^&*])/.test(newPassword) ? 'text-green-600' : 'text-neutral-400'}>
                      {/(?=.*[!@#$%^&*])/.test(newPassword) ? '✓' : '○'}
                    </span>
                    One special character (!@#$%^&*)
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting Password...' : 'Set New Password'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-neutral-600">
            <p className="text-neutral-500">
              Contact your administrator for access
            </p>
          </div>
          </div>

          {/* Footer - Mobile Only */}
          <div className="lg:hidden text-center mt-8 text-neutral-500 text-sm">
            © 2025 Property Rental Manager. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
