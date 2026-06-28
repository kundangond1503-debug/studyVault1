import React, { useEffect, useState } from 'react';
import { Users, Award, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';
import { TeamMember } from '../types';

export default function TeamView() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await fetch('/api/team');
        const data = await response.json();
        setTeam(data);
      } catch (err) {
        console.error('Failed to load team data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeam();
  }, []);

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-semibold text-blue-400 uppercase">
          Meet Our Founders
        </div>
        <h2 className="text-3xl font-black text-slate-100 font-sans tracking-tight">The StudyVault Team</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The innovative developers, db architects, and syllabus experts who designed and engineered the platform.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-72 rounded-2xl border border-slate-800 bg-slate-900/30 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50 transition-all flex flex-col justify-between group overflow-hidden relative"
            >
              {/* Background Accent glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>

              <div className="space-y-4">
                {/* Visual Avatar */}
                <div className="relative">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-800 group-hover:border-blue-500/30 transition-all shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-blue-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-200 text-sm tracking-tight group-hover:text-blue-400 transition-colors">
                    {member.name}
                  </h3>
                  <span className="block text-[10px] font-mono text-blue-500 uppercase font-bold">
                    {member.role}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-500">
                    Roll/ID: {member.studentId}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                {member.branch}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspirational Bottom Slide 12 Lockup Quote */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/40 text-center max-w-2xl mx-auto">
        <p className="text-xs font-mono text-slate-500">STUDYVAULT ACADEMIC MISSION STATEMENT</p>
        <h4 className="text-slate-300 font-bold font-sans italic text-base mt-2">
          "Closing the distance between shared learning material and career advancement."
        </h4>
      </div>
    </div>
  );
}
