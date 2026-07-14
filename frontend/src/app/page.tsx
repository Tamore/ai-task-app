import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-main)]">
      <div className="z-10 text-center space-y-8 p-8 max-w-3xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-md">
            <Sparkles className="w-12 h-12 text-[var(--color-primary)]" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-serif text-[var(--color-text-main)]">
          AI Task Platform
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed font-medium">
          The next generation of asynchronous task processing. Execute complex AI operations instantly with robust background workers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/login" className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-white transition-all duration-300 bg-[var(--color-primary)] rounded-xl hover:bg-[#a65421] shadow-[0_4px_14px_0_rgba(194,101,42,0.39)] hover:shadow-[0_6px_20px_rgba(194,101,42,0.23)] active:scale-95">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 font-medium transition-all duration-300 bg-transparent border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-xl hover:bg-[var(--color-secondary)] hover:text-white active:scale-95">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
