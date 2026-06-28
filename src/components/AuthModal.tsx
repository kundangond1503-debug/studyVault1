import React, { useState } from 'react';
import { X, GraduationCap, Shield, User, Award, CheckCircle, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [role, setRole] = useState<'learner' | 'contributor'>('learner');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginName, setLoginName] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regBranch, setRegBranch] = useState('CSE');
  const [regSemester, setRegSemester] = useState('5');
  const [regBio, setRegBio] = useState('');
  const [regSkills, setRegSkills] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Founder Quick Login helpers
  const founders = [
    { name: 'Neeraj Sonkar', role: 'Platinum Mentor', score: 450 },
    { name: 'Kundan Kumar Gond', role: 'Gold Mentor', score: 320 },
    { name: 'Nikhil Kumar', role: 'Silver Mentor', score: 210 },
    { name: 'Siddhant gautam', role: 'Silver Mentor', score: 190 },
  ];

  const handleQuickLogin = async (name: string) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role: 'contributor' })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Login failed');
      }

      const session = await res.json();
      setSuccessMsg(`Welcome back, Mentor ${session.name}!`);
      setTimeout(() => {
        onLoginSuccess(session);
        onClose();
        setIsLoading(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) {
      setError('Please enter your name.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: loginName.trim(), role })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Login failed');
      }

      const session = await res.json();
      setSuccessMsg(`Access Granted: Welcome, ${session.name}!`);
      setTimeout(() => {
        onLoginSuccess(session);
        onClose();
        setIsLoading(false);
        setSuccessMsg('');
        setLoginName('');
      }, 1500);
    } catch (err: any) {
      if (role === 'contributor') {
        setError('No contributor profile matches this name. Try registering as a contributor first!');
      } else {
        setError(err.message || 'Login failed.');
      }
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regBio.trim()) {
      setError('Please fill in your name and a brief bio.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const skillsArr = regSkills
        ? regSkills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          branch: regBranch,
          semester: regSemester,
          bio: regBio.trim(),
          skills: skillsArr
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }

      const session = await res.json();
      setSuccessMsg(`Portfolio Created! Welcome to the Mentor Registry, ${session.name}!`);
      setTimeout(() => {
        onLoginSuccess(session);
        onClose();
        setIsLoading(false);
        setSuccessMsg('');
        // Reset form
        setRegName('');
        setRegBio('');
        setRegSkills('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-xl text-slate-100">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-100 font-sans tracking-tight">Access StudyVault</h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">MMMUT Digital Network Gateway</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Role Picker (Learner vs Contributor) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setRole('learner');
                setError('');
              }}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'learner'
                  ? 'bg-blue-600 text-slate-100 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              Learner Path
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('contributor');
                setError('');
              }}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'contributor'
                  ? 'bg-blue-600 text-slate-100 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              Contributor Path
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl text-xs flex gap-2.5 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs flex gap-2.5 items-start">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LEARNER TRACK (Ultra simple, instant access) */}
          {role === 'learner' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 text-xs text-blue-300 space-y-1.5">
                <span className="font-bold block uppercase tracking-wider text-[10px] text-blue-400">Learner Account Privileges:</span>
                <p className="leading-relaxed">
                  Grants standard download, search, and reading permissions for all syllabus resources. You can view, comment, and upvote materials, but you cannot publish custom notes.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-400 uppercase">Your Display Name</label>
                <input
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Enter your name (e.g. Priyanshu Singh)"
                  required
                  disabled={isLoading}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-100 font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-800 disabled:text-slate-500"
              >
                {isLoading ? 'Verifying Gateway...' : 'Access Vault as Learner'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* CONTRIBUTOR TRACK */}
          {role === 'contributor' && (
            <div className="space-y-6">
              {/* Tab Selector for Contributor: Log In or Register */}
              <div className="flex border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-400'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setError('');
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-400'
                  }`}
                >
                  Register Profile
                </button>
              </div>

              {activeTab === 'login' ? (
                /* Contributor Login Form */
                <div className="space-y-5">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-400 uppercase">Registered Contributor Name</label>
                      <input
                        type="text"
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        placeholder="Enter your exact registered name"
                        required
                        disabled={isLoading}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-100 font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isLoading ? 'Searching Registry...' : 'Sign In as Contributor'}
                    </button>
                  </form>

                  {/* Founder Quick-Login Track */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Developer & Founder Quick Login:</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Click any registered founder profile to instantly assume their pre-configured Platinum or Gold mentor status:
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1.5">
                      {founders.map((f, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleQuickLogin(f.name)}
                          disabled={isLoading}
                          className="p-2.5 text-left rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <span className="text-xs font-extrabold text-slate-200 group-hover:text-blue-400 transition-colors">{f.name}</span>
                          <span className="text-[9px] text-slate-500 mt-0.5">{f.role} ({f.score} RP)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Contributor Registration Form */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">Your Full Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Abhishek Chaudhary"
                      required
                      disabled={isLoading}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-400 uppercase">Academic Branch</label>
                      <select
                        value={regBranch}
                        onChange={(e) => setRegBranch(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="CSE">Computer Science (CSE)</option>
                        <option value="IT">Information Tech (IT)</option>
                        <option value="ECE">Electronics (ECE)</option>
                        <option value="EE">Electrical (EE)</option>
                        <option value="ME">Mechanical (ME)</option>
                        <option value="CE">Civil Eng (CE)</option>
                        <option value="CHE">Chemical (CHE)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-slate-400 uppercase">Current Semester</label>
                      <select
                        value={regSemester}
                        onChange={(e) => setRegSemester(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                          <option key={s} value={s.toString()}>Semester {s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">Public Professional Bio</label>
                    <textarea
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      placeholder="e.g. Pre-final year CSE student at MMMUT. Focused on database modeling, sessional exam hacks, and data structures."
                      required
                      rows={2}
                      disabled={isLoading}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs rounded-xl focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">Skills & Expertises <span className="text-[10px] text-slate-500 font-normal">(comma-separated)</span></label>
                    <input
                      type="text"
                      value={regSkills}
                      onChange={(e) => setRegSkills(e.target.value)}
                      placeholder="e.g. C++, SQL, Discrete Maths, DSA"
                      disabled={isLoading}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-100 font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isLoading ? 'Registering...' : 'Create Portfolio & Enroll'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
