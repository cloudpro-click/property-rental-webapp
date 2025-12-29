import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { signUp, confirmSignUp, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        name: formData.name,
      });

      if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        setNeedsConfirmation(true);
        setError('Please check your email for the verification code');
      } else if (result.isSignUpComplete) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await confirmSignUp(formData.email, confirmationCode);

      if (result.isSignUpComplete) {
        // Auto sign in after confirmation
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Failed to confirm sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 text-accent-500">
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

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500 rounded-2xl mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Property Rental Manager
          </h1>
          <p className="text-primary-200">
            Create your account to get started
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
            Create Account
          </h2>

          {(error || authError) && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              needsConfirmation
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'bg-secondary-50 border border-secondary-200 text-secondary-700'
            }`}>
              {error || authError}
            </div>
          )}

          {needsConfirmation ? (
            <form onSubmit={handleConfirmSignUp} className="space-y-5">
              <div>
                <label htmlFor="confirmationCode" className="block text-sm font-medium text-neutral-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="confirmationCode"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Enter 6-digit code"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  We sent a verification code to {formData.email}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Juan Dela Cruz"
              />
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          )}

          <div className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>

        <div className="text-center mt-6 text-primary-200 text-sm">
          © 2025 Property Rental Manager. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Register;
