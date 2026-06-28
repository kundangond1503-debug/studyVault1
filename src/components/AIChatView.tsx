import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Sparkles, BookOpen, Clock } from 'lucide-react';
import { ChatMessage } from '../types';

export default function AIChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your StudyVault Mentor, your AI study assistant. I am fully mapped to the Madan Mohan Malaviya University of Technology (MMMUT) curricula. Ask me anything about normal forms, parsing tables, calculus theorems, or graph trees!",
      createdAt: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: input,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      // Map history
      const mappedHistory = [...messages, userMsg].map(m => ({
        role: m.sender === 'assistant' ? 'model' : 'user',
        content: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: mappedHistory })
      });

      if (!response.ok) {
        throw new Error('Chat API returned an error');
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: 'msg_' + Date.now() + '_bot',
        sender: 'assistant',
        text: data.reply,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Error in AI Chat:', err);
      const errorMsg: ChatMessage = {
        id: 'msg_' + Date.now() + '_err',
        sender: 'assistant',
        text: "I apologize, but my core neural link returned an error. This is usually due to missing GEMINI_API_KEY. Let me know if you want me to try again!",
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col border border-slate-800 bg-slate-900/40 rounded-2xl overflow-hidden animate-fade-in shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">StudyVault AI Mentor</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-400 font-mono">Cognitive Syllabus Assistant</span>
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md uppercase font-bold">
          Gemini 3.5 Flash
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((m) => {
          const isBot = m.sender === 'assistant';
          return (
            <div 
              key={m.id} 
              className={`flex gap-3 max-w-[85%] ${
                isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                isBot 
                  ? 'bg-blue-600 text-slate-100 border border-blue-500/20' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700'
              }`}>
                {isBot ? 'SV' : 'ST'}
              </div>

              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                isBot 
                  ? 'bg-slate-950 text-slate-200 border border-slate-800/60 rounded-tl-none font-sans' 
                  : 'bg-blue-600 text-slate-100 rounded-tr-none font-sans'
              }`}>
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div className={`text-[9px] text-right mt-1 font-mono ${
                  isBot ? 'text-slate-500' : 'text-blue-300'
                }`}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-slate-100 flex items-center justify-center font-bold text-xs animate-pulse">
              SV
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800/60 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Tray */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about B-Trees, Rolle's Theorem, or Lexical analysis..."
          disabled={isSending}
          className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-slate-100 rounded-xl disabled:bg-slate-800 disabled:text-slate-500 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
