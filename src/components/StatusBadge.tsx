import type { AnimalStatus } from "@/lib/supabase/types";
import { statusLabels } from "@/lib/labels";

const styles: Record<AnimalStatus, string> = {
  disponible: "border-gold/50 text-gold-soft bg-gold/10",
  reserve: "border-foreground-muted/40 text-foreground-muted bg-foreground/5",
  adopte: "border-line text-foreground-muted/80 bg-transparent",
};

export function StatusBadge({ status }: { status: AnimalStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
