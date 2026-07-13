import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email address is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(true)
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true
    }
  });

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Signed in with Google successfully.');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      let errorMsg = 'Google authentication failed.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Sign in popup closed before finishing.';
      }
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Set persistence based on "Remember Me" checkbox
      const persistence = data.rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      
      // Perform email/password sign-in
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('Welcome back! Login successful.');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      let errorMsg = 'Invalid email or password.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect email or password combination.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Account temporarily locked due to too many failed attempts. Try again later.';
      }
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email address.');
      return;
    }
    setForgotSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      toast.success('Password reset email sent! Check your inbox.');
      setForgotMode(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to dispatch reset email.');
    } finally {
      setForgotSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans antialiased transition-colors duration-200">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-glass dark:shadow-glass-dark border border-slate-200 dark:border-slate-800">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-emerald-600 dark:bg-emerald-500 rounded-2xl text-white shadow-md mb-3 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">EMS Admin Access</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to manage employee directory</p>
        </div>

        {!forgotMode ? (
          /* Normal Sign In form */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="form-login">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  placeholder="admin@company.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    errors.email ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''
                  }`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-450 dark:hover:text-emerald-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    errors.password ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-655"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 mt-1 text-xs text-rose-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-850 text-emerald-600 focus:ring-emerald-500"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-500 dark:text-slate-400 select-none">
                Remember my login session
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-505 dark:hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Verifying credentials...' : 'Sign In'}
            </button>

            {/* Separator */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-400 dark:text-slate-500 select-none">
                OR
              </span>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M21.35 11.1H12v2.7h5.38c-.24 1.28-.96 2.37-2.04 3.1v2.6h3.28c1.92-1.78 3.03-4.4 3.03-7.4 0-.37-.11-.76-.3-1z" fill="#4285F4" />
                  <path d="M12 20.6c2.43 0 4.47-.8 5.96-2.2l-3.28-2.6c-.9.6-2.07.98-3.28.98-2.34 0-4.33-1.58-5.03-3.7H2.98v2.7c1.48 2.79 5.03 4.66 9.02 4.66z" fill="#34A853" />
                  <path d="M6.97 13.08a5.13 5.13 0 0 1 0-3.16V7.22H2.98a8.6 8.6 0 0 0 0 8.56l3.99-2.7z" fill="#FBBC05" />
                  <path d="M12 6.4c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.64 14.43 3 12 3 8.01 3 4.46 4.87 2.98 7.22l3.99 2.7C7.67 7.98 9.66 6.4 12 6.4z" fill="#EA4335" />
                </g>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        ) : (
          /* Forgot Password sub-view */
          <form onSubmit={handleForgotPassword} className="space-y-5" id="form-forgot-password">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Confirm your account email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForgotMode(false)}
                disabled={forgotSubmitting}
                className="w-1/2 py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-sm font-semibold transition-colors"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={forgotSubmitting}
                className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {forgotSubmitting ? 'Sending...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        {/* Footnote Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Need an administrator portal account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-450 dark:hover:text-emerald-400 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
