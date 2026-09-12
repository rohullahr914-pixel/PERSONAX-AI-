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

export function getResearchStatus(): ResearchStatus {
  const hasKey = Boolean(process.env.GROQ_API_KEY?.trim());

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

  return {
    ok: true,
    query,
    answer:
      "This research workflow is architecture-ready. In production, it would retrieve sources, assess evidence quality, and return referenced findings while clearly separating general persona conversation from research-backed output.",
    sources: [
      {
        title: "Public knowledge brief",
        url: "https://example.com/public-knowledge-brief",
        note: "Grounded explanation placeholders for future source retrieval and evidence checking.",
      },
    ],
  };
}
