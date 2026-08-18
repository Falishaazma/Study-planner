export type QuestDifficulty = 'ALPHA' | 'BETA' | 'GAMMA' | 'OMEGA';

export interface Quest {
  id: string;
  title: string;
  subject: string;
  xp: number;
  completed: boolean;
  difficulty: QuestDifficulty;
}

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  suitIntegrity: number;
  dopamineShield: number;
  focusMinutesToday: number;
  distractionPenaltyCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'FRIDAY' | 'BOSS';
  text: string;
  timestamp: string;
}
