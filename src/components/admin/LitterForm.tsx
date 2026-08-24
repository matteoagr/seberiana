"use client";

import { useActionState } from "react";
import Link from "next/link";
import { upsertLitterAction, type ActionResult } from "@/app/admin/actions";
import {
  breedsBySpecies,
  litterStatusLabels,
  speciesLabels,
} from "@/lib/labels";
import type { AnimalRow, LitterRow, Species } from "@/lib/supabase/types";

const fieldClass =
  "mt-2 w-full rounded-lg border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-gold/50";
const labelClass = "block text-sm text-gold/90";

export function LitterForm({
  litter,
  breeders,
}: {
  litter?: LitterRow | null;
  breeders: Pick<AnimalRow, "id" | "name" | "sex" | "species">[];
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    upsertLitterAction,
    null,
  );

  const breedOptions = [...breedsBySpecies.canin, ...breedsBySpecies.felin];

  return (
    <form action={formAction} className="space-y-6" encType="multipart/form-data">
      {litter?.id ? <input type="hidden" name="id" value={litter.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="title">
            Titre
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={litter?.title ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="breed">
            Race
          </label>
          <input
            id="breed"
            name="breed"
            required
            list="litter-breed-list"
            defaultValue={litter?.breed ?? ""}
            className={fieldClass}
          />
          <datalist id="litter-breed-list">
            {breedOptions.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="species">
            Espèce
          </label>
          <select
            id="species"
            name="species"
            defaultValue={litter?.species ?? "canin"}
            className={fieldClass}
          >
            {(Object.keys(speciesLabels) as Species[]).map((s) => (
              <option key={s} value={s}>
                {speciesLabels[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="birth_date">
            Date de naissance
          </label>
          <input
            id="birth_date"
            name="birth_date"
            type="date"
            defaultValue={litter?.birth_date ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="status">
            Statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={litter?.status ?? "a_venir"}
            className={fieldClass}
          >
            {Object.entries(litterStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="sire_id">
            Père
          </label>
          <select
            id="sire_id"
            name="sire_id"
            defaultValue={litter?.sire_id ?? ""}
            className={fieldClass}
          >
            <option value="">—</option>
            {breeders
              .filter((a) => a.sex === "male")
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="dam_id">
            Mère
          </label>
          <select
            id="dam_id"
            name="dam_id"
            defaultValue={litter?.dam_id ?? ""}
            className={fieldClass}
          >
            <option value="">—</option>
            {breeders
              .filter((a) => a.sex === "female")
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={litter?.description ?? ""}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="cover_file">
          Image de couverture
        </label>
        <input
          id="cover_file"
          name="cover_file"
          type="file"
          accept="image/*"
          className={fieldClass}
        />
        {litter?.cover_image_path ? (
          <input type="hidden" name="cover_image_path" value={litter.cover_image_path} />
        ) : null}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm text-foreground-muted">
          <input
            type="checkbox"
            name="published"
            defaultChecked={litter?.published ?? true}
            className="accent-[var(--gold)]"
          />
          Publiée
        </label>
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-red-300">{state.error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-gold/50 bg-gold/12 px-5 py-2.5 text-sm text-gold-soft hover:bg-gold/22 disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <Link
          href="/admin/portees"
          className="rounded-lg border border-line px-5 py-2.5 text-sm text-foreground-muted hover:border-gold/40"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
