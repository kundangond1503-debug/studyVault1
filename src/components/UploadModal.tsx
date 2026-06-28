import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Check, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { UserSession } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  currentUser: UserSession | null;
  onOpenAuth: () => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess, currentUser, onOpenAuth }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [semester, setSemester] = useState('5');
  const [materialType, setMaterialType] = useState<'notes' | 'past_papers' | 'lab_manuals' | 'syllabus' | 'other'>('notes');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [premium, setPremium] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Synchronize state with current user session
  useEffect(() => {
    if (currentUser && currentUser.role === 'contributor') {
      setUploaderName(currentUser.name);
      if (currentUser.branch) setBranch(currentUser.branch);
      if (currentUser.semester) setSemester(currentUser.semester.toString());
    } else {
      setUploaderName('');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure we have a valid contributor uploader name and ID
    const activeUploaderName = currentUser?.role === 'contributor' ? currentUser.name : uploaderName;
    const activeUploaderId = currentUser?.role === 'contributor' ? currentUser.id : 'user_anonymous';

    if (!title || !courseName || !content || !activeUploaderName) {
      setError('Please fill out all required fields (Title, Course Name, and Content).');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: `Comprehensive study guide for ${topic || 'general topics'} in ${courseName}.`,
          courseName,
          courseCode,
          branch,
          semester: parseInt(semester, 10),
          materialType,
          topic: topic || 'General',
          content,
          uploaderName: activeUploaderName,
          uploaderId: activeUploaderId,
          premium
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload material');
      }

      setShowSuccess(true);
      setTimeout(() => {
        setIsUploading(false);
        setShowSuccess(false);
        onUploadSuccess();
        onClose();
        // Reset form
        setTitle('');
        setCourseName('');
        setCourseCode('');
        setTopic('');
        setContent('');
        setPremium(false);
      }, 2000);
    } catch (err: any) {
      setIsUploading(false);
      setError(err.message || 'Something went wrong during upload.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Contribute to the Vault</h2>
              <p className="text-xs text-slate-400">Share verified, high-quality materials to earn reputation badges</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-slate-900">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30 animate-pulse">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-400">Upload Successful!</h3>
            <p className="text-slate-300 mt-2 max-w-sm">
              Your resource has been logged into the secure study vault. Your peer reputation is growing!
            </p>
            <p className="text-xs text-slate-500 mt-6 font-mono">Status: WAITING_ADMIN_VERIFICATION</p>
          </div>
        ) : !currentUser ? (
          /* NOT LOGGED IN WARNING STATE */
          <div className="p-8 text-center space-y-5 bg-slate-900">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-200">Contributor Session Required</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                You must sign in with a verified student session to publish materials, build your reputation score, and unlock portfolio badges.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-100 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10 font-sans"
              >
                Sign In / Register
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-850/80 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-slate-800 font-sans"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : currentUser.role === 'learner' ? (
          /* LEARNER WARNING STATE */
          <div className="p-8 text-center space-y-5 bg-slate-900">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-200">Contributor Track Required</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your current session is active as a **Learner** (Read-Only). Register a dynamic contributor portfolio to upload resources, earn reputation points, and claim your mentor badge!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-xs mx-auto font-sans">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-100 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
              >
                Enroll as Contributor
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-850/80 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-slate-800"
              >
                Maybe Later
              </button>
            </div>
          </div>
        ) : (
          /* FULL LOGGED IN CONTRIBUTOR UPLOAD FORM */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
            {error && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-400 text-xs rounded-lg">
                {error}
              </div>
            )}

            {/* Verified Uploader Badge Header */}
            <div className="p-3.5 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-black text-slate-100 text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <span className="block text-[10px] text-blue-400 font-mono font-bold uppercase tracking-wider">Verified Publisher Identity</span>
                  <p className="text-xs font-bold text-slate-200">{currentUser.name}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[9px] text-slate-500 font-mono">{currentUser.branch} Branch • Sem {currentUser.semester}</span>
                <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-mono text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  {currentUser.badge || 'Bronze'} Mentor ({currentUser.reputationScore || 10} RP)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 font-mono uppercase tracking-wider">Material Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Normalization solved examples"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Database Management Systems"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Course Code (Optional)</label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. BCS-21"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Target Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. B-Trees & Hash Indexing"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Engineering Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="CSE">Computer Science & Eng (CSE)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="ECE">Electronics & Comm (ECE)</option>
                  <option value="ME">Mechanical Eng (ME)</option>
                  <option value="EE">Electrical Eng (EE)</option>
                  <option value="CE">Civil Eng (CE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="notes">Lecture Notes</option>
                  <option value="past_papers">End-Sem Solved Paper</option>
                  <option value="lab_manuals">Lab Workbook</option>
                  <option value="syllabus">Syllabus Copy</option>
                  <option value="other">Other Reference</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="premiumCheck"
                checked={premium}
                onChange={(e) => setPremium(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 text-blue-500 bg-slate-950 focus:ring-blue-500"
              />
              <label htmlFor="premiumCheck" className="text-xs text-slate-300 font-medium select-none cursor-pointer">
                Publish as Premium Track Resource (requires premium access pass simulation)
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Syllabus-Aligned Text Content (Markdown Supported) *</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder={`Provide detailed explanations, solved sessional or end-sem problems, code snippets or equations...\n\n# Quick Heading\n- Bullet points explaining key definitions\n- Formulas: E = mc^2`}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors resize-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 bg-slate-900 -mx-6 -mb-6 p-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-slate-100 text-sm font-medium rounded-lg shadow-lg hover:shadow-blue-500/20 disabled:bg-blue-800 disabled:text-slate-400 transition-all"
              >
                {isUploading ? 'Securing Content...' : 'Verify & Upload'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
