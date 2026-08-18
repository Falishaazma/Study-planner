export interface Message {
  role: "user" | "model" | "system";
  content: string;
}

export async function askFriday(
  prompt: string,
  stats?: any,
  quests?: any,
  history: Message[] = []
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return "Tactical link degraded, Boss. Gemini API key is missing. Please ensure NEXT_PUBLIC_GEMINI_API_KEY is configured in your GitHub Repository Secrets.";
  }

  // Format telemetry and active quests into context
  let contextTelemetry = "";
  if (stats) {
    contextTelemetry += `\n[ACTIVE TELEMETRY / STATS]: ${typeof stats === "object" ? JSON.stringify(stats) : stats}`;
  }
  if (quests) {
    contextTelemetry += `\n[ACTIVE BATTLE QUESTS]: ${typeof quests === "object" ? JSON.stringify(quests) : quests}`;
  }

  const systemInstruction = `You are F.R.I.D.A.Y., a tactical medical study assistant and cognitive AI for a top medical student. Address the user as 'Boss'. Be sharp, encouraging, concise, and tactical. Use the active battle quests and focus telemetry to guide the student's study objectives.`;

  // Build message sequence compatible with the v1 endpoint
  const contents = [
    {
      role: "user",
      parts: [{ text: `[SYSTEM PROTOCOL]: ${systemInstruction}` }],
    },
    {
      role: "model",
      parts: [{ text: "Neural link established. Ready for orders, Boss." }],
    },
    ...history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })),
    {
      role: "user",
      parts: [
        {
          text: contextTelemetry
            ? `${contextTelemetry}\n\n[USER COMMAND]: ${prompt}`
            : prompt,
        },
      ],
    },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return `Neural link interference (${response.status}): ${
        errorData.error?.message || "Tactical systems offline."
      }`;
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || "Diagnostics received empty telemetry, Boss. Standing by.";
  } catch (error) {
    return "Neural link failed to establish connection. Check network status.";
  }
}

