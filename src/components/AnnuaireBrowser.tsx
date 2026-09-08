"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimalCard } from "@/components/AnimalCard";
import { AnnuaireFilters } from "@/components/AnnuaireFilters";
import { ButtonLink } from "@/components/ButtonLink";
import type { AnimalCardModel, AnimalStatus, Species } from "@/lib/supabase/types";

export function AnnuaireBrowser({ animals }: { animals: AnimalCardModel[] }) {
  const searchParams = useSearchParams();
  const espece =
    searchParams.get("espece") === "canin" || searchParams.get("espece") === "felin"
      ? (searchParams.get("espece") as Species)
      : undefined;
  const statutRaw = searchParams.get("statut");
  const statut =
    statutRaw === "disponible" || statutRaw === "reserve" || statutRaw === "adopte"
      ? (statutRaw as AnimalStatus)
      : undefined;
  const race = searchParams.get("race")?.trim() || undefined;

  const filters = { espece, race, statut };

  const filtered = useMemo(() => {
    return animals.filter((animal) => {
      if (espece && animal.species !== espece) return false;
      if (race && animal.breed !== race) return false;
      if (statut && animal.status !== statut) return false;
      return true;
    });
  }, [animals, espece, race, statut]);

  return (
    <>
      <div className="mt-6">
        <AnnuaireFilters filters={filters} />
      </div>

      <p className="mt-6 text-sm text-foreground-muted">
        {filtered.length} profil{filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} showCta />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-line/60 bg-background-elevated/40 px-6 py-12 text-center">
          <p className="font-serif text-2xl text-gold-soft">Aucun profil trouvé</p>
          <p className="mt-3 text-sm text-foreground-muted">
            Essayez d’élargir vos filtres, ou jetez un œil aux portées en cours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/annuaire">Tout afficher</ButtonLink>
            <ButtonLink href="/portees" variant="ghost">
              Voir les portées
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  );
}
