"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { GalleryFilters } from "@/components/GalleryFilters";
import { GalleryGrid } from "@/components/GalleryGrid";
import { galleryTagLabels } from "@/lib/labels";
import { GALLERY_TAGS, type GalleryImage, type GalleryTag } from "@/lib/supabase/types";

function parseGalleryTag(value: string | null): GalleryTag | undefined {
  if (!value) return undefined;
  return GALLERY_TAGS.includes(value as GalleryTag) ? (value as GalleryTag) : undefined;
}

export function GalleryBrowser({ images: allImages }: { images: GalleryImage[] }) {
  const searchParams = useSearchParams();
  const activeTag = parseGalleryTag(searchParams.get("tag"));

  const availableTags = useMemo(
    () => GALLERY_TAGS.filter((tag) => allImages.some((image) => image.tag === tag)),
    [allImages],
  );

  const images = useMemo(
    () => (activeTag ? allImages.filter((image) => image.tag === activeTag) : allImages),
    [allImages, activeTag],
  );

  const filterLabel = activeTag ? galleryTagLabels[activeTag] : null;

  return (
    <>
      <GalleryFilters activeTag={activeTag} availableTags={availableTags} />
      <p className="mt-6 text-sm text-foreground-muted">
        {images.length} photo{images.length > 1 ? "s" : ""}
        {filterLabel ? ` · ${filterLabel}` : ""}
      </p>
      <div className="mt-8">
        {images.length > 0 ? (
          <GalleryGrid images={images} variant="full" />
        ) : (
          <p className="text-sm text-foreground-muted">
            Aucune photo pour ce filtre pour le moment.
          </p>
        )}
      </div>
    </>
  );
}
