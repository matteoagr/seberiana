import type { AnimalStatus } from "@/lib/supabase/types";
import { statusLabels } from "@/lib/labels";

const styles: Record<
  AnimalStatus,
  { chip: string; dot: string }
> = {
  disponible: {
    chip: "text-gold-soft ring-gold/45",
    dot: "bg-gold shadow-[0_0_6px_rgba(212,160,74,0.55)]",
  },
  reserve: {
    chip: "text-[#e8c9a0] ring-[#c4a06a]/40",
    dot: "bg-[#c4a06a]",
  },
  adopte: {
    chip: "text-foreground-muted ring-line",
    dot: "bg-foreground-muted/70",
  },
};

type StatusBadgeProps = {
  status: AnimalStatus;
  /** Sur photo : fond opaque + ombre. Sous la carte : version plus légère. */
  onMedia?: boolean;
};

export function StatusBadge({ status, onMedia = false }: StatusBadgeProps) {
  const style = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ring-1 ${style.chip} ${
        onMedia
          ? "bg-[#14110e]/92 shadow-[0_2px_10px_rgba(0,0,0,0.45)] backdrop-blur-md"
          : "bg-background-elevated/90"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
        aria-hidden
      />
      {statusLabels[status]}
    </span>
  );
}
