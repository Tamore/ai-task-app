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
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[var(--color-bg-base)] text-[var(--color-text-main)] p-4">
      <div className="w-full max-w-md bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-10 z-10 relative animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 mb-6 border border-[var(--color-primary)]/20 shadow-sm">
            <LogIn className="w-7 h-7 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--color-text-main)] mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-[var(--color-text-muted)] font-medium">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] placeholder-[var(--color-text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all font-medium"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] placeholder-[var(--color-text-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all font-medium"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 flex items-center justify-center rounded-xl font-medium text-white bg-[var(--color-primary)] hover:bg-[#a65421] transition-all shadow-[0_4px_14px_0_rgba(194,101,42,0.39)] hover:shadow-[0_6px_20px_rgba(194,101,42,0.23)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-[var(--color-text-muted)] text-sm font-medium">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[var(--color-primary)] hover:text-[#a65421] font-bold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
