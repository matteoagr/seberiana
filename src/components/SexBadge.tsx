import { sexLabels } from "@/lib/labels";
import type { AnimalSex } from "@/lib/supabase/types";

type SexBadgeProps = {
  sex: AnimalSex;
  /** Sur photo : fond opaque + ombre. Sous la carte : version plus légère. */
  onMedia?: boolean;
};

export function SexBadge({ sex, onMedia = false }: SexBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ring-1 text-foreground/90 ring-line/80 ${
        onMedia
          ? "bg-[#14110e]/92 shadow-[0_2px_10px_rgba(0,0,0,0.45)] backdrop-blur-md"
          : "bg-background-elevated/90"
      }`}
    >
      {sexLabels[sex]}
    </span>
  );
}
