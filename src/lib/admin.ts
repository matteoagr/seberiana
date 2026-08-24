import type { AnimalRole } from "@/lib/supabase/types";

export function adminAnimalEditHref(animal: {
  id: string;
  role: AnimalRole;
  litter_id: string | null;
}): string {
  if (animal.role === "reproducteur") return `/admin/reproducteurs/${animal.id}`;
  if (animal.litter_id) {
    return `/admin/portees/${animal.litter_id}/jeunes/${animal.id}`;
  }
  return `/admin/reproducteurs/${animal.id}`;
}
