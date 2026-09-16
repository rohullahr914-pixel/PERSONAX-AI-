export type ResearchStatus = {
  enabled: boolean;
  message: string;
};

export type ResearchResult = {
  ok: boolean;
  query: string;
  answer?: string;
  sources?: Array<{ title: string; url: string; note: string }>;
  message?: string;
};

import { callGroq, hasGroqApiKey } from "@/lib/ai/groq";

export function getResearchStatus(): ResearchStatus {
  const hasKey = hasGroqApiKey();

  return {
    enabled: hasKey,
    message: hasKey
      ? "Research mode is configured and ready for evidence-aware responses."
      : "Research functionality requires a valid GROQ_API_KEY configuration.",
  };
}

export async function runResearchQuery(query: string): Promise<ResearchResult> {
  const status = getResearchStatus();

  if (!status.enabled) {
    return {
      ok: false,
      query,
      message: "Research mode requires an API configuration. Add your GROQ_API_KEY to enable evidence-aware responses.",
    };
  }

  const response = await callGroq([
    {
      role: "system",
      content: "You are a careful research assistant. Answer clearly using established knowledge, distinguish facts from interpretation, state uncertainty when relevant, and do not invent citations or source links. Keep the answer concise but useful.",
    },
    { role: "user", content: `Research question: ${query}` },
  ]);

  if (!response.ok) {
    return { ok: false, query, message: response.error ?? "Research could not be completed." };
  }

  return { ok: true, query, answer: response.content, sources: [] };
}
