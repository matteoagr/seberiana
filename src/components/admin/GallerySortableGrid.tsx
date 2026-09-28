"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reorderGalleryMediaAction } from "@/app/admin/actions";
import { MediaEditCard } from "@/components/admin/MediaEditCard";
import type { MediaRow } from "@/lib/supabase/types";

export function GallerySortableGrid({ items }: { items: MediaRow[] }) {
  const router = useRouter();
  const [ordered, setOrdered] = useState(items);
  const orderedRef = useRef(items);
  const draggingIdRef = useRef<string | null>(null);
  const overIdRef = useRef<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const itemsKey = items.map((item) => item.id).join(",");
  const didPersistRef = useRef(false);

  useEffect(() => {
    orderedRef.current = ordered;
  }, [ordered]);

  useEffect(() => {
    if (draggingIdRef.current != null) return;
    setOrdered(items);
    orderedRef.current = items;
  }, [items, itemsKey]);

  function moveItem(fromId: string, toId: string) {
    if (fromId === toId) return;
    setOrdered((prev) => {
      const from = prev.findIndex((item) => item.id === fromId);
      const to = prev.findIndex((item) => item.id === toId);
      if (from < 0 || to < 0 || from === to) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      orderedRef.current = next;
      return next;
    });
  }

  function persistOrder(next: MediaRow[]) {
    const nextIds = next.map((item) => item.id);
    const prevIds = items.map((item) => item.id);
    if (nextIds.length === 0) return;
    if (nextIds.every((id, index) => id === prevIds[index])) return;

    startTransition(async () => {
      setError(null);
      const result = await reorderGalleryMediaAction(nextIds);
      if (!result.ok) {
        setError(result.error);
        setOrdered(items);
        orderedRef.current = items;
        return;
      }
      router.refresh();
    });
  }

  function finishDrag() {
    if (didPersistRef.current) return;
    didPersistRef.current = true;
    draggingIdRef.current = null;
    overIdRef.current = null;
    setDraggingId(null);
    setOverId(null);
    persistOrder(orderedRef.current);
  }

  if (ordered.length === 0) {
    return (
      <p className="mt-4 text-sm text-foreground-muted">Aucune photo de galerie.</p>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <p className="text-sm text-foreground-muted">
        Glissez les cartes par la poignée{" "}
        <span className="font-medium text-foreground/80">⋮⋮</span> pour définir l’ordre
        d’affichage sur la galerie publique.
        {pending ? (
          <span className="ml-2 text-gold-soft">Enregistrement…</span>
        ) : null}
      </p>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((item, index) => (
          <MediaEditCard
            key={item.id}
            item={item}
            hideSortOrder
            orderBadge={index + 1}
            isDragging={draggingId === item.id}
            isDragOver={overId === item.id && draggingId !== item.id}
            onDragHandleStart={(event) => {
              didPersistRef.current = false;
              draggingIdRef.current = item.id;
              overIdRef.current = item.id;
              setDraggingId(item.id);
              setOverId(item.id);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", item.id);
            }}
            onDragOverCard={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              const fromId = draggingIdRef.current;
              if (!fromId || fromId === item.id) return;
              if (overIdRef.current === item.id) return;
              overIdRef.current = item.id;
              setOverId(item.id);
              moveItem(fromId, item.id);
            }}
            onDropCard={(event) => {
              event.preventDefault();
              finishDrag();
            }}
            onDragEnd={() => {
              finishDrag();
            }}
          />
        ))}
      </ul>
    </div>
  );
}
