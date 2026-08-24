"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { adminAnimalEditHref } from "@/lib/admin";
import {
  roleLabels,
  sexLabels,
  speciesLabels,
  statusLabels,
} from "@/lib/labels";
import { animalCoverUrl } from "@/lib/supabase/storage";
import type { AdminAnimalListItem } from "@/lib/supabase/queries";

const filterClass =
  "mt-1 h-8 w-full min-w-[8rem] rounded-md border border-line bg-background px-2 text-xs text-foreground outline-none focus:border-gold/50";

function shortDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR");
}

export function AnimalsTable({ animals }: { animals: AdminAnimalListItem[] }) {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [species, setSpecies] = useState("all");
  const [status, setStatus] = useState("all");
  const [showArchived, setShowArchived] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return animals.filter((animal) => {
      if (!showArchived && animal.archived) return false;
      if (role !== "all" && animal.role !== role) return false;
      if (species !== "all" && animal.species !== species) return false;
      if (status !== "all" && animal.status !== status) return false;
      if (!query) return true;
      const hay = [
        animal.name,
        animal.breed,
        animal.color,
        animal.lineage_label,
        animal.description,
        animal.litterTitle,
        animal.sireName,
        animal.damName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [animals, q, role, species, status, showArchived]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs text-gold/90">
          Recherche
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nom, race, portée…"
            className={`${filterClass} w-56`}
          />
        </label>
        <label className="text-xs text-gold/90">
          Rôle
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={filterClass}
          >
            <option value="all">Tous</option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-gold/90">
          Espèce
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className={filterClass}
          >
            <option value="all">Toutes</option>
            {Object.entries(speciesLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-gold/90">
          Statut
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={filterClass}
          >
            <option value="all">Tous</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex items-center gap-2 pb-1 text-xs text-foreground-muted">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="accent-[var(--gold)]"
          />
          Archivés
        </label>
        <p className="pb-1 text-xs text-foreground-muted">
          {filtered.length} {filtered.length > 1 ? "animaux" : "animal"}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line/60">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead className="border-b border-line bg-background-elevated/80 text-foreground-muted">
            <tr>
              <th className="sticky left-0 z-10 bg-background-elevated/95 px-3 py-3 font-medium">
                Animal
              </th>
              <th className="px-3 py-3 font-medium">Rôle</th>
              <th className="px-3 py-3 font-medium">Espèce</th>
              <th className="px-3 py-3 font-medium">Race</th>
              <th className="px-3 py-3 font-medium">Sexe</th>
              <th className="px-3 py-3 font-medium">Naissance</th>
              <th className="px-3 py-3 font-medium">Couleur</th>
              <th className="px-3 py-3 font-medium">Statut</th>
              <th className="px-3 py-3 font-medium">LOF</th>
              <th className="px-3 py-3 font-medium">Portée</th>
              <th className="px-3 py-3 font-medium">Père</th>
              <th className="px-3 py-3 font-medium">Mère</th>
              <th className="px-3 py-3 font-medium">Lignée</th>
              <th className="px-3 py-3 font-medium">Visible</th>
              <th className="px-3 py-3 font-medium">Photos</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((animal) => {
              const href = adminAnimalEditHref(animal);
              return (
                <tr key={animal.id} className="border-b border-line/40">
                  <td className="sticky left-0 z-10 bg-background px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-line/50">
                        <Image
                          src={animalCoverUrl(animal)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </span>
                      <span className="font-medium text-foreground">{animal.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {roleLabels[animal.role]}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {speciesLabels[animal.species]}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">{animal.breed || "—"}</td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {sexLabels[animal.sex]}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground-muted">
                    {shortDate(animal.birth_date)}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {animal.color || "—"}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {statusLabels[animal.status]}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {animal.is_lof ? "Oui" : "Non"}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {animal.litter_id && animal.litterTitle ? (
                      <Link
                        href={`/admin/portees/${animal.litter_id}`}
                        className="hover:text-gold-soft"
                      >
                        {animal.litterTitle}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {animal.sireName || "—"}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {animal.damName || "—"}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {animal.lineage_label || "—"}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {animal.archived
                      ? "Archivé"
                      : animal.published
                        ? "Oui"
                        : "Non"}
                  </td>
                  <td className="px-3 py-3 text-foreground-muted">
                    {animal.photoCount}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={href}
                        className="rounded-md border border-gold/50 bg-gold/12 px-2.5 py-1 text-xs text-gold-soft hover:bg-gold/22"
                      >
                        Modifier
                      </Link>
                      {animal.role === "jeune" ? (
                        <Link
                          href={`${href}#photos`}
                          className="rounded-md border border-line px-2.5 py-1 text-xs text-foreground-muted hover:border-gold/40 hover:text-gold-soft"
                        >
                          Photos
                        </Link>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-foreground-muted">
            Aucun animal ne correspond.
          </p>
        ) : null}
      </div>
    </div>
  );
}
