'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Play, Square, AlertOctagon, Smartphone } from 'lucide-react';

export const FocusMonitor = () => {
  const { isFocusing, activeSeconds, toggleFocus, tickSecond, logDistraction, stats } = useGameStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocusing) {
      interval = setInterval(() => tickSecond(), 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusing, tickSecond]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
          <Smartphone className="w-5 h-5" /> PHONE DEFENSE & FOCUS RADAR
        </h2>
        <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider ${
          isFocusing ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'
        }`}>
          {isFocusing ? 'LOCKDOWN ACTIVE' : 'STANDBY'}
        </span>
      </div>

      <div className="text-center my-6">
        <div className="text-5xl font-mono font-extrabold text-white tracking-widest drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          {formatTime(activeSeconds)}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Cumulative Deep Focus Today: <span className="text-cyan-400 font-bold">{stats.focusMinutesToday} minutes</span>
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={toggleFocus}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            isFocusing 
              ? 'bg-rose-600 hover:bg-rose-500 text-white' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          }`}
        >
          {isFocusing ? <><Square className="w-4 h-4" /> Terminate Session</> : <><Play className="w-4 h-4" /> Engage Lockdown</>}
        </button>

        <button
          onClick={() => logDistraction('Social Media Breach')}
          className="bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/60 text-rose-400 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <AlertOctagon className="w-4 h-4" /> Log Distraction
        </button>
      </div>

      {stats.distractionPenaltyCount > 0 && (
        <div className="mt-4 p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-lg text-[11px] text-rose-300 font-mono text-center">
          ⚠ {stats.distractionPenaltyCount} Breaches Logged. Dopamine Shield -{stats.distractionPenaltyCount * 15}%.
        </div>
      )}
    </div>
  );
};
