import type {
  AnimalRole,
  AnimalSex,
  AnimalStatus,
  LitterStatus,
  Species,
} from "@/lib/supabase/types";

export { breedsBySpecies } from "@/data/breeds";

export const statusLabels: Record<AnimalStatus, string> = {
  disponible: "Disponible",
  reserve: "Réservé",
  adopte: "Adopté",
};

export const statusOrder: Record<AnimalStatus, number> = {
  disponible: 0,
  reserve: 1,
  adopte: 2,
};

export const speciesLabels: Record<Species, string> = {
  canin: "Chien",
  felin: "Chat",
};

export const sexLabels: Record<AnimalSex, "Mâle" | "Femelle"> = {
  male: "Mâle",
  female: "Femelle",
};

export const roleLabels: Record<AnimalRole, string> = {
  reproducteur: "Reproducteur",
  jeune: "Jeune",
  autre: "Autre",
};

export const litterStatusLabels: Record<LitterStatus, string> = {
  a_venir: "À venir",
  nee: "Née",
  cloturee: "Clôturée",
};

export const galleryKeyLabels: Record<string, string> = {
  accueil: "Accueil",
  elevage_canin: "Élevage canin",
  elevage_felin: "Élevage félin",
  domaine: "Domaine",
};

export function formatBirthDate(iso: string | null | undefined): string {
  if (!iso) return "Date inconnue";
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatLitterDate(iso: string | null | undefined, status: LitterStatus): string {
  if (!iso) {
    return status === "a_venir" ? "Naissance à venir" : "Date à préciser";
  }
  const formatted = formatBirthDate(iso);
  if (status === "a_venir") return `Prévue le ${formatted}`;
  return `Née le ${formatted}`;
}
