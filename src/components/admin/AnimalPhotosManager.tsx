"use client";

import { useActionState } from "react";
import Image from "next/image";
import {
  deleteAnimalPhotoFormAction,
  setAnimalCoverFormAction,
  uploadAnimalPhotosAction,
  type ActionResult,
} from "@/app/admin/actions";
import { resolveMediaUrl } from "@/lib/supabase/storage";
import type { MediaRow } from "@/lib/supabase/types";

const fieldClass =
  "mt-2 w-full rounded-lg border border-line bg-background px-4 py-2.5 text-sm outline-none focus:border-gold/50";

export function AnimalPhotosManager({
  animalId,
  animalName,
  litterId,
  photos,
}: {
  animalId: string;
  animalName: string;
  litterId?: string;
  photos: MediaRow[];
}) {
  const [uploadState, uploadAction, uploadPending] = useActionState<
    ActionResult | null,
    FormData
  >(uploadAnimalPhotosAction, null);

  return (
    <section id="photos" className="mt-14 scroll-mt-8 space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-foreground">Photos de {animalName}</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Ajoutez autant de photos que vous voulez. La photo « Couverture » s’affiche
          sur l’annuaire et les cartes du site.
        </p>
      </div>

      <form
        action={uploadAction}
        encType="multipart/form-data"
        className="space-y-4 rounded-xl border border-line/60 bg-background-elevated/40 p-6"
      >
        <input type="hidden" name="animal_id" value={animalId} />
        {litterId ? <input type="hidden" name="litter_id" value={litterId} /> : null}
        <div>
          <label className="block text-sm text-gold/90" htmlFor="files">
            Ajouter des photos
          </label>
          <input
            id="files"
            name="files"
            type="file"
            accept="image/*"
            multiple
            required={photos.length === 0}
            className={fieldClass}
          />
          <p className="mt-2 text-xs text-foreground-muted">
            Vous pouvez en sélectionner plusieurs d’un coup.
          </p>
        </div>
        {uploadState && !uploadState.ok ? (
          <p className="text-sm text-red-300">{uploadState.error}</p>
        ) : uploadState?.ok ? (
          <p className="text-sm text-gold-soft">Photos ajoutées.</p>
        ) : null}
        <button
          type="submit"
          disabled={uploadPending}
          className="rounded-lg border border-gold/50 bg-gold/12 px-5 py-2.5 text-sm text-gold-soft hover:bg-gold/22 disabled:opacity-60"
        >
          {uploadPending ? "Envoi…" : "Téléverser"}
        </button>
      </form>

      {photos.length === 0 ? (
        <p className="text-sm text-foreground-muted">Aucune photo pour l’instant.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => {
            const src = resolveMediaUrl(photo.storage_path, "animals");
            return (
              <li
                key={photo.id}
                className="overflow-hidden rounded-xl border border-line/60 bg-background-elevated/40"
              >
                <div className="relative aspect-square">
                  <Image
                    src={src}
                    alt={photo.alt_text || animalName}
                    fill
                    className="object-cover"
                  />
                  {photo.is_cover ? (
                    <span className="absolute top-2 left-2 rounded-md bg-gold/90 px-2 py-0.5 text-[11px] font-medium text-background">
                      Couverture
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3 p-3 text-sm">
                  {!photo.is_cover ? (
                    <form action={setAnimalCoverFormAction}>
                      <input type="hidden" name="media_id" value={photo.id} />
                      <input type="hidden" name="animal_id" value={animalId} />
                      {litterId ? (
                        <input type="hidden" name="litter_id" value={litterId} />
                      ) : null}
                      <button
                        type="submit"
                        className="text-gold-soft hover:text-gold"
                      >
                        Mettre en couverture
                      </button>
                    </form>
                  ) : null}
                  <form action={deleteAnimalPhotoFormAction}>
                    <input type="hidden" name="id" value={photo.id} />
                    <input type="hidden" name="storage_path" value={photo.storage_path} />
                    {litterId ? (
                      <input type="hidden" name="litter_id" value={litterId} />
                    ) : null}
                    <button
                      type="submit"
                      className="text-red-300/90 hover:text-red-200"
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
