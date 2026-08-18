'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { askFriday } from '../lib/fridayAgent';
import { Bot, Send, Sparkles, ShieldAlert, BrainCircuit } from 'lucide-react';
import { ChatMessage } from '../types';

export const FridayCompanion = () => {
  const { stats, quests } = useGameStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'FRIDAY',
      text: "Boss, all diagnostic systems are calibrated. Study telemetry is locked and ready. What's our first tactical objective today?",
      timestamp: '12:00 PM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'BOSS',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const reply = await askFriday(query, stats, quests);

    const fridayMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'FRIDAY',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, fridayMsg]);
    setIsLoading(false);
  };

  return (
    <div className="bg-slate-950/80 border border-cyan-500/40 rounded-2xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col h-[520px]">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
            <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider">F.R.I.D.A.Y. ONBOARD</h3>
            <span className="text-[10px] text-cyan-400 font-mono">NEURAL LINK ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'BOSS' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[9px] font-mono text-slate-500 mb-1">{m.sender} • {m.timestamp}</span>
            <div
              className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                m.sender === 'BOSS'
                  ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900 border border-cyan-500/20 text-cyan-100 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
            <BrainCircuit className="w-4 h-4 animate-spin" /> F.R.I.D.A.Y. is computing telemetry...
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-2 overflow-x-auto pb-1 text-[11px]">
        <button
          onClick={() => sendMessage("Give me a tactical situation report on my study targets and dopamine levels.")}
          className="whitespace-nowrap px-2.5 py-1 bg-slate-900 border border-slate-700 hover:border-cyan-400 rounded-full text-slate-300 hover:text-white"
        >
          <Sparkles className="w-3 h-3 inline mr-1 text-cyan-400" /> SitRep
        </button>
        <button
          onClick={() => sendMessage("I'm feeling distracted and tempted to scroll. Lock me back into focus mode.")}
          className="whitespace-nowrap px-2.5 py-1 bg-slate-900 border border-slate-700 hover:border-rose-400 rounded-full text-slate-300 hover:text-white"
        >
          <ShieldAlert className="w-3 h-3 inline mr-1 text-rose-400" /> Anti-Doomscroll
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          placeholder="Ask F.R.I.D.A.Y. for study tactics..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 p-2.5 rounded-xl font-bold transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
