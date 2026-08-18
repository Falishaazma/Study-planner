'use client';

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Shield, Zap, Flame, Award } from 'lucide-react';

export const HUDHeader = () => {
  const { stats } = useGameStore();
  const xpPercent = Math.round((stats.xp / stats.xpToNextLevel) * 100);

  return (
    <header className="w-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md rounded-2xl p-4 shadow-[0_0_25px_rgba(6,182,212,0.15)] text-cyan-400">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-14 h-14 bg-cyan-950/60 border border-cyan-400 rounded-xl">
            <span className="text-xl font-extrabold text-cyan-300">LVL {stats.level}</span>
            <div className="absolute -bottom-2 px-2 py-0.5 bg-cyan-500 text-slate-950 font-bold text-[10px] rounded-full uppercase tracking-widest">
              Hero
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400">Operator Protocol</div>
            <div className="text-lg font-bold text-white tracking-wide">P. SHAHID KHAN</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${stats.suitIntegrity > 50 ? 'text-emerald-400' : 'text-rose-500'}`} />
            <div>
              <div className="text-[10px] uppercase text-slate-400">Armor Integrity</div>
              <div className="font-bold text-slate-100">{stats.suitIntegrity}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase text-slate-400">Dopamine Shield</div>
              <div className="font-bold text-slate-100">{stats.dopamineShield}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <div>
              <div className="text-[10px] uppercase text-slate-400">Streak</div>
              <div className="font-bold text-slate-100">{stats.streakDays} Days</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1 font-semibold">
          <span className="flex items-center gap-1 text-cyan-300">
            <Award className="w-3.5 h-3.5" /> REPUTATION PROGRESS
          </span>
          <span className="text-slate-400">{stats.xp} / {stats.xpToNextLevel} XP ({xpPercent}%)</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-cyan-900">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500 shadow-[0_0_12px_#06b6d4]"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
