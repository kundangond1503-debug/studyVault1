import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  Award, 
  FileText, 
  TrendingUp, 
  ThumbsUp, 
  ArrowUpRight, 
  ChevronRight, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from 'recharts';

interface DashboardProps {
  onNavigateToTab: (tab: string) => void;
  onOpenUpload: () => void;
}

export default function DashboardView({ onNavigateToTab, onOpenUpload }: DashboardProps) {
  const [stats, setStats] = useState<any>({
    totalResources: 6,
    verifiedResources: 6,
    premiumResources: 2,
    totalUpvotes: 209,
    totalReputation: 1170,
    simulatedDownloads: 751,
  });
  const [recentResources, setRecentResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const statsRes = await fetch('/api/analytics');
        const statsData = await statsRes.json();
        setStats(statsData);

        const recRes = await fetch('/api/resources?verified=true');
        const recData = await recRes.json();
        setRecentResources(recData.slice(0, 3)); // Top 3
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // Market opportunity data for funnel/bar chart mapping Slide 6
  const marketData = [
    { name: 'TAM (Total)', value: 40000000, label: '40M+', text: 'Higher Education in India', fill: '#3b82f6', percent: '100%' },
    { name: 'SAM (Serviceable)', value: 4000000, label: '4M+', text: 'Technical & Eng Students', fill: '#60a5fa', percent: '10%' },
    { name: 'SOM (Initial SOM)', value: 10000, label: '10K+', text: 'MMMUT Pilot Cohort', fill: '#93c5fd', percent: '0.025%' },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* 1. Hero Presentation Section (Page 1) */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/30 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              Pilot Launch Cohort: MMMUT Network
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight font-sans leading-tight">
                StudyVault: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400">
                  Academic Resource Sharing Platform
                </span>
              </h1>
              <p className="text-base text-slate-300 max-w-lg leading-relaxed">
                Empowering Students Through Unified, Verified Academic Content. Replacing fragmented links and expired folders with a permanent, peer-vetted knowledge safe.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigateToTab('explore')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-slate-100 font-semibold rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer text-sm"
              >
                Explore Syllabus Vault
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenUpload}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl hover:text-slate-100 transition-all flex items-center gap-2 cursor-pointer text-sm"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Notes (+20 Rep)
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* Safe Safe Vault Isometric Simulation (Slide 1 safe mockup) */}
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/35 transition-all"></div>
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl border border-blue-500/30 bg-slate-950 flex flex-col items-center justify-center p-6 shadow-inner animate-pulse-slow">
                {/* Visual Lock Dial */}
                <div className="w-40 h-40 rounded-full border-4 border-blue-400/40 flex items-center justify-center bg-slate-900/60 shadow-lg relative">
                  <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-400/30 animate-spin-slow"></div>
                  <div className="w-24 h-24 rounded-full border-2 border-blue-400/80 flex flex-col items-center justify-center bg-slate-950">
                    <span className="text-3xl font-mono text-blue-400 font-bold">SV</span>
                    <span className="text-[9px] text-blue-400/60 uppercase font-mono tracking-widest mt-1">SECURED</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-xs font-mono text-blue-400/80 tracking-wider">STUDYVAULT.IO v1.0.0</span>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Vault Server Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Platform Statistics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold font-mono tracking-wider">Total Vault Files</p>
            <h3 className="text-2xl font-black text-slate-100">{stats.totalResources}</h3>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold font-mono tracking-wider">Quality Verified</p>
            <h3 className="text-2xl font-black text-slate-100">{stats.verifiedResources}</h3>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold font-mono tracking-wider">Peer Upvotes</p>
            <h3 className="text-2xl font-black text-slate-100">{stats.totalUpvotes}</h3>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold font-mono tracking-wider">Mentors Engaged</p>
            <h3 className="text-2xl font-black text-slate-100">{stats.totalReputation} <span className="text-[10px] text-slate-500 font-normal">RP</span></h3>
          </div>
        </div>
      </div>

      {/* 3. The Core Challenge & Resolution (Slides 2 & 3) */}
      <div className="space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">The Paradigm Shift</h2>
          <p className="text-sm text-slate-400 mt-2">Why scattered drives and WhatsApp chats fail, and how StudyVault preserves academic integrity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1 */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
            <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">Problem 1</h4>
            <h3 className="text-lg font-bold text-slate-200 mt-2">Fragmented Materials</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Academic assets are scattered across anonymous Google Drives, ephemeral WhatsApp links, and Telegram folders. Students waste hours hunting for notes and past papers.
            </p>
            <div className="border-t border-slate-800/60 my-4"></div>
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">StudyVault Resolve</h4>
            <h3 className="text-sm font-bold text-slate-300 mt-1">Unified Structured Vault</h3>
            <p className="text-xs text-slate-400 mt-1">
              A single, central source of truth organized strictly by branch, course, semester, and topic. Simple syllabus mapping.
            </p>
          </div>

          {/* Box 2 */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
            <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">Problem 2</h4>
            <h3 className="text-lg font-bold text-slate-200 mt-2">Zero Quality Control</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Shared files have no verification. Outdated summaries, inaccurate mathematics formulas, and wrong solutions easily mislead students before final exams.
            </p>
            <div className="border-t border-slate-800/60 my-4"></div>
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">StudyVault Resolve</h4>
            <h3 className="text-sm font-bold text-slate-300 mt-1">Peer Validation Engine</h3>
            <p className="text-xs text-slate-400 mt-1">
              Double-checked accuracy through community upvote/downvote scores, open commentary, and verified student indicators.
            </p>
          </div>

          {/* Box 3 */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
            <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">Problem 3</h4>
            <h3 className="text-lg font-bold text-slate-200 mt-2">Data Loss & Decay</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Critical notes vanish overnight when admins delete groups, files are deleted from personal drives, or expiration dates hit. There is zero permanence.
            </p>
            <div className="border-t border-slate-800/60 my-4"></div>
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">StudyVault Resolve</h4>
            <h3 className="text-sm font-bold text-slate-300 mt-1">Permanent Portfolios</h3>
            <p className="text-xs text-slate-400 mt-1">
              Materials are permanently hosted, allowing creators to accumulate lifetime reputation metrics and a beautiful portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Market Opportunity & FUNNEL CHART (Slide 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/60 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono font-semibold text-indigo-400 uppercase">
            Market Opportunity
          </div>
          <h2 className="text-2xl font-black text-slate-100 font-sans tracking-tight">Our Scaling Funnel</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            While higher education represents a colossal market, StudyVault ensures high accuracy by starting with highly targeted, tech-active engineering cohorts first.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-3">
              <div className="font-bold text-blue-400 text-sm font-mono w-12 pt-0.5">TAM</div>
              <div className="text-xs">
                <span className="font-bold text-slate-200">40M+ Higher Ed Students:</span> Massive underserved population in India seeking structured, easily discoverable exam prep.
              </div>
            </div>

            <div className="flex gap-3">
              <div className="font-bold text-blue-400 text-sm font-mono w-12 pt-0.5">SAM</div>
              <div className="text-xs">
                <span className="font-bold text-slate-200">4M+ Engineering Cohort:</span> Digitally active learners with urgent, high-stakes requirements for branch-specific solutions.
              </div>
            </div>

            <div className="flex gap-3">
              <div className="font-bold text-blue-400 text-sm font-mono w-12 pt-0.5">SOM</div>
              <div className="text-xs">
                <span className="font-bold text-slate-200">10,000+ Pilot (MMMUT):</span> Initial network for proving sharing mechanics, feedback loops, and peer upvoting trust scores.
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-center mb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Academic Addressable Funnel (Interactive)</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={marketData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(value: any, name: any, props: any) => [
                      `${value.toLocaleString()} (${props.payload.percent})`, 
                      props.payload.text
                    ]}
                  />
                  <Bar dataKey="value" barSize={24} radius={[0, 8, 8, 0]}>
                    {marketData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around items-center text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-3">
              <div><span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded mr-1"></span> India TAM</div>
              <div><span className="inline-block w-2.5 h-2.5 bg-blue-400 rounded mr-1"></span> Engineering SAM</div>
              <div><span className="inline-block w-2.5 h-2.5 bg-blue-300 rounded mr-1"></span> MMMUT SOM</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Verified Submissions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Top Vetted Submissions</h3>
            <p className="text-xs text-slate-400">High ranking, community approved materials aligned with syllabus rules.</p>
          </div>
          <button 
            onClick={() => onNavigateToTab('explore')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            See all resources
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-44 rounded-xl border border-slate-800 bg-slate-900/40 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentResources.map((res: any) => (
              <div 
                key={res.id} 
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-[10px] font-mono font-semibold text-blue-400 uppercase">
                      {res.courseCode}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {res.fileSize}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mt-2 line-clamp-1">{res.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{res.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <div className="text-slate-400">
                    By <span className="font-semibold text-slate-300">{res.uploadedBy}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-semibold font-mono">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-400" />
                    {res.upvotes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
