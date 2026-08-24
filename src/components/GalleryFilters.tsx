import Link from "next/link";
import { galleryTagLabels } from "@/lib/labels";
import type { GalleryTag } from "@/lib/supabase/types";

type GalleryFiltersProps = {
  activeTag?: GalleryTag;
  availableTags: GalleryTag[];
};

function buildHref(tag?: GalleryTag): string {
  if (!tag) return "/galerie";
  return `/galerie?tag=${tag}`;
}

export function GalleryFilters({ activeTag, availableTags }: GalleryFiltersProps) {
  if (availableTags.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <p className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-gold/85">
        Filtrer
      </p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrer la galerie">
        <Link
          href={buildHref()}
          scroll={false}
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs transition-colors ${
            !activeTag
              ? "bg-gold/12 text-gold-soft ring-1 ring-gold/25"
              : "text-foreground-muted hover:bg-background-elevated hover:text-foreground/90"
          }`}
        >
          Toutes
        </Link>
        {availableTags.map((tag) => (
          <Link
            key={tag}
            href={buildHref(tag)}
            scroll={false}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs transition-colors ${
              activeTag === tag
                ? "bg-gold/12 text-gold-soft ring-1 ring-gold/25"
                : "text-foreground-muted hover:bg-background-elevated hover:text-foreground/90"
            }`}
          >
            {galleryTagLabels[tag]}
          </Link>
        ))}
      </div>
    </div>
  );
}
