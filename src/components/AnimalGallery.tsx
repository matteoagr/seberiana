"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { GalleryImage } from "@/lib/supabase/types";

type AnimalGalleryProps = {
  photos: GalleryImage[];
  animalName: string;
};

export function AnimalGallery({ photos, animalName }: AnimalGalleryProps) {
  const [index, setIndex] = useState(0);
  const total = photos.length;
  const current = photos[index] ?? photos[0];

  const goTo = useCallback(
    (next: number) => {
      if (total <= 1) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (total <= 1) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goTo(index + 1);
      if (event.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index, total]);

  if (!current) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line/60 bg-background-elevated sm:aspect-[5/6]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || animalName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#14110e]/85 text-foreground shadow-lg ring-1 ring-line backdrop-blur-md transition-colors hover:bg-[#14110e] hover:text-gold-soft"
              aria-label="Photo précédente"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#14110e]/85 text-foreground shadow-lg ring-1 ring-line backdrop-blur-md transition-colors hover:bg-[#14110e] hover:text-gold-soft"
              aria-label="Photo suivante"
            >
              →
            </button>
            <p className="absolute right-3 bottom-3 rounded-full bg-[#14110e]/85 px-2.5 py-1 text-[11px] text-foreground-muted backdrop-blur-md ring-1 ring-line">
              {index + 1} / {total}
            </p>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => {
            const active = i === index;
            return (
              <button
                key={`${photo.src}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Voir la photo ${i + 1}`}
                aria-current={active ? "true" : undefined}
                className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-lg ring-1 transition ${
                  active
                    ? "ring-gold/70"
                    : "ring-line/70 opacity-75 hover:opacity-100 hover:ring-gold/35"
                }`}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
