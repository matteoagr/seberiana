"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import type { GalleryImage } from "@/lib/supabase/types";

type GalleryGridProps = {
  images: GalleryImage[];
  /** Nombre max de vignettes affichées (lightbox parcourt toute la liste). */
  limit?: number;
  /** preview = home ; full = page galerie */
  variant?: "preview" | "full";
};

export function GalleryGrid({
  images,
  limit,
  variant = "full",
}: GalleryGridProps) {
  const labelId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = typeof limit === "number" ? images.slice(0, limit) : images;
  const total = images.length;
  const isOpen = openIndex !== null;
  const current = openIndex !== null ? images[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);

  const goTo = useCallback(
    (next: number) => {
      if (total <= 0) return;
      setOpenIndex(((next % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") goTo((openIndex ?? 0) + 1);
      if (event.key === "ArrowLeft") goTo((openIndex ?? 0) - 1);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [close, goTo, isOpen, openIndex]);

  if (visible.length === 0) return null;

  return (
    <>
      <div
        className={
          variant === "preview"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            : "grid auto-rows-[12rem] gap-3 sm:auto-rows-[14rem] sm:grid-cols-2 lg:auto-rows-[16rem] lg:grid-cols-3 lg:gap-4"
        }
      >
        {visible.map((image, index) => {
          const featured = variant === "full" && index % 7 === 0;

          return (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setOpenIndex(index)}
              className={`group relative overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
                variant === "preview"
                  ? "aspect-[4/5]"
                  : featured
                    ? "sm:col-span-2 sm:row-span-2"
                    : ""
              }`}
              aria-label={`Agrandir : ${image.alt || `photo ${index + 1}`}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes={
                  variant === "preview"
                    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    : featured
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 768px) 100vw, 33vw"
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
              {image.alt ? (
                <span className="absolute inset-x-0 bottom-0 p-3 text-left text-sm leading-snug text-foreground/95 sm:p-4">
                  {image.alt}
                </span>
              ) : null}
              <span className="absolute top-3 right-3 rounded-full bg-[#14110e]/80 px-2.5 py-1 text-[11px] text-gold-soft opacity-0 ring-1 ring-line/60 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                Agrandir
              </span>
            </button>
          );
        })}
      </div>

      {isOpen && current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0c0a08]/92 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#14110e]/90 text-lg text-foreground ring-1 ring-line transition-colors hover:text-gold-soft sm:top-6 sm:right-6"
            aria-label="Fermer"
          >
            ×
          </button>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goTo((openIndex ?? 0) - 1);
                }}
                className="absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#14110e]/90 text-foreground ring-1 ring-line transition-colors hover:text-gold-soft sm:left-6"
                aria-label="Photo précédente"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goTo((openIndex ?? 0) + 1);
                }}
                className="absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#14110e]/90 text-foreground ring-1 ring-line transition-colors hover:text-gold-soft sm:right-6"
                aria-label="Photo suivante"
              >
                →
              </button>
            </>
          ) : null}

          <div
            className="relative flex max-h-[min(88vh,900px)] w-full max-w-5xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-[50vh] flex-1 overflow-hidden sm:min-h-[60vh]">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4 px-1">
              <p id={labelId} className="text-sm leading-relaxed text-foreground/90">
                {current.alt || "Photo de la galerie"}
              </p>
              {total > 1 ? (
                <p className="shrink-0 text-xs text-foreground-muted">
                  {(openIndex ?? 0) + 1} / {total}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
