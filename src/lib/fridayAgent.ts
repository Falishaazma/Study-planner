import { PlayerStats, Quest } from '../types';

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

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
- Active Quests: ${quests.filter((q) => !q.completed).map((q) => q.title).join(', ')}
- Breach Alerts: ${stats.distractionPenaltyCount}

Boss Request: "${prompt}"
`;

  if (!GROQ_API_KEY) {
    return "Groq link degraded, Boss. Ensure your NEXT_PUBLIC_GROQ_API_KEY is configured.";
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: FRIDAY_SYSTEM_PROMPT },
          { role: 'user', content: context },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      return `Telemetry error from Groq: ${errorData?.error?.message || response.statusText}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Systems are online, Boss. Awaiting your next directive.";
  } catch (error) {
    console.error('FRIDAY Groq Link Failure:', error);
    return "Tactical link degraded, Boss. Unable to reach Groq servers.";
  }
}
