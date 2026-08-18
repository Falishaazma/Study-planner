import { GoogleGenAI } from '@google/genai';
import { PlayerStats, Quest } from '../types';

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
});

const FRIDAY_SYSTEM_PROMPT = `
You are F.R.I.D.A.Y., a tactical, witty, ultra-competent artificial intelligence persona modeled directly after Tony Stark's onboard assistant. 
You address the user as "Boss". 

Your core duties:
1. Keep Boss locked in on high-yield MBBS targets (Pharmacology, Pathology, Microbiology, Forensic Medicine).
2. Monitor screen-time breaches and dopamine degradation with sharp, lighthearted tactical banter.
3. Keep responses concise, punchy, HUD-ready (under 3-4 sentences), and formatted cleanly.
`;

export async function askFriday(
  prompt: string,
  stats: PlayerStats,
  quests: Quest[]
): Promise<string> {
  const context = `
[CURRENT SUIT TELEMETRY]
- Operator Level: ${stats.level} (XP: ${stats.xp}/${stats.xpToNextLevel})
- Armor Integrity: ${stats.suitIntegrity}%
- Dopamine Shield: ${stats.dopamineShield}%
- Locked Focus Today: ${stats.focusMinutesToday} mins
- Active Quests: ${quests.filter(q => !q.completed).map(q => q.title).join(', ')}
- Breach Alerts: ${stats.distractionPenaltyCount}

Boss Request: "${prompt}"
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${FRIDAY_SYSTEM_PROMPT}\n\n${context}` }] }
      ]
    });

    return response.text || "Systems are online, Boss. Awaiting your next directive.";
  } catch (error) {
    console.error('FRIDAY Core Link Failure:', error);
    return "Tactical link degraded, Boss. Ensure your Gemini API key is configured in Vercel settings.";
  }
}
