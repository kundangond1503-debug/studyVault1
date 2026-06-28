import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  Lock, 
  MessageSquare, 
  Users, 
  UploadCloud, 
  GraduationCap, 
  HelpCircle,
  User
} from 'lucide-react';
import DashboardView from './components/DashboardView';
import ExploreView from './components/ExploreView';
import PortfoliosView from './components/PortfoliosView';
import PremiumView from './components/PremiumView';
import AIChatView from './components/AIChatView';
import TeamView from './components/TeamView';
import UploadModal from './components/UploadModal';
import AuthModal from './components/AuthModal';
import { UserSession } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [exploreRefreshKey, setExploreRefreshKey] = useState(0);
  const [portfolioRefreshKey, setPortfolioRefreshKey] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem('studyvault_user_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (session: UserSession) => {
    localStorage.setItem('studyvault_user_session', JSON.stringify(session));
    setCurrentUser(session);
    // Trigger refreshing of lists
    setExploreRefreshKey(prev => prev + 1);
    setPortfolioRefreshKey(prev => prev + 1);
  };

  const handleUploadSuccess = () => {
    // Increment refresh key to trigger re-fetch of resources in ExploreView and Portfolios
    setExploreRefreshKey(prev => prev + 1);
    setPortfolioRefreshKey(prev => prev + 1);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView 
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        );
      case 'explore':
        return (
          <div key={exploreRefreshKey} className="w-full">
            <ExploreView 
              onOpenUpload={() => setIsUploadOpen(true)}
              isPremiumUnlocked={isPremiumUnlocked}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          </div>
        );
      case 'portfolios':
        return <PortfoliosView key={portfolioRefreshKey} />;
      case 'premium':
        return (
          <PremiumView 
            isPremiumUnlocked={isPremiumUnlocked}
            onTogglePremium={(status) => setIsPremiumUnlocked(status)}
          />
        );
      case 'chat':
        return <AIChatView />;
      case 'team':
        return <TeamView />;
      default:
        return <DashboardView onNavigateToTab={setCurrentTab} onOpenUpload={() => setIsUploadOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div 
          onClick={() => setCurrentTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2.5 bg-blue-600 rounded-xl text-slate-100 shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-all">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-100 font-sans tracking-tight leading-none">StudyVault</h1>
            <span className="text-[9px] text-blue-400 font-mono tracking-widest uppercase mt-0.5 block">Academic Safe</span>
          </div>
        </div>

        {/* Desktop Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/60 border border-slate-900 rounded-xl">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'dashboard' 
                ? 'bg-blue-600 text-slate-100 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          
          <button
            onClick={() => setCurrentTab('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'explore' 
                ? 'bg-blue-600 text-slate-100 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Explore Syllabus
          </button>

          <button
            onClick={() => setCurrentTab('portfolios')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'portfolios' 
                ? 'bg-blue-600 text-slate-100 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Portfolios
          </button>

          <button
            onClick={() => setCurrentTab('premium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'premium' 
                ? 'bg-blue-600 text-slate-100 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Premium Track
          </button>

          <button
            onClick={() => setCurrentTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'chat' 
                ? 'bg-blue-600 text-slate-100 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            AI Mentor
          </button>

          <button
            onClick={() => setCurrentTab('team')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'team' 
                ? 'bg-blue-600 text-slate-100 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Team
          </button>
        </nav>

        {/* Global Action buttons */}
        <div className="flex items-center gap-3.5">
          {isPremiumUnlocked && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/25 rounded-lg text-[10px] font-mono font-bold text-amber-400">
              <Sparkles className="w-3 h-3" />
              PREMIUM
            </span>
          )}

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
            Publish Notes
          </button>

          {/* User Auth widget */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 px-2.5 h-9">
              <div className={`w-6 h-6 rounded-lg text-xs font-black text-slate-100 flex items-center justify-center ${
                currentUser.role === 'contributor' ? 'bg-blue-600 shadow shadow-blue-500/20' : 'bg-slate-800'
              }`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-[11px] font-bold text-slate-200 leading-none truncate max-w-[90px]" title={currentUser.name}>
                  {currentUser.name}
                </p>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tight block mt-0.5">
                  {currentUser.role === 'contributor' ? `${currentUser.badge || 'Bronze'} Mentor` : 'Learner'}
                </span>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('studyvault_user_session');
                  setCurrentUser(null);
                  setPortfolioRefreshKey(prev => prev + 1);
                }}
                className="text-[10px] font-mono font-bold text-red-400 hover:text-red-300 transition-colors ml-1.5 cursor-pointer"
                title="Sign Out"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-slate-100 font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5 font-sans"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Mobile Navigation bar (Sub-dock) */}
      <div className="md:hidden sticky top-14 z-30 bg-slate-950/90 border-b border-slate-900 px-3 py-2 flex overflow-x-auto gap-1 scrollbar-none scroll-smooth">
        {[
          { id: 'dashboard', label: 'Hub' },
          { id: 'explore', label: 'Explore Syllabus' },
          { id: 'portfolios', label: 'Portfolios' },
          { id: 'premium', label: 'Premium Track' },
          { id: 'chat', label: 'AI Mentor' },
          { id: 'team', label: 'Team' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              currentTab === tab.id 
                ? 'bg-blue-600 text-slate-100' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        {renderContent()}
      </main>

      {/* 3. Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-slate-500 text-xs">
        <p>© 2026 StudyVault. Madan Mohan Malaviya University of Technology (MMMUT) Network Pilot.</p>
        <p className="text-[10px] font-mono mt-1 text-slate-600">
          Designed by Neeraj Sonkar, Kundan Kumar Gond, Nikhil Kumar, and Siddhant gautam.
        </p>
      </footer>

      {/* 4. Upload Material Modal Drawer */}
      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 5. Unified Sign In / Registration Modal */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
