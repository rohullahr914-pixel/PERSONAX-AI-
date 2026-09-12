import { NextResponse } from "next/server";
import { buildMultiPersonaPrompt } from "@/lib/ai/prompt-engine/multipersona-prompt";
import { callGroq } from "@/lib/ai/groq";
import type { PersonaMode } from "@/lib/types";

const personaModes: PersonaMode[] = ["Casual", "Expert", "Tutor", "Mentor", "Debate", "Interview", "Research", "Creative"];

function parseMode(value: string | undefined): PersonaMode {
  return personaModes.includes(value as PersonaMode) ? (value as PersonaMode) : "Debate";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      topic?: string;
      message?: string;
      mode?: string;
      participants?: Array<{
        name: string;
        role: string;
        expertise: string[];
        style: string;
      }>;
      conversationGoal?: string;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
    };

    const topic = (body.message ?? body.topic ?? "").trim();
    if (!topic) {
      return NextResponse.json({ error: "A valid topic or message is required." }, { status: 400 });
    }

    const participants = body.participants?.length ? body.participants : [
      {
        name: "Albert Einstein",
        role: "Theoretical Physicist",
        expertise: ["Physics", "Relativity", "Scientific imagination"],
        style: "Clear, thoughtful, and analogy-driven",
      },
      {
        name: "Leonardo da Vinci",
        role: "Artist and Inventor",
        expertise: ["Art", "Observation", "Invention"],
        style: "Observant, poetic, and exploratory",
      },
    ];

    const prompt = buildMultiPersonaPrompt({
      participants,
      topic,
      mode: parseMode(body.mode),
      conversationGoal: body.conversationGoal ?? "Explore the issue from multiple expert viewpoints.",
    });

    const result = await callGroq([
      { role: "system", content: prompt },
      ...(body.history ?? []).slice(-8),
      { role: "user", content: topic },
    ]);

    if (!result.ok) {
      return NextResponse.json({ error: result.error ?? "Multi-persona response failed." }, { status: 400 });
    }

    return NextResponse.json({ ok: true, content: result.content });
  } catch {
    return NextResponse.json({ error: "Unable to generate the multi-persona discussion." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Multi-persona chat API is ready.",
  });
}
