type PersonaAvatarProps = {
  slug: string;
  name: string;
  className?: string;
};

const portraitFiles: Record<string, string> = {
  "albert-einstein": "/personas/einstein.png",
  "leonardo-da-vinci": "/personas/leonardo.png",
  "nikola-tesla": "/personas/tesla.png",
  "william-shakespeare": "/personas/shakespeare.png",
  "marie-curie": "/personas/curie.png",
  "alan-turing": "/personas/turing.png",
  socrates: "/personas/socrates.png",
  rumi: "/personas/rumi.png",
  "steve-jobs": "/personas/jobs.png",
  "vincent-van-gogh": "/personas/gogh.png",
  "cristiano-ronaldo": "/personas/cristiano-ronaldo.jpg",
  "alexander-the-great": "/personas/alexander-the-great.jpg",
  "fyodor-dostoevsky": "/personas/fyodor-dostoevsky.jpg",
  "elon-musk": "/personas/elon-musk.jpg",
  "sherlock-holmes": "/personas/sherlock-holmes.jpg",
  "michael-jackson": "/personas/michael-jackson.jpg",
  "isaac-newton": "/personas/isaac-newton.jpg",
  "muhammad-ali": "/personas/muhammad-ali.jpg",
  "charlie-chaplin": "/personas/charlie-chaplin.jpg",
  aristotle: "/personas/aristotle-portrait.jpg",
};

export function PersonaAvatar({ slug, name, className = "" }: PersonaAvatarProps) {
  const portrait = portraitFiles[slug];

  return (
    <div className={`shrink-0 overflow-hidden rounded-full bg-slate-900 ${className}`}>
      <img src={portrait ?? "/personas/einstein.png"} alt={name} className="h-full w-full object-cover" />
    </div>
  );
}
