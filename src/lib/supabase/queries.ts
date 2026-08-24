import "server-only";

import { sexLabels, statusOrder } from "@/lib/labels";
import { createAnonClient, createClient } from "@/lib/supabase/server";
import { animalCoverUrl, litterCoverUrl, resolveMediaUrl } from "@/lib/supabase/storage";
import type {
  AnimalCardModel,
  AnimalDetailModel,
  AnimalRow,
  AnimalStatus,
  GalleryImage,
  LitterCardModel,
  LitterRow,
  MediaRow,
  Species,
} from "@/lib/supabase/types";

type ParentJoin = {
  id: string;
  name: string;
  breed?: string;
  sex?: import("@/lib/supabase/types").AnimalSex;
  cover_image_path?: string | null;
  cover_url?: string | null;
  published?: boolean;
  archived?: boolean;
};

type AnimalWithParents = AnimalRow & {
  sire: ParentJoin | null;
  dam: ParentJoin | null;
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

const animalSelect = "*";

const parentFields =
  "id, name, breed, sex, cover_image_path, cover_url, published, archived";

function mapParent(
  parent: ParentJoin | ParentJoin[] | null | undefined,
): import("@/lib/supabase/types").ParentPreview | null {
  const row = Array.isArray(parent) ? parent[0] : parent;
  if (!row?.id || !row.name) return null;
  if (row.archived) return null;
  return {
    id: row.id,
    name: row.name,
    breed: row.breed || "",
    image: animalCoverUrl(row),
    published: Boolean(row.published),
    ...(row.sex ? { sex: row.sex } : {}),
  };
}

/** PostgREST self-joins on animals return [] — load parents by id instead. */
async function fetchParentsByIds(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sireId: string | null,
  damId: string | null,
): Promise<{ sire: ParentJoin | null; dam: ParentJoin | null }> {
  const ids = [sireId, damId].filter((id): id is string => Boolean(id));
  if (ids.length === 0) return { sire: null, dam: null };

  const { data, error } = await supabase
    .from("animals")
    .select(parentFields)
    .in("id", ids)
    .eq("archived", false);

  if (error) {
    console.error("fetchParentsByIds", error.message);
    return { sire: null, dam: null };
  }

  const byId = new Map(
    ((data as ParentJoin[] | null) ?? []).map((parent) => [parent.id, parent]),
  );

  return {
    sire: sireId ? byId.get(sireId) ?? null : null,
    dam: damId ? byId.get(damId) ?? null : null,
  };
}

/** Enfants publiés (père ou mère = animal courant). */
async function fetchOffspringByParentId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  parentId: string,
): Promise<ParentJoin[]> {
  const { data, error } = await supabase
    .from("animals")
    .select(parentFields)
    .or(`sire_id.eq.${parentId},dam_id.eq.${parentId}`)
    .eq("archived", false)
    .eq("published", true)
    .order("birth_date", { ascending: false, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("fetchOffspringByParentId", error.message);
    return [];
  }

  return (data as ParentJoin[] | null) ?? [];
}


/** Frères/sœurs publiés de la même portée (hors animal courant). */
async function fetchSiblingsByLitterId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  litterId: string | null,
  animalId: string,
): Promise<{ siblings: ParentJoin[]; litterTitle: string | null }> {
  if (!litterId) return { siblings: [], litterTitle: null };

  const [sibRes, litterRes] = await Promise.all([
    supabase
      .from("animals")
      .select(parentFields)
      .eq("litter_id", litterId)
      .neq("id", animalId)
      .eq("archived", false)
      .eq("published", true)
      .order("name", { ascending: true }),
    supabase
      .from("litters")
      .select("title")
      .eq("id", litterId)
      .maybeSingle(),
  ]);

  if (sibRes.error) {
    console.error("fetchSiblingsByLitterId", sibRes.error.message);
  }
  if (litterRes.error) {
    console.error("fetchSiblingsByLitterId litter", litterRes.error.message);
  }

  return {
    siblings: (sibRes.data as ParentJoin[] | null) ?? [],
    litterTitle: (litterRes.data as { title: string } | null)?.title ?? null,
  };
}

/** Profil public : jeunes publiés, ou reproducteurs (même non listés dans l’annuaire). */
function isPublicProfileVisible(animal: Pick<AnimalRow, "published" | "role">): boolean {
  return animal.published || animal.role === "reproducteur";
}

export async function getAnimals(filters?: {
  species?: Species;
  breed?: string;
  status?: AnimalStatus;
  role?: AnimalRow["role"];
}): Promise<AnimalCardModel[]> {
  try {
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

    return sortByAvailability(
      (data as AnimalWithParents[] | null)?.map(mapAnimal) ?? [],
    );
  } catch (error) {
    console.error("getAnimals", error);
    return [];
  }
}

export async function getAvailableCount(): Promise<number> {
  try {
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
  } catch (error) {
    console.error("getAvailableCount", error);
    return 0;
  }
}

export async function getPublicAnimalById(
  id: string,
): Promise<AnimalDetailModel | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("animals")
      .select("*")
      .eq("id", id)
      .eq("archived", false)
      .maybeSingle();

    if (error) {
      console.error("getPublicAnimalById", error.message);
      return null;
    }
    if (!data) return null;

    const base = data as AnimalRow;
    if (!isPublicProfileVisible(base)) return null;

    const [parents, offspringRows, siblingData] = await Promise.all([
      fetchParentsByIds(supabase, base.sire_id, base.dam_id),
      fetchOffspringByParentId(supabase, base.id),
      fetchSiblingsByLitterId(supabase, base.litter_id, base.id),
    ]);
    const row: AnimalWithParents = { ...base, ...parents };
    const animal = mapAnimal(row);

    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("animal_id", id)
      .order("is_cover", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (mediaError) {
      console.error("getPublicAnimalById media", mediaError.message);
    }

    const photosFromMedia = ((media as MediaRow[] | null) ?? []).map((rowMedia) => ({
      src: resolveMediaUrl(rowMedia.storage_path, "animals"),
      alt: rowMedia.alt_text || animal.name,
      tag: null,
    }));

    const photos =
      photosFromMedia.length > 0
        ? photosFromMedia
        : [{ src: animal.image, alt: animal.name, tag: null }];

    return {
      ...animal,
      photos,
      sire: mapParent(parents.sire),
      dam: mapParent(parents.dam),
      offspring: offspringRows
        .map((child) => mapParent(child))
        .filter((child): child is NonNullable<typeof child> => child !== null),
      siblings: siblingData.siblings
        .map((sib) => mapParent(sib))
        .filter((sib): sib is NonNullable<typeof sib> => sib !== null),
      litterTitle: siblingData.litterTitle,
    };
  } catch (error) {
    console.error("getPublicAnimalById", error);
    return null;
  }
}

export async function getPublicAnimalIds(): Promise<string[]> {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("animals")
      .select("id")
      .eq("published", true)
      .eq("archived", false);

    if (error) {
      console.error("getPublicAnimalIds", error.message);
      return [];
    }
    return (data ?? []).map((row) => row.id as string);
  } catch (error) {
    console.error("getPublicAnimalIds", error);
    return [];
  }
}

export async function getBreeders(species: Species): Promise<AnimalCardModel[]> {
  return getAnimals({ species, role: "reproducteur" });
}

export async function getLittersWithYoung(): Promise<LitterCardModel[]> {
  try {
    return await fetchLittersWithYoung();
  } catch (error) {
    console.error("getLittersWithYoung", error);
    return [];
  }
}

async function fetchLittersWithYoung(): Promise<LitterCardModel[]> {
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
    .is("deleted_at", null)
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
  try {
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
      tag: row.gallery_tag ?? null,
    }));
  } catch (error) {
    console.error("getGalleryImages", error);
    return [];
  }
}

/** Photos de la vie du domaine affichées sur la page d’accueil. */
export async function getHomeGalleryImages(): Promise<GalleryImage[]> {
  return getGalleryImages("accueil");
}

export async function pingSupabase() {
  const supabase = await createClient();
  const { error } = await supabase.from("animals").select("id").limit(1);
  return { ok: !error, error: error?.message ?? null };
}

/** Admin lists (includes unpublished / archived) */
export type AdminAnimalListItem = AnimalRow & {
  litterTitle: string | null;
  sireName: string | null;
  damName: string | null;
  photoCount: number;
};

export async function adminListAnimals(): Promise<AnimalRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("animals")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AnimalRow[];
}

export async function adminListAnimalsDetailed(): Promise<AdminAnimalListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("animals")
    .select(
      `
      *,
      litter:litter_id(id, title),
      sire:sire_id(id, name),
      dam:dam_id(id, name)
    `,
    )
    .order("name");
  if (error) throw error;

  const rows = (data ?? []) as (AnimalRow & {
    litter: { id: string; title: string } | null;
    sire: { id: string; name: string } | null;
    dam: { id: string; name: string } | null;
  })[];

  const counts = await adminMediaCountsByAnimal(rows.map((row) => row.id));

  return rows.map((row) => ({
    ...row,
    litterTitle: row.litter?.title ?? null,
    sireName: row.sire?.name ?? null,
    damName: row.dam?.name ?? null,
    photoCount: counts[row.id] ?? 0,
  }));
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
    .is("deleted_at", null)
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

  const row = litter as LitterRow & {
    sire: { id: string; name: string } | null;
    dam: { id: string; name: string } | null;
  };
  if (row.deleted_at) return null;

  const { data: young, error: youngError } = await supabase
    .from("animals")
    .select("*")
    .eq("litter_id", id)
    .eq("archived", false)
    .order("name");

  if (youngError) throw youngError;

  return {
    ...row,
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
    .order("sort_order", { ascending: true })
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
    .is("deleted_at", null)
    .order("title");
  if (error) throw error;
  return data ?? [];
}
