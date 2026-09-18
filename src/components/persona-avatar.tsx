"use client";

import { useEffect, useState } from "react";

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
  "john-d-rockefeller": "/personas/rockefeller.svg",
  "alexander-the-great": "/personas/alexander-the-great.jpg",
  "fyodor-dostoevsky": "/personas/fyodor-dostoevsky.jpg",
  nexus: "/personas/nexus.svg",
  "sherlock-holmes": "/personas/sherlock-holmes.jpg",
  "michael-jackson": "/personas/michael-jackson.jpg",
  "isaac-newton": "/personas/isaac-newton.jpg",
  "muhammad-ali": "/personas/muhammad-ali.jpg",
  "charlie-chaplin": "/personas/charlie-chaplin.jpg",
  aristotle: "/personas/aristotle-portrait.jpg",
};

const historicalPortraitSlugs = new Set([
  "ludwig-van-beethoven", "jesus-christ", "moses", "gautama-buddha", "confucius", "laozi", "zoroaster", "wolfgang-amadeus-mozart", "freddie-mercury", "audrey-hepburn", "bruce-lee", "pele", "diego-maradona", "ibn-sina", "al-khwarizmi", "ibn-khaldun", "ibn-rushd", "saladin", "cyrus-the-great", "darius-the-great", "hammurabi", "cleopatra", "julius-caesar", "augustus", "marcus-aurelius", "plato", "pythagoras", "archimedes", "hippocrates", "galen", "hypatia", "sun-tzu", "genghis-khan", "kublai-khan", "ashoka", "akbar-the-great", "shah-jahan", "babur", "mehmed-the-conqueror", "suleiman-the-magnificent", "joan-of-arc", "charlemagne", "richard-the-lionheart", "william-the-conqueror", "elizabeth-i", "queen-victoria", "napoleon-bonaparte", "george-washington", "abraham-lincoln", "nelson-mandela", "mahatma-gandhi", "martin-luther-king-jr", "winston-churchill", "mustafa-kemal-ataturk", "simon-bolivar", "toussaint-louverture", "frederick-douglass", "harriet-tubman", "florence-nightingale", "ada-lovelace", "charles-darwin", "galileo-galilei", "nicolaus-copernicus", "johannes-kepler", "louis-pasteur", "michael-faraday", "james-clerk-maxwell", "niels-bohr", "max-planck", "richard-feynman", "rosalind-franklin", "katherine-johnson", "rabindranath-tagore", "omar-khayyam", "hafez", "ferdowsi", "saadi-shirazi", "johann-wolfgang-von-goethe", "jane-austen", "frida-kahlo",
]);

export function PersonaAvatar({ slug, name, className = "" }: PersonaAvatarProps) {
  const portrait = portraitFiles[slug] ?? (historicalPortraitSlugs.has(slug) ? `/personas/historical/${slug}.jpg` : undefined);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [portrait]);
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 ${className}`}>
      {portrait && !imageFailed ? (
        <img src={portrait} alt={name} onError={() => setImageFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-black text-white" aria-label={name}>
          {initials || "AI"}
        </span>
      )}
    </div>
  );
}
