import { NextResponse } from "next/server";
import { generatePersonaResponse } from "@/lib/ai/persona-engine";
import { parseCustomPersona } from "@/lib/custom-personas";
import type { PersonaMode } from "@/lib/types";

const personaModes: PersonaMode[] = ["Casual", "Expert", "Tutor", "Mentor", "Debate", "Interview", "Research", "Creative"];

function parseMode(value: string | undefined): PersonaMode {
  return personaModes.includes(value as PersonaMode) ? (value as PersonaMode) : "Casual";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      personaSlug?: string;
      personaId?: string;
      userMessage?: string;
      mode?: string;
      language?: string;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
      memory?: string[];
      researchMode?: boolean;
      customPersona?: unknown;
    };

    if (!body.userMessage || !body.userMessage.trim()) {
      return NextResponse.json({ error: "A valid message is required." }, { status: 400 });
    }

    const customPersona = body.customPersona ? parseCustomPersona(body.customPersona) ?? undefined : undefined;
    if (body.customPersona && !customPersona) {
      return NextResponse.json({ error: "The custom persona is incomplete or invalid." }, { status: 400 });
    }

    const response = await generatePersonaResponse({
      personaSlug: body.personaSlug,
      personaId: body.personaId,
      userMessage: body.userMessage,
      mode: parseMode(body.mode),
      language: body.language,
      history: body.history,
      memory: body.memory,
      researchMode: body.researchMode,
      customPersona,
    });

    if (!response.ok) {
      return NextResponse.json({ error: response.error }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      persona: response.persona,
      content: response.content,
    });
  } catch {
    return NextResponse.json({ error: "Unable to process the chat request." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "PersonaX chat API is ready for server-side AI requests.",
  });
}
