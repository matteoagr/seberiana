import { siteImages } from "@/data/site-images";

const FALLBACK_IMAGE = siteImages.fallback;

/** Resolve a storage path or absolute URL to a public image URL. */
export function resolveMediaUrl(
  pathOrUrl: string | null | undefined,
  bucket: "animals" | "galleries" | "litters" | "media" = "media",
): string {
  if (!pathOrUrl) return FALLBACK_IMAGE;
  if (
    pathOrUrl.startsWith("http://") ||
    pathOrUrl.startsWith("https://") ||
    pathOrUrl.startsWith("/")
  ) {
    return pathOrUrl;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return FALLBACK_IMAGE;
  return `${base}/storage/v1/object/public/${bucket}/${pathOrUrl}`;
}

export function animalCoverUrl(animal: {
  cover_url?: string | null;
  cover_image_path?: string | null;
}): string {
  if (animal.cover_url) return resolveMediaUrl(animal.cover_url, "animals");
  return resolveMediaUrl(animal.cover_image_path, "animals");
}

export function litterCoverUrl(litter: {
  cover_image_path?: string | null;
}): string {
  return resolveMediaUrl(litter.cover_image_path, "litters");
}
