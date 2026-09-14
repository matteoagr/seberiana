"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  GALLERY_TAGS,
  type AnimalRole,
  type AnimalSex,
  type AnimalStatus,
  type LitterStatus,
  type Species,
} from "@/lib/supabase/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

function revalidatePublicContent() {
  updateTag("animals");
  updateTag("litters");
  updateTag("gallery");
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");
  return supabase;
}

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function boolFromForm(form: FormData, key: string): boolean {
  return form.get(key) === "on" || form.get(key) === "true" || form.get(key) === "1";
}

function redirectTo(path: string) {
  redirect(path.startsWith("/admin") ? path : "/admin/portees");
}

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/portees");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "Email ou mot de passe incorrect." };

  redirect(next.startsWith("/admin") ? next : "/admin/portees");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function upsertAnimalAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const id = emptyToNull(formData.get("id"));

    const returnTo = emptyToNull(formData.get("return_to"));
    const litterId = emptyToNull(formData.get("litter_id"));

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      species: String(formData.get("species") ?? "canin") as Species,
      breed: String(formData.get("breed") ?? "").trim(),
      sex: String(formData.get("sex") ?? "male") as AnimalSex,
      birth_date: emptyToNull(formData.get("birth_date")),
      color: String(formData.get("color") ?? "").trim(),
      status: String(formData.get("status") ?? "disponible") as AnimalStatus,
      role: String(formData.get("role") ?? "jeune") as AnimalRole,
      is_lof: boolFromForm(formData, "is_lof"),
      litter_id: litterId,
      sire_id: emptyToNull(formData.get("sire_id")),
      dam_id: emptyToNull(formData.get("dam_id")),
      lineage_label: String(formData.get("lineage_label") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      cover_url: emptyToNull(formData.get("cover_url")),
      cover_image_path: emptyToNull(formData.get("cover_image_path")),
      published: boolFromForm(formData, "published"),
      archived: boolFromForm(formData, "archived"),
    };

    if (!payload.name || !payload.breed) {
      return { ok: false, error: "Nom et race sont obligatoires." };
    }

    // Hériter parents / infos depuis la portée si jeune
    if (litterId && payload.role === "jeune") {
      const { data: litter } = await supabase
        .from("litters")
        .select("species, breed, birth_date, sire_id, dam_id")
        .eq("id", litterId)
        .maybeSingle();

      if (litter) {
        payload.species = litter.species as Species;
        if (!payload.breed) payload.breed = litter.breed;
        if (!payload.birth_date && litter.birth_date) payload.birth_date = litter.birth_date;
        if (!payload.sire_id && litter.sire_id) payload.sire_id = litter.sire_id;
        if (!payload.dam_id && litter.dam_id) payload.dam_id = litter.dam_id;
      }
    }

    const file = formData.get("cover_file");
    if (file instanceof File && file.size > 0) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${payload.species}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("animals")
        .upload(path, file, { upsert: true, contentType: file.type || undefined });
      if (uploadError) return { ok: false, error: uploadError.message };
      payload.cover_image_path = path;
      payload.cover_url = null;
    }

    const extraPhotos = formData
      .getAll("files")
      .filter((f): f is File => f instanceof File && f.size > 0);

    let animalId = id;
    if (id) {
      const { error } = await supabase.from("animals").update(payload).eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data, error } = await supabase
        .from("animals")
        .insert(payload)
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      animalId = data.id;
    }

    if (animalId && extraPhotos.length > 0) {
      const uploadError = await saveAnimalPhotoFiles(
        supabase,
        animalId,
        payload.species,
        extraPhotos,
      );
      if (uploadError) return { ok: false, error: uploadError };
    }

    if (!id && payload.role === "jeune" && litterId && animalId) {
      revalidatePath(`/admin/portees/${litterId}`);
      revalidatePath("/admin/animaux");
      redirect(`/admin/portees/${litterId}/jeunes/${animalId}`);
    }

    revalidatePath("/");
    revalidatePath("/annuaire");
    revalidatePath("/portees");
    revalidatePath("/elevage-canin");
    revalidatePath("/elevage-felin");
    revalidatePath("/admin/animaux");
    revalidatePath("/admin/reproducteurs");
    revalidatePath("/admin/portees");
    if (litterId) revalidatePath(`/admin/portees/${litterId}`);
    revalidatePublicContent();

    if (returnTo) redirectTo(returnTo);
    if (payload.role === "reproducteur") redirect("/admin/reproducteurs");
    if (litterId) redirect(`/admin/portees/${litterId}`);
    redirect("/admin/portees");
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { ok: false, error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function archiveAnimalAction(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase
      .from("animals")
      .update({ archived: true, published: false })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/animaux");
    revalidatePath("/admin/reproducteurs");
    revalidatePath("/annuaire");
    revalidatePublicContent();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function upsertLitterAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const id = emptyToNull(formData.get("id"));

    const payload = {
      title: String(formData.get("title") ?? "").trim(),
      species: String(formData.get("species") ?? "canin") as Species,
      breed: String(formData.get("breed") ?? "").trim(),
      sire_id: emptyToNull(formData.get("sire_id")),
      dam_id: emptyToNull(formData.get("dam_id")),
      birth_date: emptyToNull(formData.get("birth_date")),
      status: String(formData.get("status") ?? "a_venir") as LitterStatus,
      description: String(formData.get("description") ?? "").trim(),
      cover_image_path: emptyToNull(formData.get("cover_image_path")),
      published: boolFromForm(formData, "published"),
    };

    if (!payload.title || !payload.breed) {
      return { ok: false, error: "Titre et race sont obligatoires." };
    }

    const file = formData.get("cover_file");
    if (file instanceof File && file.size > 0) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${payload.species}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("litters")
        .upload(path, file, { upsert: true, contentType: file.type || undefined });
      if (uploadError) return { ok: false, error: uploadError.message };
      payload.cover_image_path = path;
    }

    if (id) {
      const { data: existing, error: existingError } = await supabase
        .from("litters")
        .select("archived")
        .eq("id", id)
        .maybeSingle();
      if (existingError) return { ok: false, error: existingError.message };
      const { error } = await supabase.from("litters").update(payload).eq("id", id);
      if (error) return { ok: false, error: error.message };
      revalidatePath("/portees");
      revalidatePath("/admin/portees");
      revalidatePath(`/admin/portees/${id}`);
      revalidatePublicContent();
      redirect(
        payload.published && !existing?.archived
          ? "/admin/portees?ok=en-ligne"
          : "/admin/portees?ok=enregistree",
      );
    } else {
      const { error } = await supabase.from("litters").insert({ ...payload, archived: false });
      if (error) return { ok: false, error: error.message };
      revalidatePath("/portees");
      revalidatePath("/admin/portees");
      revalidatePublicContent();
      redirect(
        payload.published
          ? "/admin/portees?ok=en-ligne"
          : "/admin/portees?ok=enregistree",
      );
    }
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { ok: false, error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export async function archiveLitterAction(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase
      .from("litters")
      .update({ archived: true, published: false })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/portees");
    revalidatePath("/portees");
    revalidatePublicContent();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function unarchiveLitterAction(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase
      .from("litters")
      .update({ archived: false, published: true })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/portees");
    revalidatePath("/portees");
    revalidatePublicContent();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

/** Soft delete: keep the row in the database, hide it from public site and admin list. */
export async function deleteLitterAction(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase
      .from("litters")
      .update({
        deleted_at: new Date().toISOString(),
        published: false,
      })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/portees");
    revalidatePath("/portees");
    revalidatePublicContent();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function createMediaAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Choisissez un fichier image." };
    }

    const animalId = emptyToNull(formData.get("animal_id"));
    const litterId = emptyToNull(formData.get("litter_id"));
    const galleryKey = emptyToNull(formData.get("gallery_key"));
    const galleryTagRaw = emptyToNull(formData.get("gallery_tag"));
    if (!animalId && !litterId && !galleryKey) {
      return { ok: false, error: "Assignez l’image à un animal, une portée ou une galerie." };
    }

    const galleryTag =
      galleryKey && galleryTagRaw
        ? (GALLERY_TAGS.includes(galleryTagRaw as (typeof GALLERY_TAGS)[number])
            ? galleryTagRaw
            : null)
        : null;

    const bucket = animalId ? "animals" : litterId ? "litters" : "galleries";
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${galleryKey || animalId || litterId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true, contentType: file.type || undefined });
    if (uploadError) return { ok: false, error: uploadError.message };

    const { error } = await supabase.from("media").insert({
      storage_path: path,
      alt_text: String(formData.get("alt_text") ?? "").trim(),
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
      // Couverture = fiches animaux uniquement ; inutile pour la galerie
      is_cover: galleryKey ? false : boolFromForm(formData, "is_cover"),
      animal_id: animalId,
      litter_id: litterId,
      gallery_key: galleryKey,
      gallery_tag: galleryTag,
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/medias");
    revalidatePath("/galerie");
    revalidatePath("/");
    revalidatePublicContent();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function updateMediaAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const id = String(formData.get("id") ?? "").trim();
    if (!id) return { ok: false, error: "Média introuvable." };

    const { data: existing, error: existingError } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (existingError || !existing) {
      return { ok: false, error: "Média introuvable." };
    }

    const nextGalleryKey = emptyToNull(formData.get("gallery_key"));
    const galleryTagRaw = emptyToNull(formData.get("gallery_tag"));
    const galleryTag =
      nextGalleryKey &&
      galleryTagRaw &&
      GALLERY_TAGS.includes(galleryTagRaw as (typeof GALLERY_TAGS)[number])
        ? galleryTagRaw
        : null;

    const altText = String(formData.get("alt_text") ?? "").trim();
    const sortOrder = Number(formData.get("sort_order") ?? existing.sort_order) || 0;

    const file = formData.get("file");
    let storagePath = existing.storage_path as string;
    const bucket = existing.animal_id
      ? "animals"
      : existing.litter_id
        ? "litters"
        : "galleries";

    if (file instanceof File && file.size > 0) {
      const ext = file.name.split(".").pop() || "jpg";
      const folder =
        nextGalleryKey ||
        existing.animal_id ||
        existing.litter_id ||
        "misc";
      const nextPath = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(nextPath, file, { upsert: true, contentType: file.type || undefined });
      if (uploadError) return { ok: false, error: uploadError.message };

      await supabase.storage.from(bucket).remove([storagePath]);
      storagePath = nextPath;

      if (existing.animal_id && existing.is_cover) {
        await supabase
          .from("animals")
          .update({ cover_image_path: storagePath, cover_url: null })
          .eq("id", existing.animal_id);
      }
    }

    const { error } = await supabase
      .from("media")
      .update({
        alt_text: altText,
        sort_order: sortOrder,
        gallery_key: nextGalleryKey,
        gallery_tag: nextGalleryKey ? galleryTag : null,
        storage_path: storagePath,
      })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/medias");
    revalidatePath("/galerie");
    revalidatePath("/");
    if (existing.animal_id) {
      revalidatePath(`/annuaire/${existing.animal_id}`);
      revalidatePath("/annuaire");
    }
    revalidatePublicContent();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function deleteMediaAction(id: string, storagePath: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();

    const { data: media } = await supabase
      .from("media")
      .select("animal_id, is_cover")
      .eq("id", id)
      .maybeSingle();

    await Promise.allSettled([
      supabase.storage.from("animals").remove([storagePath]),
      supabase.storage.from("litters").remove([storagePath]),
      supabase.storage.from("galleries").remove([storagePath]),
      supabase.storage.from("media").remove([storagePath]),
    ]);
    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    if (media?.animal_id && media.is_cover) {
      const { data: nextCover } = await supabase
        .from("media")
        .select("id, storage_path")
        .eq("animal_id", media.animal_id)
        .order("sort_order")
        .limit(1)
        .maybeSingle();

      if (nextCover) {
        await supabase.from("media").update({ is_cover: true }).eq("id", nextCover.id);
        await supabase
          .from("animals")
          .update({ cover_image_path: nextCover.storage_path, cover_url: null })
          .eq("id", media.animal_id);
      } else {
        await supabase
          .from("animals")
          .update({ cover_image_path: null, cover_url: null })
          .eq("id", media.animal_id);
      }
    }

    revalidateAnimalPaths(media?.animal_id ?? null);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

function revalidateAnimalPaths(animalId: string | null) {
  revalidatePath("/");
  revalidatePath("/annuaire");
  revalidatePath("/portees");
  revalidatePath("/admin/medias");
  revalidatePath("/admin/animaux");
  revalidatePath("/admin/portees");
  revalidatePath("/galerie");
  if (animalId) {
    revalidatePath(`/annuaire/${animalId}`);
  }
  revalidatePublicContent();
}

async function saveAnimalPhotoFiles(
  supabase: Awaited<ReturnType<typeof requireUser>>,
  animalId: string,
  species: string,
  files: File[],
): Promise<string | null> {
  const { count } = await supabase
    .from("media")
    .select("id", { count: "exact", head: true })
    .eq("animal_id", animalId);
  const { data: animal } = await supabase
    .from("animals")
    .select("cover_image_path")
    .eq("id", animalId)
    .maybeSingle();
  const { data: existingCover } = await supabase
    .from("media")
    .select("id")
    .eq("animal_id", animalId)
    .eq("is_cover", true)
    .maybeSingle();

  let sortOrder = count ?? 0;
  let needsCover = !animal?.cover_image_path && !existingCover;

  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${species}/${animalId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("animals")
      .upload(path, file, { upsert: true, contentType: file.type || undefined });
    if (uploadError) return uploadError.message;

    const isCover = needsCover;
    if (isCover) needsCover = false;

    const { error: insertError } = await supabase.from("media").insert({
      storage_path: path,
      alt_text: "",
      sort_order: sortOrder,
      is_cover: isCover,
      animal_id: animalId,
    });
    if (insertError) return insertError.message;

    if (isCover) {
      await supabase
        .from("animals")
        .update({ cover_image_path: path, cover_url: null })
        .eq("id", animalId);
    }

    sortOrder += 1;
  }

  return null;
}

export async function uploadAnimalPhotosAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const animalId = String(formData.get("animal_id") ?? "");
    const litterId = emptyToNull(formData.get("litter_id"));
    if (!animalId) return { ok: false, error: "Animal manquant." };

    const { data: animal } = await supabase
      .from("animals")
      .select("species, cover_image_path")
      .eq("id", animalId)
      .maybeSingle();
    if (!animal) return { ok: false, error: "Animal introuvable." };

    const files = formData.getAll("files").filter(
      (f): f is File => f instanceof File && f.size > 0,
    );
    if (files.length === 0) {
      return { ok: false, error: "Glissez ou choisissez au moins une photo." };
    }

    const uploadError = await saveAnimalPhotoFiles(
      supabase,
      animalId,
      animal.species,
      files,
    );
    if (uploadError) return { ok: false, error: uploadError };

    revalidateAnimalPaths(animalId);
    if (litterId) revalidatePath(`/admin/portees/${litterId}`);
    if (litterId) revalidatePath(`/admin/portees/${litterId}/jeunes/${animalId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function setAnimalCoverAction(
  mediaId: string,
  animalId: string,
  litterId?: string | null,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();

    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("storage_path")
      .eq("id", mediaId)
      .eq("animal_id", animalId)
      .maybeSingle();
    if (mediaError || !media) return { ok: false, error: "Photo introuvable." };

    await supabase.from("media").update({ is_cover: false }).eq("animal_id", animalId);
    await supabase.from("media").update({ is_cover: true }).eq("id", mediaId);
    await supabase
      .from("animals")
      .update({ cover_image_path: media.storage_path, cover_url: null })
      .eq("id", animalId);

    revalidateAnimalPaths(animalId);
    if (litterId) revalidatePath(`/admin/portees/${litterId}/jeunes/${animalId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

export async function setAnimalCoverFormAction(formData: FormData): Promise<void> {
  const mediaId = String(formData.get("media_id") ?? "");
  const animalId = String(formData.get("animal_id") ?? "");
  const litterId = emptyToNull(formData.get("litter_id"));
  if (!mediaId || !animalId) return;
  await setAnimalCoverAction(mediaId, animalId, litterId);
}

export async function deleteAnimalPhotoFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const storagePath = String(formData.get("storage_path") ?? "");
  const litterId = emptyToNull(formData.get("litter_id"));
  if (!id) return;
  await deleteMediaAction(id, storagePath);
  if (litterId) revalidatePath(`/admin/portees/${litterId}`);
}

export async function deleteMediaFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const storagePath = String(formData.get("storage_path") ?? "");
  if (!id) return;
  await deleteMediaAction(id, storagePath);
  revalidatePath("/");
  revalidatePath("/admin/medias");
  revalidatePath("/galerie");
  revalidatePublicContent();
}

export async function submitContactAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const interest = String(formData.get("interest") ?? "annuaire").trim();
    const activityKind = emptyToNull(formData.get("activityKind"));
    const baseMessage = String(formData.get("message") ?? "").trim();
    const message = activityKind
      ? buildActivityMessage(activityKind, formData, baseMessage)
      : baseMessage;

    if (!String(formData.get("firstName") ?? "").trim()) {
      return { ok: false, error: "Le prénom est requis." };
    }
    if (!String(formData.get("email") ?? "").trim()) {
      return { ok: false, error: "L’email est requis." };
    }
    if (!message) {
      return { ok: false, error: "Le message est requis." };
    }

    const { error } = await supabase.from("contact_requests").insert({
      first_name: String(formData.get("firstName") ?? "").trim(),
      last_name: String(formData.get("lastName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: emptyToNull(formData.get("phone")),
      interest,
      message,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erreur" };
  }
}

function buildActivityMessage(
  kind: string,
  formData: FormData,
  extra: string,
): string {
  const lines: string[] = [];

  if (kind === "puppy-yoga") {
    lines.push("Demande — Puppy yoga");
    const date = emptyToNull(formData.get("preferredDate"));
    const participants = emptyToNull(formData.get("participants"));
    const level = emptyToNull(formData.get("level"));
    if (date) lines.push(`Date souhaitée : ${date}`);
    if (participants) lines.push(`Participants : ${participants}`);
    if (level) lines.push(`Niveau : ${level}`);
  } else if (kind === "magnetisme") {
    lines.push("Demande — Magnétisme animalier");
    const animalName = emptyToNull(formData.get("animalName"));
    const species = emptyToNull(formData.get("animalSpecies"));
    const mode = emptyToNull(formData.get("sessionMode"));
    const reason = emptyToNull(formData.get("reason"));
    if (animalName) lines.push(`Animal : ${animalName}`);
    if (species) lines.push(`Espèce : ${species}`);
    if (mode) lines.push(`Format : ${mode}`);
    if (reason) lines.push(`Motif : ${reason}`);
  } else if (kind === "mediation") {
    lines.push("Demande — Médiation animale");
    const audience = emptyToNull(formData.get("audience"));
    const format = emptyToNull(formData.get("format"));
    const organization = emptyToNull(formData.get("organization"));
    const objective = emptyToNull(formData.get("objective"));
    if (audience) lines.push(`Public : ${audience}`);
    if (format) lines.push(`Format : ${format}`);
    if (organization) lines.push(`Structure : ${organization}`);
    if (objective) lines.push(`Objectif : ${objective}`);
  } else {
    lines.push(`Demande — ${kind}`);
  }

  if (extra) {
    lines.push("");
    lines.push(extra);
  }

  return lines.join("\n").trim();
}
