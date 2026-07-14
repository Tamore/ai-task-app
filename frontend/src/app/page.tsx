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
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-serif text-[var(--color-tertiary)]">
          AI Task Platform
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
          The next generation of asynchronous task processing. Execute complex AI operations instantly with robust background workers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/login" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-[var(--color-primary)] rounded-xl hover:opacity-90 shadow-md">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 font-bold transition-all duration-200 bg-transparent border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-xl hover:bg-[var(--color-secondary)] hover:text-white">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
