import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreedJsonLd } from "@/components/BreedJsonLd";
import { BreedProfileView } from "@/components/BreedProfileView";
import { PageHero } from "@/components/PageHero";
import {
  breedProfiles,
  getAllBreedSlugs,
  getBreedBySlug,
} from "@/data/breeds";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBreedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);

  if (!breed) {
    return { title: "Race introuvable" };
  }

  return {
    title: breed.metaTitle,
    description: breed.metaDescription,
    alternates: {
      canonical: `/races/${breed.slug}`,
    },
    openGraph: {
      title: `${breed.name} | Domaine Sibérania`,
      description: breed.metaDescription,
      url: `/races/${breed.slug}`,
      images: [{ url: breed.heroImage, alt: breed.name }],
    },
  };
}

export default async function BreedPage({ params }: PageProps) {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);

  if (!breed) {
    notFound();
  }

  const otherBreeds = breedProfiles.filter((b) => b.slug !== breed.slug);

  return (
    <>
      <BreedJsonLd breed={breed} />

      <nav
        aria-label="Fil d'Ariane"
        className="mx-auto max-w-6xl px-5 pt-28 text-sm text-foreground-muted sm:px-8"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors hover:text-gold-soft">
              Accueil
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/races" className="transition-colors hover:text-gold-soft">
              Races
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground/90">{breed.name}</li>
        </ol>
      </nav>

      <PageHero
        eyebrow={breed.species === "canin" ? "Race canine" : "Race féline"}
        title={breed.heroTitle}
        description={breed.heroDescription}
        image={breed.heroImage}
        imageAlt={`${breed.name} — fiche race Domaine Sibérania`}
      />

      <BreedProfileView breed={breed} />

      <aside className="mx-auto max-w-6xl border-t border-line px-5 py-14 sm:px-8">
        <h2 className="font-serif text-xl text-foreground">
          Autres races au domaine
        </h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {otherBreeds.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/races/${other.slug}`}
                className="inline-flex rounded-full border border-line px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-gold/30 hover:text-gold-soft"
              >
                {other.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
