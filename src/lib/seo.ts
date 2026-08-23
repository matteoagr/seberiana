import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_SHORT,
  SITE_URL,
} from "@/lib/site";

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  /** Absolute or site-relative image URL */
  image?: string;
  noIndex?: boolean;
  /** Skip the root title template (useful for the homepage). */
  absoluteTitle?: boolean;
};

/** Metadata cohérente (canonical + Open Graph + Twitter) pour les pages publiques. */
export function buildPageMetadata({
  title,
  description,
  path,
  image = "/brand/logo-512.png",
  noIndex = false,
  absoluteTitle = false,
}: PageSeoInput): Metadata {
  const url = path.startsWith("http") ? path : `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const ogTitle = absoluteTitle
    ? title
    : title.includes(SITE_NAME_SHORT)
      ? title
      : `${title} · ${SITE_NAME_SHORT}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: "website",
      images: [{ url: imageUrl, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export const rootDefaultDescription = SITE_DESCRIPTION;
