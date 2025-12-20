'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ConfirmationPopup from './ConfirmationPopup';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login/Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const signInWithProvider = async (provider: 'google' | 'discord') => {
    setErrorMsg(null);
    setLoading(true);

    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/browse`,
            },
        });

        if (error) throw error;
        // No onClose here because OAuth redirects it away
    } catch (err: any) {
        setErrorMsg(err?.message ?? 'OAuth sign-in failed.');
        setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            onClose();
            return;
        }

        // Sign Up
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username.trim(),
                },
            },
        });

        if (error) throw error;

        setConfirmationEmail(email);
        setShowConfirmation(true);

        // Clear form and close modal
        setEmail('');
        setPassword('');
        setUsername('');
        onClose();

    } catch (err: any) {
        setErrorMsg(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {isLogin ? 'Welcome Back' : 'Join Kudosey'}
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {/* Toggle Login/Signup */}
        <div className="mb-6 flex rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
          type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-full py-2 text-center font-medium transition-all ${
              isLogin 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Login
          </button>
          <button
          type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-full py-2 text-center font-medium transition-all ${
              !isLogin 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                {errorMsg}
                </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-full border border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="Choose a username"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="••••••••"
              required
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>
          <span className="mx-4 text-sm text-zinc-500">Or continue with</span>
          <div className="flex-1 border-t border-zinc-300 dark:border-zinc-700"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => signInWithProvider('google')}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-zinc-300 bg-white py-3 transition-all
            hover:border-purple-400 hover:bg-purple-50 hover:shadow-sm hover:scale-[1.01] dark:border-zinc-700 dark:bg-zinc-800
            dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
            >
            <span className="text-2xl">G</span>
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => signInWithProvider('discord')}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-zinc-300 bg-white py-3 transition-all
            hover:border-purple-400 hover:bg-purple-50 hover:shadow-sm hover:scale-[1.01] dark:border-zinc-700 dark:bg-zinc-800
            dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
          >
            <span className="text-2xl">🎮</span>
            <span>Continue with Discord</span>
          </button>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-zinc-500">
          By continuing, you agree to our{' '}
          <a href="#" className="text-purple-600 hover:underline">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="text-purple-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}