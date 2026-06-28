import React, { useEffect, useState } from 'react';
import { Award, ShieldCheck, ThumbsUp, FileText, User, Sparkles } from 'lucide-react';
import { UserPortfolio } from '../types';

export default function PortfoliosView() {
  const [portfolios, setPortfolios] = useState<UserPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const response = await fetch('/api/portfolios');
        const data = await response.json();
        setPortfolios(data);
      } catch (err) {
        console.error('Failed to fetch portfolios:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPortfolios();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header (Slide 4 - Profile Building) */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-semibold text-blue-400 uppercase">
          Ecosystem Shift: Verified Peer Growth
        </div>
        <h2 className="text-3xl font-black text-slate-100 font-sans tracking-tight">Verified Academic Portfolios</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Transforming file sharing into recognized academic identity. Earn peer reputation (RP) through verified content contribution.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-56 rounded-2xl border border-slate-800 bg-slate-900/40 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolios.map((port) => {
            // Compute badge colors
            let badgeBg = 'bg-slate-800 border-slate-700 text-slate-300';
            let badgeShadow = '';
            if (port.badge === 'Platinum') {
              badgeBg = 'bg-slate-300/10 border-slate-300/30 text-slate-100';
              badgeShadow = 'shadow-slate-300/5';
            } else if (port.badge === 'Gold') {
              badgeBg = 'bg-amber-500/10 border-amber-500/25 text-amber-400';
              badgeShadow = 'shadow-amber-500/5';
            } else if (port.badge === 'Silver') {
              badgeBg = 'bg-slate-400/10 border-slate-400/20 text-slate-300';
              badgeShadow = 'shadow-slate-400/5';
            } else if (port.badge === 'Bronze') {
              badgeBg = 'bg-amber-800/10 border-amber-800/20 text-amber-700';
            }

            return (
              <div 
                key={port.id} 
                className={`p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50 transition-all flex flex-col justify-between shadow-lg ${badgeShadow}`}
              >
                <div className="space-y-4">
                  
                  {/* Top Header Card */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-slate-100 flex items-center justify-center font-bold text-lg border border-blue-500/20 shadow-md">
                        {port.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-200 text-base flex items-center gap-1.5">
                          {port.name}
                          {port.reputationScore >= 300 && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">{port.branch} Branch • Semester {port.semester}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${badgeBg}`}>
                      {port.badge} Mentor
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{port.bio}</p>

                  {/* Skills Grid */}
                  <div className="flex flex-wrap gap-1.5">
                    {port.skills && port.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-900 text-[10px] text-slate-400 font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score Summary Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-800/80 text-center">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Reputation Score</span>
                    <span className="text-base font-extrabold text-blue-400 font-mono">{port.reputationScore} <span className="text-[10px] text-slate-500 font-normal">RP</span></span>
                  </div>
                  
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Files Uploaded</span>
                    <span className="text-base font-extrabold text-slate-300 font-mono flex items-center justify-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      {port.resourcesUploadedCount}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Total Upvotes</span>
                    <span className="text-base font-extrabold text-slate-300 font-mono flex items-center justify-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
                      {port.totalUpvotesReceived}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
