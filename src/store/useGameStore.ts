import { create } from 'zustand';
import { Quest, PlayerStats } from '../types';

interface GameState {
  stats: PlayerStats;
  quests: Quest[];
  isFocusing: boolean;
  activeSeconds: number;
  addQuest: (title: string, subject: string, difficulty: Quest['difficulty']) => void;
  completeQuest: (id: string) => { xpGained: number; leveledUp: boolean };
  logDistraction: (reason: string) => void;
  toggleFocus: () => void;
  tickSecond: () => void;
}

const XP_MAP: Record<Quest['difficulty'], number> = {
  ALPHA: 50,
  BETA: 120,
  GAMMA: 250,
  OMEGA: 500
};

export const useGameStore = create<GameState>((set) => ({
  stats: {
    level: 1,
    xp: 0,
    xpToNextLevel: 300,
    streakDays: 4,
    suitIntegrity: 100,
    dopamineShield: 100,
    focusMinutesToday: 45,
    distractionPenaltyCount: 0,
  },
  quests: [
    { id: '1', title: 'Autonomic Nervous System Drug Matrix', subject: 'Pharmacology', xp: 120, completed: false, difficulty: 'BETA' },
    { id: '2', title: 'Cell Injury & Granulomatous Inflammation', subject: 'Pathology', xp: 250, completed: false, difficulty: 'GAMMA' },
    { id: '3', title: 'Gram Staining & Culture Media Review', subject: 'Microbiology', xp: 50, completed: true, difficulty: 'ALPHA' },
  ],
  isFocusing: false,
  activeSeconds: 0,

  addQuest: (title, subject, difficulty) => set((state) => ({
    quests: [
      ...state.quests,
      {
        id: Math.random().toString(36).substring(7),
        title,
        subject,
        xp: XP_MAP[difficulty],
        completed: false,
        difficulty
      }
    ]
  })),

  completeQuest: (id) => {
    let xpGained = 0;
    let leveledUp = false;

    set((state) => {
      const updatedQuests = state.quests.map((q) => {
        if (q.id === id && !q.completed) {
          xpGained = q.xp;
          return { ...q, completed: true };
        }
        return q;
      });

      let newXp = state.stats.xp + xpGained;
      let newLevel = state.stats.level;
      let newXpTarget = state.stats.xpToNextLevel;

      if (newXp >= newXpTarget) {
        newLevel += 1;
        newXp -= newXpTarget;
        newXpTarget = Math.round(newXpTarget * 1.35);
        leveledUp = true;
      }

      return {
        quests: updatedQuests,
        stats: {
          ...state.stats,
          xp: newXp,
          level: newLevel,
          xpToNextLevel: newXpTarget,
          suitIntegrity: Math.min(100, state.stats.suitIntegrity + 10)
        }
      };
    });

    return { xpGained, leveledUp };
  },

  logDistraction: () => set((state) => {
    const penalty = 15;
    const newShield = Math.max(0, state.stats.dopamineShield - penalty);
    const newIntegrity = newShield === 0 ? Math.max(0, state.stats.suitIntegrity - 20) : state.stats.suitIntegrity;

    return {
      stats: {
        ...state.stats,
        dopamineShield: newShield,
        suitIntegrity: newIntegrity,
        distractionPenaltyCount: state.stats.distractionPenaltyCount + 1,
      }
    };
  }),

  toggleFocus: () => set((state) => ({ isFocusing: !state.isFocusing })),

  tickSecond: () => set((state) => {
    if (!state.isFocusing) return {};
    const newSec = state.activeSeconds + 1;
    const addedMinute = newSec % 60 === 0;
    return {
      activeSeconds: newSec,
      stats: addedMinute 
        ? { ...state.stats, focusMinutesToday: state.stats.focusMinutesToday + 1 }
        : state.stats
    };
  }),
}));
