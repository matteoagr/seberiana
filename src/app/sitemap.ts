import type { MetadataRoute } from "next";
import { breedProfiles } from "@/data/breeds";

const SITE_URL = "https://siberiana.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/annuaire",
    "/portees",
    "/elevage-canin",
    "/elevage-felin",
    "/contact",
    "/races",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/races" ? 0.9 : 0.8,
  }));

  const breedPages: MetadataRoute.Sitemap = breedProfiles.map((breed) => ({
    url: `${SITE_URL}/races/${breed.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticPages, ...breedPages];
}
