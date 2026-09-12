export type GroqChatResponse = {
  ok: boolean;
  content?: string;
  error?: string;
};

export function getGroqConfig() {
  return {
    apiKey: process.env.GROQ_API_KEY ?? "",
    model: process.env.GROQ_MODEL ?? "openai/gpt-oss-120b",
    baseUrl: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
  };
}

export function hasGroqApiKey() {
  return Boolean(getGroqConfig().apiKey.trim());
}

export async function callGroq(messages: Array<{ role: "system" | "user" | "assistant"; content: string }>) {
  const config = getGroqConfig();

  if (!hasGroqApiKey()) {
    return {
      ok: false,
      error: "AI configuration is missing. Add your GROQ_API_KEY in the environment to enable chat generation.",
    } satisfies GroqChatResponse;
  }

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        ok: false,
        error: "The AI provider is temporarily unavailable. Please try again in a moment.",
        content: text,
      } satisfies GroqChatResponse;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return {
        ok: false,
        error: "The model returned an empty response. Please try a different prompt.",
      } satisfies GroqChatResponse;
    }

    return {
      ok: true,
      content,
    } satisfies GroqChatResponse;
  } catch {
    return {
      ok: false,
      error: "A network error prevented the AI response from being generated.",
    } satisfies GroqChatResponse;
  }
}
