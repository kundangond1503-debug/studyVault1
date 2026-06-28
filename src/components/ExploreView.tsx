import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldCheck, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  FileText, 
  DownloadCloud, 
  UploadCloud, 
  ChevronRight,
  Sparkles,
  Lock,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { Resource, Comment, UserSession } from '../types';

interface ExploreProps {
  onOpenUpload: () => void;
  isPremiumUnlocked: boolean;
  onNavigateToTab: (tab: string) => void;
  currentUser: UserSession | null;
  onOpenAuth: () => void;
}

export default function ExploreView({ onOpenUpload, isPremiumUnlocked, onNavigateToTab, currentUser, onOpenAuth }: ExploreProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [branch, setBranch] = useState('all');
  const [semester, setSemester] = useState('all');
  const [materialType, setMaterialType] = useState('all');
  const [search, setSearch] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (branch !== 'all') query.append('branch', branch);
      if (semester !== 'all') query.append('semester', semester);
      if (materialType !== 'all') query.append('materialType', materialType);
      if (search) query.append('search', search);

      const res = await fetch(`/api/resources?${query.toString()}`);
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [branch, semester, materialType, search]);

  const handleVote = async (id: string, voteType: 'up' | 'down') => {
    try {
      const response = await fetch(`/api/resources/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType, userId: 'current_student' })
      });
      if (response.ok) {
        const updated = await response.json();
        // Update list
        setResources(prev => prev.map(r => r.id === id ? updated : r));
        // Update expanded view if selected
        if (selectedResource && selectedResource.id === id) {
          setSelectedResource(updated);
        }
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const activeCommenterName = currentUser ? currentUser.name : commenterName;
    if (!commentText || !activeCommenterName) return;

    try {
      const response = await fetch(`/api/resources/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: activeCommenterName, text: commentText })
      });
      if (response.ok) {
        const newComment = await response.json();
        // Update local state
        setResources(prev => prev.map(r => {
          if (r.id === id) {
            const comments = [...(r.comments || []), newComment];
            return { ...r, comments, commentsCount: comments.length };
          }
          return r;
        }));

        if (selectedResource && selectedResource.id === id) {
          setSelectedResource(prev => {
            if (!prev) return null;
            const comments = [...(prev.comments || []), newComment];
            return { ...prev, comments, commentsCount: comments.length };
          });
        }

        setCommentText('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const triggerDownload = (res: Resource) => {
    if (res.premium && !isPremiumUnlocked) {
      alert('This is a Premium Track Resource. Please navigate to the "Premium Track" tab to activate your premium student access pass simulation.');
      onNavigateToTab('premium');
      return;
    }
    
    // Simulate Download
    const element = document.createElement("a");
    const file = new Blob([res.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${res.title.replace(/\s+/g, '_')}_StudyVault.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in pb-12">
      
      {/* LEFT: Search, Filters & List (Column span 7) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Search & Upload header */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course code, normal forms, LL(1), formulas..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-100 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            Upload File
          </button>
        </div>

        {/* Modular Filters Row */}
        <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="all">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="EE">EE</option>
              <option value="CE">CE</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Category</label>
            <select
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="notes">Lecture Notes</option>
              <option value="past_papers">End-Sem Papers</option>
              <option value="lab_manuals">Lab Workbooks</option>
              <option value="syllabus">Syllabus Copies</option>
            </select>
          </div>
        </div>

        {/* Resource List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-xl border border-slate-800 bg-slate-900/30 animate-pulse"></div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-800 rounded-2xl text-center">
            <BookOpen className="w-10 h-10 text-slate-600 mb-3" />
            <h4 className="text-slate-300 font-bold">No Syllabus Content Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              We couldn't find any resources matching your filters. Be the first to upload and map notes to this syllabus!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((res) => {
              const isSelected = selectedResource?.id === res.id;
              const hasPremiumLock = res.premium && !isPremiumUnlocked;
              
              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedResource(res)}
                  className={`p-4 md:p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/5' 
                      : 'border-slate-800 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-[10px] font-mono font-semibold text-blue-400 uppercase">
                          {res.courseCode}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                          Sem {res.semester}
                        </span>
                        {res.verified && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] text-emerald-400 font-semibold border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            Vetted
                          </span>
                        )}
                        {res.premium && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-[9px] text-amber-400 font-semibold border border-amber-500/20">
                            <Lock className="w-3 h-3" />
                            Premium
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-200 pt-1 flex items-center gap-1.5">
                        {res.title}
                        {hasPremiumLock && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{res.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/60 mt-4 pt-3 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <span>Contributor:</span>
                      <span className="font-semibold text-slate-300">{res.uploadedBy}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Voting Controls (Stops click-propagation to avoid selecting / expanding toggles) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(res.id, 'up');
                        }}
                        className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{res.upvotes}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(res.id, 'down');
                        }}
                        className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{res.downvotes}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{res.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT: Document Expanded Viewer (Column span 5) */}
      <div className="lg:col-span-5">
        {selectedResource ? (
          <div className="border border-slate-800 bg-slate-900/40 rounded-2xl overflow-hidden p-6 space-y-6 sticky top-6">
            
            {/* Expanded Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-mono font-bold text-blue-400">
                  {selectedResource.courseCode}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Size: {selectedResource.fileSize}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-100 tracking-tight leading-snug">
                  {selectedResource.title}
                </h3>
                <p className="text-xs text-slate-400">Course: {selectedResource.courseName}</p>
                <p className="text-xs text-slate-400">Topic: {selectedResource.topic}</p>
              </div>

              {/* Action Button: Download/Unlock */}
              {selectedResource.premium && !isPremiumUnlocked ? (
                <button
                  onClick={() => onNavigateToTab('premium')}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-100 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Unlock Premium Track Collection
                </button>
              ) : (
                <button
                  onClick={() => triggerDownload(selectedResource)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-100 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <DownloadCloud className="w-4 h-4" />
                  Simulate Download (Markdown)
                </button>
              )}
            </div>

            {/* Content Preview Stage */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Syllabus-Checked Content Preview</span>
              <div className="max-h-72 overflow-y-auto p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed scrollbar-thin">
                {selectedResource.content}
              </div>
            </div>

            {/* Quality Vetting & Comments Section */}
            <div className="space-y-4 border-t border-slate-800/80 pt-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Peer Comments & Reviews ({selectedResource.commentsCount})</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Quality Index:</span>
                  <span className={`text-[11px] font-bold ${
                    (selectedResource.upvotes - selectedResource.downvotes) >= 10 ? 'text-emerald-400' : 'text-slate-300'
                  }`}>
                    {(selectedResource.upvotes - selectedResource.downvotes) > 0 ? `+${selectedResource.upvotes - selectedResource.downvotes}` : selectedResource.upvotes - selectedResource.downvotes}
                  </span>
                </div>
              </div>

              {/* List Comments */}
              <div className="space-y-3 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                {selectedResource.comments && selectedResource.comments.length > 0 ? (
                  selectedResource.comments.map((com: Comment) => (
                    <div key={com.id} className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-300">{com.userName}</span>
                        <span className="text-slate-500">{new Date(com.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-normal">{com.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-500 italic text-center py-2">No reviews yet. Be the first to leave feedback!</p>
                )}
              </div>

              {/* Leave Review Form */}
              <form onSubmit={(e) => handleAddComment(e, selectedResource.id)} className="space-y-2">
                {currentUser ? (
                  <div className="flex items-center justify-between gap-2 p-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-400">
                      Reviewing as: <strong className="text-slate-200">{currentUser.name}</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-slate-100 text-[10px] font-bold rounded-md transition-colors cursor-pointer font-sans"
                    >
                      Post Review
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={commenterName}
                      onChange={(e) => setCommenterName(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-800/80 text-slate-200 placeholder-slate-600 rounded-lg text-xs focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-slate-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer font-sans"
                    >
                      Post Review
                    </button>
                  </div>
                )}
                <textarea
                  required
                  placeholder="Is this syllabus accurate? Are calculations correct?"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800/80 text-slate-200 placeholder-slate-600 rounded-lg text-xs focus:outline-none resize-none"
                ></textarea>
              </form>
            </div>

          </div>
        ) : (
          <div className="border border-slate-800 bg-slate-900/20 border-dashed rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center h-96">
            <BookOpen className="w-12 h-12 text-slate-700 mb-3" />
            <h4 className="text-sm font-semibold text-slate-400">Expanded Reader Stage</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Select any document from the syllabus list to view detailed lecture notes, download reference code, and analyze peer reviews.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
