"use client";

import { useActionState } from "react";
import {
  createMediaAction,
  type ActionResult,
} from "@/app/admin/actions";
import { MediaEditCard } from "@/components/admin/MediaEditCard";
import { galleryKeyLabels, galleryTagLabels } from "@/lib/labels";
import { GALLERY_TAGS, type AnimalRow, type LitterRow, type MediaRow } from "@/lib/supabase/types";

const fieldClass =
  "mt-2 w-full rounded-lg border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-gold/50";

export function MediaAdmin({
  media,
  animals,
  litters,
}: {
  media: MediaRow[];
  animals: Pick<AnimalRow, "id" | "name">[];
  litters: Pick<LitterRow, "id" | "title">[];
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createMediaAction,
    null,
  );

  const galleryMedia = media.filter((item) => item.gallery_key);
  const otherMedia = media.filter((item) => !item.gallery_key);

  return (
    <div className="space-y-12">
      <form
        action={formAction}
        className="space-y-5 rounded-xl border border-line/60 bg-background-elevated/40 p-6"
      >
        <h2 className="font-serif text-xl text-foreground">Ajouter un média</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-gold/90" htmlFor="file">
              Fichier
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gold/90" htmlFor="alt_text">
              Légende / alt
            </label>
            <input
              id="alt_text"
              name="alt_text"
              placeholder="Ex. Chiots en socialisation au parc"
              className={fieldClass}
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm text-gold/90" htmlFor="animal_id">
              Animal
            </label>
            <select id="animal_id" name="animal_id" className={fieldClass} defaultValue="">
              <option value="">—</option>
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gold/90" htmlFor="litter_id">
              Portée
            </label>
            <select id="litter_id" name="litter_id" className={fieldClass} defaultValue="">
              <option value="">—</option>
              {litters.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gold/90" htmlFor="gallery_key">
              Galerie
            </label>
            <select
              id="gallery_key"
              name="gallery_key"
              className={fieldClass}
              defaultValue="accueil"
            >
              <option value="">— (animal / portée uniquement)</option>
              {Object.entries(galleryKeyLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gold/90" htmlFor="gallery_tag">
              Catégorie (filtre)
            </label>
            <select
              id="gallery_tag"
              name="gallery_tag"
              className={fieldClass}
              defaultValue="pomsky"
            >
              <option value="">—</option>
              {GALLERY_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {galleryTagLabels[tag]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gold/90" htmlFor="sort_order">
            Ordre d’affichage
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={0}
            className={`${fieldClass} w-24`}
          />
        </div>
        {state && !state.ok ? (
          <p className="text-sm text-red-300">{state.error}</p>
        ) : state?.ok ? (
          <p className="text-sm text-gold-soft">Média ajouté.</p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-gold/50 bg-gold/12 px-5 py-2.5 text-sm text-gold-soft hover:bg-gold/22 disabled:opacity-60"
        >
          {pending ? "Envoi…" : "Téléverser"}
        </button>
      </form>

      <div>
        <h2 className="font-serif text-xl text-foreground">Galerie publique</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Modifiez la légende, la catégorie, l’ordre, ou remplacez le fichier image.
        </p>
        {galleryMedia.length === 0 ? (
          <p className="mt-4 text-sm text-foreground-muted">Aucune photo de galerie.</p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryMedia.map((item) => (
              <MediaEditCard key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>

      {otherMedia.length > 0 ? (
        <div>
          <h2 className="font-serif text-xl text-foreground">Autres médias</h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Photos liées à un animal ou une portée.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherMedia.map((item) => (
              <MediaEditCard key={item.id} item={item} />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
