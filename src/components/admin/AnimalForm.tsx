"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  upsertAnimalAction,
  type ActionResult,
} from "@/app/admin/actions";
import {
  breedsBySpecies,
  sexLabels,
  speciesLabels,
  statusLabels,
} from "@/lib/labels";
import type { AnimalRow, LitterRow, Species } from "@/lib/supabase/types";

const fieldClass =
  "mt-2 w-full rounded-lg border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-gold/50";
const labelClass = "block text-sm text-gold/90";

export type AnimalFormVariant = "young" | "breeder";

type LitterDefaults = Pick<
  LitterRow,
  "id" | "species" | "breed" | "birth_date" | "sire_id" | "dam_id" | "title"
>;

export function AnimalForm({
  animal,
  variant,
  litter,
  returnTo,
  cancelHref,
}: {
  animal?: AnimalRow | null;
  variant: AnimalFormVariant;
  litter?: LitterDefaults | null;
  returnTo?: string;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    upsertAnimalAction,
    null,
  );

  const isYoung = variant === "young";
  const species = (animal?.species ?? litter?.species ?? "canin") as Species;
  const breed = animal?.breed ?? litter?.breed ?? "";
  const birthDate = animal?.birth_date ?? litter?.birth_date ?? "";
  const defaultLof =
    animal?.is_lof ?? (breed === "Shiba Inu" ? true : false);

  const breedOptions = [...breedsBySpecies.canin, ...breedsBySpecies.felin];

  return (
    <form action={formAction} className="space-y-6" encType="multipart/form-data">
      {animal?.id ? <input type="hidden" name="id" value={animal.id} /> : null}
      {returnTo ? <input type="hidden" name="return_to" value={returnTo} /> : null}
      <input type="hidden" name="role" value={isYoung ? "jeune" : "reproducteur"} />
      {isYoung && litter ? (
        <input type="hidden" name="litter_id" value={litter.id} />
      ) : null}
      {!isYoung ? <input type="hidden" name="status" value="adopte" /> : null}
      {isYoung && litter?.sire_id ? (
        <input type="hidden" name="sire_id" value={litter.sire_id} />
      ) : null}
      {isYoung && litter?.dam_id ? (
        <input type="hidden" name="dam_id" value={litter.dam_id} />
      ) : null}

      {isYoung && litter ? (
        <p className="rounded-lg border border-line/60 bg-background-elevated/40 px-4 py-3 text-sm text-foreground-muted">
          Portée : <span className="text-foreground">{litter.title}</span>
          {litter.breed ? ` · ${litter.breed}` : ""}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Nom
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={animal?.name ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="sex">
            Sexe
          </label>
          <select id="sex" name="sex" defaultValue={animal?.sex ?? "male"} className={fieldClass}>
            {Object.entries(sexLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isYoung ? (
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="species">
              Espèce
            </label>
            <select
              id="species"
              name="species"
              defaultValue={species}
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
            <label className={labelClass} htmlFor="breed">
              Race
            </label>
            <input
              id="breed"
              name="breed"
              required
              list="breed-list"
              defaultValue={breed}
              className={fieldClass}
            />
            <datalist id="breed-list">
              {breedOptions.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={labelClass} htmlFor="birth_date">
              Date de naissance
            </label>
            <input
              id="birth_date"
              name="birth_date"
              type="date"
              defaultValue={animal?.birth_date ?? ""}
              className={fieldClass}
            />
          </div>
        </div>
      ) : (
        <>
          <input type="hidden" name="species" value={species} />
          <input type="hidden" name="breed" value={breed} />
          <input type="hidden" name="birth_date" value={birthDate} />
        </>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="color">
            Couleur
          </label>
          <input
            id="color"
            name="color"
            defaultValue={animal?.color ?? ""}
            className={fieldClass}
          />
        </div>
        {isYoung ? (
          <div>
            <label className={labelClass} htmlFor="status">
              Disponibilité
            </label>
            <select
              id="status"
              name="status"
              defaultValue={animal?.status ?? "disponible"}
              className={fieldClass}
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 pb-2.5 text-sm text-foreground-muted">
              <input
                type="checkbox"
                name="is_lof"
                defaultChecked={defaultLof}
                className="accent-[var(--gold)]"
              />
              Inscrit LOF
            </label>
          </div>
        )}
      </div>

      {isYoung ? (
        <label className="inline-flex items-center gap-2 text-sm text-foreground-muted">
          <input
            type="checkbox"
            name="is_lof"
            defaultChecked={defaultLof}
            className="accent-[var(--gold)]"
          />
          LOF
        </label>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={animal?.description ?? ""}
          className={fieldClass}
        />
      </div>

      {!isYoung ? (
        <div>
          <label className={labelClass} htmlFor="cover_file">
            Photo
          </label>
          <input
            id="cover_file"
            name="cover_file"
            type="file"
            accept="image/*"
            className={fieldClass}
          />
          {animal?.cover_image_path ? (
            <input type="hidden" name="cover_image_path" value={animal.cover_image_path} />
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-foreground-muted">
          Les photos se gèrent juste en dessous — vous pouvez en ajouter autant que
          vous voulez après l’enregistrement.
        </p>
      )}

      <label className="inline-flex items-center gap-2 text-sm text-foreground-muted">
        <input
          type="checkbox"
          name="published"
          defaultChecked={animal?.published ?? true}
          className="accent-[var(--gold)]"
        />
        Visible sur le site
      </label>

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
          href={cancelHref}
          className="rounded-lg border border-line px-5 py-2.5 text-sm text-foreground-muted hover:border-gold/40"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
