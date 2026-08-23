import "server-only";

import { sexLabels, statusOrder } from "@/lib/labels";
import { createClient } from "@/lib/supabase/server";
import { animalCoverUrl, litterCoverUrl, resolveMediaUrl } from "@/lib/supabase/storage";
import type {
  AnimalCardModel,
  AnimalRow,
  AnimalStatus,
  GalleryImage,
  LitterCardModel,
  LitterRow,
  MediaRow,
  Species,
} from "@/lib/supabase/types";

type AnimalWithParents = AnimalRow & {
  sire: { id: string; name: string } | null;
  dam: { id: string; name: string } | null;
};

function mapAnimal(row: AnimalWithParents): AnimalCardModel {
  const sireName = row.sire?.name ?? null;
  const damName = row.dam?.name ?? null;
  const parentsLabel =
    sireName && damName
      ? `${sireName} × ${damName}`
      : sireName || damName || null;

  return {
    id: row.id,
    name: row.name,
    species: row.species,
    breed: row.breed,
    sex: sexLabels[row.sex],
    sexRaw: row.sex,
    birthDate: row.birth_date,
    color: row.color,
    status: row.status,
    role: row.role,
    isLof: row.is_lof,
    lineage: row.lineage_label || parentsLabel || row.breed,
    description: row.description,
    image: animalCoverUrl(row),
    parentsLabel,
    sireName,
    damName,
  };
}

function sortByAvailability(animals: AnimalCardModel[]): AnimalCardModel[] {
  return [...animals].sort((a, b) => {
    const byStatus = statusOrder[a.status] - statusOrder[b.status];
    if (byStatus !== 0) return byStatus;
    return a.name.localeCompare(b.name, "fr");
  });
}

const animalSelect = `
  *,
  sire:animals!sire_id(id, name),
  dam:animals!dam_id(id, name)
`;

export async function getAnimals(filters?: {
  species?: Species;
  breed?: string;
  status?: AnimalStatus;
  role?: AnimalRow["role"];
}): Promise<AnimalCardModel[]> {
  const supabase = await createClient();
  let query = supabase
    .from("animals")
    .select(animalSelect)
    .eq("published", true)
    .eq("archived", false);

  if (filters?.species) query = query.eq("species", filters.species);
  if (filters?.breed) query = query.eq("breed", filters.breed);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.role) query = query.eq("role", filters.role);

  const { data, error } = await query.order("name", { ascending: true });
  if (error) {
    console.error("getAnimals", error.message);
    return [];
  }

  return sortByAvailability((data as AnimalWithParents[] | null)?.map(mapAnimal) ?? []);
}

export async function getAvailableCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("animals")
    .select("id", { count: "exact", head: true })
    .eq("published", true)
    .eq("archived", false)
    .eq("status", "disponible");

  if (error) {
    console.error("getAvailableCount", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function getBreeders(species: Species): Promise<AnimalCardModel[]> {
  return getAnimals({ species, role: "reproducteur" });
}

export async function getLittersWithYoung(): Promise<LitterCardModel[]> {
  const supabase = await createClient();

  const { data: litters, error } = await supabase
    .from("litters")
    .select(
      `
      *,
      sire:animals!litters_sire_id_fkey(id, name),
      dam:animals!litters_dam_id_fkey(id, name)
    `,
    )
    .eq("published", true)
    .eq("archived", false)
    .order("birth_date", { ascending: false });

  if (error) {
    console.error("getLittersWithYoung", error.message);
    return [];
  }

  const litterRows = (litters ?? []) as (LitterRow & {
    sire: { id: string; name: string } | null;
    dam: { id: string; name: string } | null;
  })[];

  if (litterRows.length === 0) return [];

  const litterIds = litterRows.map((l) => l.id);
  const { data: young, error: youngError } = await supabase
    .from("animals")
    .select(animalSelect)
    .in("litter_id", litterIds)
    .eq("published", true)
    .eq("archived", false);

  if (youngError) {
    console.error("getLittersWithYoung animals", youngError.message);
  }

  const youngByLitter = new Map<string, AnimalCardModel[]>();
  for (const row of (young as AnimalWithParents[] | null) ?? []) {
    if (!row.litter_id) continue;
    const list = youngByLitter.get(row.litter_id) ?? [];
    list.push(mapAnimal(row));
    youngByLitter.set(row.litter_id, list);
  }

  return litterRows.map((litter) => {
    const animals = sortByAvailability(youngByLitter.get(litter.id) ?? []);
    const sireName = litter.sire?.name;
    const damName = litter.dam?.name;
    const parentsLabel =
      sireName && damName
        ? `${sireName} × ${damName}`
        : sireName || damName || "Parents à préciser";

    return {
      id: litter.id,
      title: litter.title,
      species: litter.species,
      breed: litter.breed,
      birthDate: litter.birth_date,
      status: litter.status,
      description: litter.description,
      image: litterCoverUrl(litter),
      parentsLabel,
      availableCount: animals.filter((a) => a.status === "disponible").length,
      animals,
    };
  });
}

export async function getGalleryImages(galleryKey: string): Promise<GalleryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("gallery_key", galleryKey)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getGalleryImages", error.message);
    return [];
  }

  return ((data as MediaRow[] | null) ?? []).map((row) => ({
    src: resolveMediaUrl(row.storage_path, "galleries"),
    alt: row.alt_text || galleryKey,
  }));
}

export async function pingSupabase() {
  const supabase = await createClient();
  const { error } = await supabase.from("animals").select("id").limit(1);
  return { ok: !error, error: error?.message ?? null };
}

/** Admin lists (includes unpublished / archived) */
export async function adminListAnimals(): Promise<AnimalRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("animals")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AnimalRow[];
}

export async function adminListBreeders(): Promise<AnimalRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("animals")
    .select("*")
    .eq("role", "reproducteur")
    .order("species")
    .order("name");
  if (error) throw error;
  return (data ?? []) as AnimalRow[];
}

export async function adminGetAnimal(id: string): Promise<AnimalRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("animals")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as AnimalRow | null;
}

export type AdminLitterSummary = LitterRow & {
  youngCount: number;
  availableCount: number;
  sireName: string | null;
  damName: string | null;
};

export type AdminLitterDetail = LitterRow & {
  sire: { id: string; name: string } | null;
  dam: { id: string; name: string } | null;
  young: AnimalRow[];
};

export async function adminListLitters(): Promise<AdminLitterSummary[]> {
  const supabase = await createClient();
  const { data: litters, error } = await supabase
    .from("litters")
    .select(
      `
      *,
      sire:animals!litters_sire_id_fkey(id, name),
      dam:animals!litters_dam_id_fkey(id, name)
    `,
    )
    .order("birth_date", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) throw error;

  const rows = (litters ?? []) as (LitterRow & {
    sire: { id: string; name: string } | null;
    dam: { id: string; name: string } | null;
  })[];

  if (rows.length === 0) return [];

  const litterIds = rows.map((l) => l.id);
  const { data: young, error: youngError } = await supabase
    .from("animals")
    .select("id, litter_id, status")
    .in("litter_id", litterIds)
    .eq("archived", false);

  if (youngError) throw youngError;

  const stats = new Map<string, { total: number; available: number }>();
  for (const row of young ?? []) {
    if (!row.litter_id) continue;
    const current = stats.get(row.litter_id) ?? { total: 0, available: 0 };
    current.total += 1;
    if (row.status === "disponible") current.available += 1;
    stats.set(row.litter_id, current);
  }

  return rows.map((litter) => {
    const s = stats.get(litter.id) ?? { total: 0, available: 0 };
    return {
      ...litter,
      youngCount: s.total,
      availableCount: s.available,
      sireName: litter.sire?.name ?? null,
      damName: litter.dam?.name ?? null,
    };
  });
}

export async function adminGetLitterDetail(id: string): Promise<AdminLitterDetail | null> {
  const supabase = await createClient();
  const { data: litter, error } = await supabase
    .from("litters")
    .select(
      `
      *,
      sire:animals!litters_sire_id_fkey(id, name),
      dam:animals!litters_dam_id_fkey(id, name)
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!litter) return null;

  const { data: young, error: youngError } = await supabase
    .from("animals")
    .select("*")
    .eq("litter_id", id)
    .eq("archived", false)
    .order("name");

  if (youngError) throw youngError;

  return {
    ...(litter as LitterRow & {
      sire: { id: string; name: string } | null;
      dam: { id: string; name: string } | null;
    }),
    young: (young ?? []) as AnimalRow[],
  };
}

export async function adminGetLitter(id: string): Promise<LitterRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("litters")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as LitterRow | null;
}

export async function adminListAnimalMedia(animalId: string): Promise<MediaRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("animal_id", animalId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MediaRow[];
}

export async function adminMediaCountsByAnimal(
  animalIds: string[],
): Promise<Record<string, number>> {
  if (animalIds.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("animal_id")
    .in("animal_id", animalIds);
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (!row.animal_id) continue;
    counts[row.animal_id] = (counts[row.animal_id] ?? 0) + 1;
  }
  return counts;
}

export async function adminListMedia(): Promise<MediaRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MediaRow[];
}

export async function adminAnimalOptions(): Promise<
  Pick<AnimalRow, "id" | "name" | "species" | "breed" | "sex" | "role">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("animals")
    .select("id, name, species, breed, sex, role")
    .eq("archived", false)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function adminLitterOptions(): Promise<
  Pick<LitterRow, "id" | "title" | "species" | "breed">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("litters")
    .select("id, title, species, breed")
    .eq("archived", false)
    .order("title");
  if (error) throw error;
  return data ?? [];
}
