type PersonaAvatarProps = {
  slug: string;
  name: string;
  className?: string;
};

const portraitFiles: Record<string, string> = {
  "albert-einstein": "einstein",
  "leonardo-da-vinci": "leonardo",
  "nikola-tesla": "tesla",
  "william-shakespeare": "shakespeare",
  "marie-curie": "curie",
  "alan-turing": "turing",
  socrates: "socrates",
  rumi: "rumi",
  "steve-jobs": "jobs",
  "vincent-van-gogh": "gogh",
};

export function PersonaAvatar({ slug, name, className = "" }: PersonaAvatarProps) {
  const portrait = portraitFiles[slug];

  return (
    <div className={`shrink-0 overflow-hidden rounded-full bg-slate-900 ${className}`}>
      <img src={`/personas/${portrait ?? "einstein"}.png`} alt={name} className="h-full w-full object-cover" />
    </div>
  );
}
