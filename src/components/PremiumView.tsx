import React from 'react';
import { Lock, Check, Sparkles, Building, Coins, ShieldCheck } from 'lucide-react';

interface PremiumProps {
  isPremiumUnlocked: boolean;
  onTogglePremium: (status: boolean) => void;
}

export default function PremiumView({ isPremiumUnlocked, onTogglePremium }: PremiumProps) {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header (Slide 7) */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-semibold text-amber-400 uppercase">
          Monetization & Scalability
        </div>
        <h2 className="text-3xl font-black text-slate-100 font-sans tracking-tight">Three-Tier Business Model</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          From free core search tools to comprehensive engineering exam packs and enterprise institutional portals.
        </p>
      </div>

      {/* Simulator Control Card */}
      <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 p-1 px-3 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive State Simulator
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-200">Simulate Premium Student Access Pass</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            Locked premium study packs (like the 5th Sem CSE comprehensive bundle) require an active premium membership. Use this switch to simulate membership status.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onTogglePremium(!isPremiumUnlocked)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
              isPremiumUnlocked 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-100 shadow-emerald-500/10' 
                : 'bg-blue-600 hover:bg-blue-500 text-slate-100 shadow-blue-500/10'
            }`}
          >
            {isPremiumUnlocked ? '✓ Premium Pass Activated (Click to Deactivate)' : 'Unlock Premium Access Sim'}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono">
          <div className={`w-2 h-2 rounded-full ${isPremiumUnlocked ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
          <span className="text-slate-400 uppercase">
            Simulator Status: {isPremiumUnlocked ? 'MEMBER_PREMIUM_ACTIVE' : 'FREE_BASIC_LICENSE'}
          </span>
        </div>
      </div>

      {/* The Three Tiers (Freemium Core, Premium Tracks, Institutional Packages) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Tier 1: Freemium Core */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Tier 1</h4>
                <h3 className="text-xl font-extrabold text-slate-200 mt-1">Freemium Core</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">Free</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides free, unified access to basic course files, sessional uploads, and peer validation loops. Establishes the initial network effect.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Browse syllabus categories
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Download standard notes
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Peer validation & voting
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800/60 text-center">
            <span className="text-xs text-slate-500 font-mono uppercase">Standard Student Model</span>
          </div>
        </div>

        {/* Tier 2: Premium Track Collections */}
        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col justify-between relative">
          <div className="absolute top-0 right-6 -translate-y-1/2 px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-mono font-bold uppercase tracking-wider shadow">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">Tier 2</h4>
                <h3 className="text-xl font-extrabold text-slate-100 mt-1">Premium Tracks</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-[10px] font-mono font-bold text-amber-400">Paid Bundle</span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlock curated comprehensive study packs, verified sessional guides, solved past end-sem papers, and high-quality exam-targeted notes bundles.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Access Solved End-Sem papers
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Unlock 5th Sem CSE Bundle
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Double reputation for uploads
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800/60 text-center">
            <span className="text-xs text-amber-400 font-mono uppercase font-bold">Included in active pass</span>
          </div>
        </div>

        {/* Tier 3: Institutional Packages */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Tier 3</h4>
                <h3 className="text-xl font-extrabold text-slate-200 mt-1">Institutional B2B</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-[10px] font-mono font-bold text-indigo-400">Enterprise</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Future campus-wide integration model allowing universities to deploy customized portals, brand repositories, and leverage analytics dashboards.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                University-branded instances
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                LMS synchronization integrations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                Academic analytics console
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800/60 text-center">
            <span className="text-xs text-slate-500 font-mono uppercase">Campus Infrastructure Model</span>
          </div>
        </div>

      </div>
    </div>
  );
}
