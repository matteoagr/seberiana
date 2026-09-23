"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimalCard } from "@/components/AnimalCard";
import { ButtonLink } from "@/components/ButtonLink";
import { breedsBySpecies, speciesLabels } from "@/lib/labels";
import type { AnimalCardModel, Species } from "@/lib/supabase/types";

type Filters = {
  espece?: string;
  race?: string;
};

function buildHref(next: Filters): string {
  const params = new URLSearchParams();
  if (next.espece) params.set("espece", next.espece);
  if (next.race) params.set("race", next.race);
  const query = params.toString();
  return query ? `/reproducteurs?${query}` : "/reproducteurs";
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs transition-colors ${
        active
          ? "bg-gold/12 text-gold-soft ring-1 ring-gold/25"
          : "text-foreground-muted hover:bg-background-elevated hover:text-foreground/90"
      }`}
      scroll={false}
    >
      {children}
    </Link>
  );
}

export function ReproducteursBrowser({
  breeders,
}: {
  breeders: AnimalCardModel[];
}) {
  const searchParams = useSearchParams();
  const espece =
    searchParams.get("espece") === "canin" || searchParams.get("espece") === "felin"
      ? (searchParams.get("espece") as Species)
      : undefined;
  const race = searchParams.get("race")?.trim() || undefined;

  const filtered = useMemo(() => {
    return breeders.filter((animal) => {
      if (espece && animal.species !== espece) return false;
      if (race && animal.breed !== race) return false;
      return true;
    });
  }, [breeders, espece, race]);

  const raceOptions = espece ? breedsBySpecies[espece] : [];

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Chip href={buildHref({})} active={!espece && !race}>
          Tous
        </Chip>
        {(Object.keys(speciesLabels) as Species[]).map((key) => (
          <Chip
            key={key}
            href={buildHref({ espece: key })}
            active={espece === key && !race}
          >
            {speciesLabels[key]}
          </Chip>
        ))}
        {espece
          ? raceOptions.map((breed) => (
              <Chip
                key={breed}
                href={buildHref({ espece, race: breed })}
                active={race === breed}
              >
                {breed}
              </Chip>
            ))
          : null}
      </div>

      <p className="mt-6 text-sm text-foreground-muted">
        {filtered.length} reproducteur{filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-line/60 bg-background-elevated/40 px-6 py-12 text-center">
          <p className="font-serif text-2xl text-gold-soft">Aucun reproducteur trouvé</p>
          <p className="mt-3 text-sm text-foreground-muted">
            Essayez d’élargir vos filtres, ou découvrez nos petits cœurs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/reproducteurs">Tout afficher</ButtonLink>
            <ButtonLink href="/annuaire" variant="ghost">
              Nos petits cœurs
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  );
}
