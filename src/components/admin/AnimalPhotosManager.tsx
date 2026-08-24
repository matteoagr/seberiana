"use client";

import Image from "next/image";
import {
  deleteAnimalPhotoFormAction,
  setAnimalCoverFormAction,
} from "@/app/admin/actions";
import { PhotoDropzone } from "@/components/admin/PhotoDropzone";
import { resolveMediaUrl } from "@/lib/supabase/storage";
import type { MediaRow } from "@/lib/supabase/types";

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
  return (
    <section id="photos" className="mt-14 scroll-mt-8 space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-foreground">Photos de {animalName}</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Déposez les images dans la zone ci-dessous — elles s’enregistrent
          immédiatement. Cliquez une photo pour en faire la couverture de l’annuaire.
        </p>
      </div>

      <PhotoDropzone animalId={animalId} litterId={litterId} />

      {photos.length === 0 ? (
        <p className="text-sm text-foreground-muted">Aucune photo pour l’instant.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              animalId={animalId}
              animalName={animalName}
              litterId={litterId}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function PhotoCard({
  photo,
  animalId,
  animalName,
  litterId,
}: {
  photo: MediaRow;
  animalId: string;
  animalName: string;
  litterId?: string;
}) {
  const src = resolveMediaUrl(photo.storage_path, "animals");

  return (
    <li className="overflow-hidden rounded-xl border border-line/60 bg-background-elevated/40">
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
            {litterId ? <input type="hidden" name="litter_id" value={litterId} /> : null}
            <button type="submit" className="text-gold-soft hover:text-gold">
              Mettre en couverture
            </button>
          </form>
        ) : null}
        <form action={deleteAnimalPhotoFormAction}>
          <input type="hidden" name="id" value={photo.id} />
          <input type="hidden" name="storage_path" value={photo.storage_path} />
          {litterId ? <input type="hidden" name="litter_id" value={litterId} /> : null}
          <button type="submit" className="text-red-300/90 hover:text-red-200">
            Supprimer
          </button>
        </form>
      </div>
    </li>
  );
}
