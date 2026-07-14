import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0f172a]">
      <div className="z-10 text-center space-y-8 p-8 max-w-3xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
            <Sparkles className="w-12 h-12 text-cyan-400" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
          AI Task Platform
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The next generation of asynchronous task processing. Execute complex AI operations instantly with robust background workers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/login" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-cyan-600 font-pj rounded-xl hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-transparent border-2 border-slate-600 rounded-xl hover:bg-slate-800 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
