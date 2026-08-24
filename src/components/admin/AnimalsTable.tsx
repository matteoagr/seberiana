"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  updateAnimalRowAction,
  type ActionResult,
} from "@/app/admin/actions";
import { PhotoDropzone } from "@/components/admin/PhotoDropzone";
import { adminAnimalEditHref } from "@/lib/admin";
import {
  roleLabels,
  sexLabels,
  speciesLabels,
  statusLabels,
} from "@/lib/labels";
import { animalCoverUrl } from "@/lib/supabase/storage";
import type {
  AnimalRole,
  AnimalSex,
  AnimalStatus,
  Species,
} from "@/lib/supabase/types";
import type { AdminAnimalListItem } from "@/lib/supabase/queries";

const inputClass =
  "h-8 w-full min-w-[6.5rem] rounded-md border border-line bg-background px-2 text-xs text-foreground outline-none focus:border-gold/50";
const selectClass = inputClass;

type LitterOption = { id: string; title: string };

export function AnimalsTable({
  animals,
  litters,
}: {
  animals: AdminAnimalListItem[];
  litters: LitterOption[];
}) {
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
            className={`${inputClass} mt-1 w-56`}
          />
        </label>
        <label className="text-xs text-gold/90">
          Rôle
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`${selectClass} mt-1`}
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
            className={`${selectClass} mt-1`}
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
            className={`${selectClass} mt-1`}
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
          {filtered.length} animal{filtered.length > 1 ? "x" : ""}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line/60">
        <table className="w-full min-w-[1400px] text-left text-xs">
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
              <th className="px-3 py-3 font-medium">Archivé</th>
              <th className="px-3 py-3 font-medium">Description</th>
              <th className="px-3 py-3 font-medium">Photos</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((animal) => (
              <AnimalRowEditor
                key={animal.id}
                animal={animal}
                litters={litters}
              />
            ))}
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

function AnimalRowEditor({
  animal,
  litters,
}: {
  animal: AdminAnimalListItem;
  litters: LitterOption[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    updateAnimalRowAction,
    null,
  );

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <tr className="border-b border-line/40 align-top">
      <td className="sticky left-0 z-10 bg-background px-3 py-3">
        <form action={formAction} id={`animal-row-${animal.id}`} className="hidden"></form>
        <input type="hidden" name="id" value={animal.id} form={`animal-row-${animal.id}`} />
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
          <input
            name="name"
            required
            defaultValue={animal.name}
            form={`animal-row-${animal.id}`}
            className={`${inputClass} min-w-[7rem]`}
          />
        </div>
      </td>
      <td className="px-3 py-3">
        <select
          name="role"
          defaultValue={animal.role}
          form={`animal-row-${animal.id}`}
          className={selectClass}
        >
          {(Object.keys(roleLabels) as AnimalRole[]).map((value) => (
            <option key={value} value={value}>
              {roleLabels[value]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-3">
        <select
          name="species"
          defaultValue={animal.species}
          form={`animal-row-${animal.id}`}
          className={selectClass}
        >
          {(Object.keys(speciesLabels) as Species[]).map((value) => (
            <option key={value} value={value}>
              {speciesLabels[value]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-3">
        <input
          name="breed"
          required
          defaultValue={animal.breed}
          form={`animal-row-${animal.id}`}
          className={inputClass}
        />
      </td>
      <td className="px-3 py-3">
        <select
          name="sex"
          defaultValue={animal.sex}
          form={`animal-row-${animal.id}`}
          className={selectClass}
        >
          {(Object.keys(sexLabels) as AnimalSex[]).map((value) => (
            <option key={value} value={value}>
              {sexLabels[value]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-3">
        <input
          name="birth_date"
          type="date"
          defaultValue={animal.birth_date ?? ""}
          form={`animal-row-${animal.id}`}
          className={inputClass}
        />
      </td>
      <td className="px-3 py-3">
        <input
          name="color"
          defaultValue={animal.color}
          form={`animal-row-${animal.id}`}
          className={inputClass}
        />
      </td>
      <td className="px-3 py-3">
        <select
          name="status"
          defaultValue={animal.status}
          form={`animal-row-${animal.id}`}
          className={selectClass}
        >
          {(Object.keys(statusLabels) as AnimalStatus[]).map((value) => (
            <option key={value} value={value}>
              {statusLabels[value]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-3">
        <input
          type="checkbox"
          name="is_lof"
          defaultChecked={animal.is_lof}
          form={`animal-row-${animal.id}`}
          className="accent-[var(--gold)]"
        />
      </td>
      <td className="px-3 py-3">
        <select
          name="litter_id"
          defaultValue={animal.litter_id ?? ""}
          form={`animal-row-${animal.id}`}
          className={`${selectClass} min-w-[10rem]`}
        >
          <option value="">—</option>
          {litters.map((litter) => (
            <option key={litter.id} value={litter.id}>
              {litter.title}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-3 text-foreground-muted">{animal.sireName || "—"}</td>
      <td className="px-3 py-3 text-foreground-muted">{animal.damName || "—"}</td>
      <td className="px-3 py-3">
        <input
          name="lineage_label"
          defaultValue={animal.lineage_label}
          form={`animal-row-${animal.id}`}
          className={inputClass}
        />
      </td>
      <td className="px-3 py-3">
        <input
          type="checkbox"
          name="published"
          defaultChecked={animal.published}
          form={`animal-row-${animal.id}`}
          className="accent-[var(--gold)]"
        />
      </td>
      <td className="px-3 py-3">
        <input
          type="checkbox"
          name="archived"
          defaultChecked={animal.archived}
          form={`animal-row-${animal.id}`}
          className="accent-[var(--gold)]"
        />
      </td>
      <td className="px-3 py-3">
        <textarea
          name="description"
          rows={2}
          defaultValue={animal.description}
          form={`animal-row-${animal.id}`}
          className="w-44 rounded-md border border-line bg-background px-2 py-1 text-xs outline-none focus:border-gold/50"
        />
      </td>
      <td className="px-3 py-3 min-w-[160px]">
        <PhotoDropzone
          animalId={animal.id}
          litterId={animal.litter_id ?? undefined}
          compact
        />
        <p className="mt-1 text-[11px] text-foreground-muted">
          {animal.photoCount} photo{animal.photoCount > 1 ? "s" : ""}
        </p>
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            form={`animal-row-${animal.id}`}
            disabled={pending}
            className="rounded-md border border-gold/50 bg-gold/12 px-2 py-1 text-xs text-gold-soft hover:bg-gold/22 disabled:opacity-60"
          >
            {pending ? "…" : "Enregistrer"}
          </button>
          <Link
            href={adminAnimalEditHref(animal)}
            className="text-xs text-foreground-muted hover:text-gold-soft"
          >
            Fiche
          </Link>
          {state && !state.ok ? (
            <p className="text-[11px] text-red-300">{state.error}</p>
          ) : state?.ok ? (
            <p className="text-[11px] text-gold-soft">OK</p>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
