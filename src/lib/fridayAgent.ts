export interface Message {
  role: "user" | "model" | "system";
  content: string;
}

export async function askFriday(prompt: string, history: Message[] = []): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return "Tactical link degraded, Boss. Gemini API key is missing. Please ensure NEXT_PUBLIC_GEMINI_API_KEY is configured in your GitHub Repository Secrets.";
  }

  const systemInstruction = `You are F.R.I.D.A.Y., a high-precision medical study protocol and cognitive AI tactical assistant for a top medical student. Respond concisely, sharply, and supportively. Address the user as 'Boss'.`;

  const contents = [
    ...history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })),
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
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
      return `Neural link interference detected (${response.status}): ${
        errorData.error?.message || "Tactical systems offline."
      }`;
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || "Diagnostics received empty telemetry, Boss. Standing by.";
  } catch (error) {
    return "Neural link failed to establish connection. Check your network or API status.";
  }
}

