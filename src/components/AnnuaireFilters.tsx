"use client";

import Link from "next/link";
import { useState } from "react";
import {
  breedsBySpecies,
  speciesLabels,
  statusLabels,
} from "@/lib/labels";
import type { AnimalStatus, Species } from "@/lib/supabase/types";

type Filters = {
  espece?: string;
  race?: string;
  statut?: string;
};

function buildHref(next: Filters): string {
  const params = new URLSearchParams();
  if (next.espece) params.set("espece", next.espece);
  if (next.race) params.set("race", next.race);
  if (next.statut) params.set("statut", next.statut);
  const query = params.toString();
  return query ? `/annuaire?${query}` : "/annuaire";
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

function ActivePill({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full bg-gold/8 px-2.5 py-1 text-xs text-gold-soft ring-1 ring-gold/20 transition-colors hover:bg-gold/14"
      scroll={false}
      title="Retirer ce filtre"
    >
      {label}
      <span aria-hidden className="text-[10px] opacity-70">
        ×
      </span>
    </Link>
  );
}

export function AnnuaireFilters({ filters }: { filters: Filters }) {
  const species = (filters.espece === "canin" || filters.espece === "felin"
    ? filters.espece
    : undefined) as Species | undefined;

  const breedOptions = species
    ? breedsBySpecies[species]
    : [...breedsBySpecies.canin, ...breedsBySpecies.felin];

  const raceActive =
    filters.race && breedOptions.includes(filters.race) ? filters.race : undefined;

  const hasActive = Boolean(species || raceActive || filters.statut);
  const [open, setOpen] = useState(false);

  const activeCount = [species, raceActive, filters.statut].filter(Boolean).length;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-gold-soft"
          aria-expanded={open}
          aria-controls="annuaire-filters-panel"
        >
          <span>{open ? "Masquer les filtres" : "Filtrer"}</span>
          {!open && activeCount > 0 ? (
            <span className="rounded-full bg-gold/12 px-1.5 py-0.5 text-[10px] font-medium text-gold-soft">
              {activeCount}
            </span>
          ) : null}
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {hasActive ? (
          <div className="flex flex-wrap items-center gap-2">
            {species ? (
              <ActivePill
                href={buildHref({ race: raceActive, statut: filters.statut })}
                label={species === "canin" ? "Chiens" : "Chats"}
              />
            ) : null}
            {raceActive ? (
              <ActivePill
                href={buildHref({ espece: species, statut: filters.statut })}
                label={raceActive}
              />
            ) : null}
            {filters.statut ? (
              <ActivePill
                href={buildHref({ espece: species, race: raceActive })}
                label={statusLabels[filters.statut as AnimalStatus]}
              />
            ) : null}
            <Link
              href="/annuaire"
              className="text-xs text-foreground-muted transition-colors hover:text-gold-soft"
              scroll={false}
            >
              Tout effacer
            </Link>
          </div>
        ) : null}
      </div>

      {open ? (
        <div
          id="annuaire-filters-panel"
          className="mt-4 space-y-3 border-t border-line/30 pt-4"
        >
          <FilterRow label="Espèce">
            <Chip href={buildHref({ statut: filters.statut })} active={!species}>
              Tous
            </Chip>
            {(Object.keys(speciesLabels) as Species[]).map((key) => (
              <Chip
                key={key}
                href={buildHref({
                  espece: key,
                  statut: filters.statut,
                })}
                active={species === key}
              >
                {speciesLabels[key]}s
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label="Race">
            <Chip
              href={buildHref({ espece: species, statut: filters.statut })}
              active={!raceActive}
            >
              Toutes
            </Chip>
            {breedOptions.map((breed) => {
              const breedSpecies = breedsBySpecies.canin.includes(breed)
                ? "canin"
                : "felin";
              return (
                <Chip
                  key={breed}
                  href={buildHref({
                    espece: species ?? breedSpecies,
                    race: breed,
                    statut: filters.statut,
                  })}
                  active={raceActive === breed}
                >
                  {breed}
                </Chip>
              );
            })}
          </FilterRow>

          <FilterRow label="Statut">
            <Chip
              href={buildHref({ espece: species, race: raceActive })}
              active={!filters.statut}
            >
              Tous
            </Chip>
            {(Object.keys(statusLabels) as AnimalStatus[]).map((status) => (
              <Chip
                key={status}
                href={buildHref({
                  espece: species,
                  race: raceActive,
                  statut: status,
                })}
                active={filters.statut === status}
              >
                {statusLabels[status]}
              </Chip>
            ))}
          </FilterRow>
        </div>
      ) : null}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <p className="shrink-0 text-xs text-foreground-muted sm:w-14">{label}</p>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}
