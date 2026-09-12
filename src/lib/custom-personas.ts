export type CustomPersona = {
  id: string;
  name: string;
  profession: string;
  description: string;
  personality: string;
  expertise: string;
  createdAt: string;
};

const CUSTOM_PERSONAS_KEY = "personax-custom-personas";

export function getCustomPersonas(): CustomPersona[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CUSTOM_PERSONAS_KEY);
    return raw ? (JSON.parse(raw) as CustomPersona[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomPersona(persona: CustomPersona) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CUSTOM_PERSONAS_KEY, JSON.stringify([persona, ...getCustomPersonas()]));
}
