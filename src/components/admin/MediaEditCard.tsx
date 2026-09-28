"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  deleteMediaFormAction,
  updateMediaAction,
  type ActionResult,
} from "@/app/admin/actions";
import { galleryKeyLabels, galleryTagLabels } from "@/lib/labels";
import { resolveMediaUrl } from "@/lib/supabase/storage";
import {
  GALLERY_TAGS,
  type MediaRow,
} from "@/lib/supabase/types";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:border-gold/50";
const labelClass = "block text-xs text-gold/90";

export function MediaEditCard({
  item,
  hideSortOrder = false,
  orderBadge,
  isDragging = false,
  isDragOver = false,
  onDragHandleStart,
  onDragOverCard,
  onDropCard,
  onDragEnd,
}: {
  item: MediaRow;
  hideSortOrder?: boolean;
  orderBadge?: number;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragHandleStart?: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragOverCard?: (event: React.DragEvent<HTMLLIElement>) => void;
  onDropCard?: (event: React.DragEvent<HTMLLIElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLButtonElement>) => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    updateMediaAction,
    null,
  );

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  const bucket = item.animal_id ? "animals" : item.litter_id ? "litters" : "galleries";
  const src = resolveMediaUrl(item.storage_path, bucket);
  const assignment = item.gallery_key
    ? galleryKeyLabels[item.gallery_key] || item.gallery_key
    : item.animal_id
      ? "Animal"
      : item.litter_id
        ? "Portée"
        : "Média";
  const isGalleryItem = Boolean(item.gallery_key);
  const sortable = Boolean(onDragHandleStart);

  return (
    <li
      className={`overflow-hidden rounded-xl border bg-background-elevated/40 transition-[border-color,opacity,transform] ${
        isDragging
          ? "border-gold/50 opacity-55"
          : isDragOver
            ? "border-gold/45 ring-1 ring-gold/30"
            : "border-line/60"
      }`}
      onDragOver={onDragOverCard}
      onDrop={onDropCard}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={src}
          alt={item.alt_text || "Média"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {sortable ? (
          <button
            type="button"
            draggable
            aria-label={`Déplacer la photo ${orderBadge ?? ""}`.trim()}
            title="Glisser pour réordonner"
            onDragStart={onDragHandleStart}
            onDragEnd={onDragEnd}
            className="absolute top-3 left-3 z-10 inline-flex cursor-grab items-center gap-1.5 rounded-md bg-[#14110e]/88 px-2 py-1.5 text-[11px] font-medium tracking-wide text-gold-soft shadow-[0_2px_10px_rgba(0,0,0,0.45)] ring-1 ring-gold/35 backdrop-blur-md active:cursor-grabbing"
          >
            <span aria-hidden className="leading-none">
              ⋮⋮
            </span>
            {typeof orderBadge === "number" ? (
              <span className="tabular-nums">{orderBadge}</span>
            ) : null}
          </button>
        ) : null}
      </div>

      <form action={formAction} className="space-y-3 p-4 text-sm">
        <input type="hidden" name="id" value={item.id} />

        <p className="text-xs text-foreground-muted">
          {assignment}
          {item.gallery_tag
            ? ` · ${galleryTagLabels[item.gallery_tag] ?? item.gallery_tag}`
            : ""}
        </p>

        <div>
          <label className={labelClass} htmlFor={`alt-${item.id}`}>
            Légende / alt
          </label>
          <input
            id={`alt-${item.id}`}
            name="alt_text"
            defaultValue={item.alt_text ?? ""}
            placeholder="Description de la photo"
            className={fieldClass}
          />
        </div>

        {isGalleryItem ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor={`key-${item.id}`}>
                Galerie
              </label>
              <select
                id={`key-${item.id}`}
                name="gallery_key"
                defaultValue={item.gallery_key ?? "accueil"}
                className={fieldClass}
              >
                <option value="">—</option>
                {Object.entries(galleryKeyLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor={`tag-${item.id}`}>
                Catégorie
              </label>
              <select
                id={`tag-${item.id}`}
                name="gallery_tag"
                defaultValue={item.gallery_tag ?? ""}
                className={fieldClass}
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
        ) : (
          <>
            <input type="hidden" name="gallery_key" value="" />
            <input type="hidden" name="gallery_tag" value="" />
          </>
        )}

        <div className={`grid gap-3 ${hideSortOrder ? "" : "grid-cols-2"}`}>
          {hideSortOrder ? null : (
            <div>
              <label className={labelClass} htmlFor={`sort-${item.id}`}>
                Ordre
              </label>
              <input
                id={`sort-${item.id}`}
                name="sort_order"
                type="number"
                defaultValue={item.sort_order ?? 0}
                className={fieldClass}
              />
            </div>
          )}
          <div>
            <label className={labelClass} htmlFor={`file-${item.id}`}>
              Remplacer
            </label>
            <input
              id={`file-${item.id}`}
              name="file"
              type="file"
              accept="image/*"
              className={`${fieldClass} px-2 py-1.5 file:mr-2 file:rounded file:border-0 file:bg-gold/15 file:px-2 file:py-1 file:text-xs file:text-gold-soft`}
            />
          </div>
        </div>

        {state && !state.ok ? (
          <p className="text-xs text-red-300">{state.error}</p>
        ) : state?.ok ? (
          <p className="text-xs text-gold-soft">Enregistré.</p>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-gold/50 bg-gold/12 px-3 py-1.5 text-xs text-gold-soft hover:bg-gold/22 disabled:opacity-60"
          >
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>

      <div className="border-t border-line/40 px-4 py-3">
        <form action={deleteMediaFormAction}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="storage_path" value={item.storage_path} />
          <button type="submit" className="text-xs text-red-300/90 hover:text-red-200">
            Supprimer
          </button>
        </form>
      </div>
    </li>
  );
}
