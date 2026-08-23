import Image from "next/image";
import Link from "next/link";
import type { BreedProfile } from "@/data/breeds";

type BreedTeaserProps = {
  breed: BreedProfile;
  /** Texte court sous le nom — défaut : heroDescription tronquée */
  summary?: string;
  priority?: boolean;
};

export function BreedTeaser({ breed, summary, priority = false }: BreedTeaserProps) {
  const text =
    summary ??
    (breed.heroDescription.length > 110
      ? `${breed.heroDescription.slice(0, 110).trim()}…`
      : breed.heroDescription);

  return (
    <Link
      href={`/races/${breed.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={breed.heroImage}
          alt={`Exemple de ${breed.name}`}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gold/90">
            {breed.species === "canin" ? "Chien" : "Chat"}
          </p>
          <h3 className="mt-1 font-serif text-2xl text-foreground transition-colors group-hover:text-gold-soft">
            {breed.name}
          </h3>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{text}</p>
      <span className="mt-2 inline-block text-sm text-gold/90 transition-colors group-hover:text-gold-soft">
        Voir la fiche →
      </span>
    </Link>
  );
}
