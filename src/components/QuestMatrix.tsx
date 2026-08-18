'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { CheckCircle2, Circle, Plus, Crosshair } from 'lucide-react';
import { QuestDifficulty } from '../types';

export const QuestMatrix = () => {
  const { quests, completeQuest, addQuest } = useGameStore();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Pharmacology');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('BETA');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addQuest(title, subject, difficulty);
    setTitle('');
  };

  const getBadgeColor = (diff: QuestDifficulty) => {
    switch (diff) {
      case 'ALPHA': return 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30';
      case 'BETA': return 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30';
      case 'GAMMA': return 'border-amber-500/50 text-amber-400 bg-amber-950/30';
      case 'OMEGA': return 'border-rose-500/50 text-rose-400 bg-rose-950/30';
    }
  };

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
          <Crosshair className="w-5 h-5" /> ACTIVE BATTLE QUESTS
        </h2>
        <span className="text-xs font-mono text-slate-400">
          COMPLETED: {quests.filter(q => q.completed).length} / {quests.length}
        </span>
      </div>

      <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
        {quests.map((quest) => (
          <div
            key={quest.id}
            onClick={() => !quest.completed && completeQuest(quest.id)}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
              quest.completed
                ? 'bg-slate-900/40 border-slate-800/80 opacity-50'
                : 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]'
            }`}
          >
            <div className="flex items-center gap-3">
              {quest.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500 hover:text-cyan-400" />
              )}
              <div>
                <p className={`text-sm font-semibold ${quest.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                  {quest.title}
                </p>
                <span className="text-xs text-slate-400 font-mono">{quest.subject}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-bold ${getBadgeColor(quest.difficulty)}`}>
                {quest.difficulty}
              </span>
              <span className="text-xs font-bold text-amber-400">+{quest.xp} XP</span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="space-y-3 pt-3 border-t border-slate-800">
        <input
          type="text"
          placeholder="New Mission Directive (e.g. Autonomic Nervous System)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option>Pharmacology</option>
            <option>Pathology</option>
            <option>Microbiology</option>
            <option>Forensic Medicine</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALPHA">ALPHA (+50 XP)</option>
            <option value="BETA">BETA (+120 XP)</option>
            <option value="GAMMA">GAMMA (+250 XP)</option>
            <option value="OMEGA">OMEGA (+500 XP)</option>
          </select>

          <button
            type="submit"
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-4 h-4" /> Deploy Mission
          </button>
        </div>
      </form>
    </div>
  );
};
