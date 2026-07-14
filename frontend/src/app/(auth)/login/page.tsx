"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', { username, password });
      Cookies.set('token', res.data.token, { expires: 30 });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[var(--color-bg-base)] text-[var(--color-text-main)] p-4">
      <div className="w-full max-w-md bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-xl rounded-2xl p-8 z-10 relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)]/10 mb-4 border border-[var(--color-primary)]/20">
            <LogIn className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-3xl font-bold font-serif text-[var(--color-tertiary)] mb-2">Welcome Back</h2>
          <p className="text-[var(--color-text-muted)]">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 flex items-center justify-center rounded-xl font-semibold text-white bg-[var(--color-primary)] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-[var(--color-text-muted)] text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-[var(--color-tertiary)] hover:underline font-bold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
