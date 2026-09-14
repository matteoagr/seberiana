import type { MetadataRoute } from "next";
import { breedProfiles } from "@/data/breeds";
import { SITE_URL } from "@/lib/site";
import { getPublicAnimalIds } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/annuaire", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/portees", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/galerie", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/elevage-canin", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/elevage-felin", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/races", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/adoption", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const breedPages: MetadataRoute.Sitemap = breedProfiles.map((breed) => ({
    url: `${SITE_URL}/races/${breed.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  let animalPages: MetadataRoute.Sitemap = [];
  try {
    const ids = await getPublicAnimalIds();
    animalPages = ids.map((id) => ({
      url: `${SITE_URL}/annuaire/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    animalPages = [];
  }

  return [...staticPages, ...breedPages, ...animalPages];
}
