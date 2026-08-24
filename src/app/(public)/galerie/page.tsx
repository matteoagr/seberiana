import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { GalleryFilters } from "@/components/GalleryFilters";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { siteImages } from "@/data/site-images";
import { galleryTagLabels } from "@/lib/labels";
import { buildPageMetadata } from "@/lib/seo";
import { getHomeGalleryImages } from "@/lib/supabase/queries";
import { GALLERY_TAGS, type GalleryTag } from "@/lib/supabase/types";

export const metadata: Metadata = buildPageMetadata({
  title: "Galerie — la vie au Domaine Sibérania",
  description:
    "Photos de la vie au Domaine Sibérania : chiots, chatons, parents et moments du quotidien de l’élevage familial.",
  path: "/galerie",
});

type PageProps = {
  searchParams: Promise<{ tag?: string }>;
};

function parseGalleryTag(value: string | undefined): GalleryTag | undefined {
  if (!value) return undefined;
  return GALLERY_TAGS.includes(value as GalleryTag) ? (value as GalleryTag) : undefined;
}

export default async function GaleriePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeTag = parseGalleryTag(params.tag);
  const allImages = await getHomeGalleryImages();
  const availableTags = GALLERY_TAGS.filter((tag) =>
    allImages.some((image) => image.tag === tag),
  );
  const images = activeTag
    ? allImages.filter((image) => image.tag === activeTag)
    : allImages;

  const hero = images[0] ?? allImages[0];
  const filterLabel = activeTag ? galleryTagLabels[activeTag] : null;

  return (
    <>
      <PageHero
        compact
        eyebrow="Galerie"
        title="La vie au domaine"
        description="Des images du quotidien : chiots, chatons, parents et petits moments partagés — pour mieux sentir l’ambiance de l’élevage."
        image={hero?.src ?? siteImages.fallback}
        imageAlt={hero?.alt ?? "Vie au Domaine Sibérania"}
      />

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        {allImages.length > 0 ? (
          <>
            <p className="max-w-2xl text-base leading-relaxed text-foreground/85">
              Cette galerie est mise à jour au fil des jours. Chaque photo raconte un peu de
              la vie ici — socialisation, jeux, calme et suivi des portées.
            </p>
            <GalleryFilters activeTag={activeTag} availableTags={availableTags} />
            <p className="mt-6 text-sm text-foreground-muted">
              {images.length} photo{images.length > 1 ? "s" : ""}
              {filterLabel ? ` · ${filterLabel}` : ""}
            </p>
            <div className="mt-8">
              {images.length > 0 ? (
                <GalleryGrid images={images} variant="full" />
              ) : (
                <p className="text-sm text-foreground-muted">
                  Aucune photo pour ce filtre pour le moment.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="max-w-xl space-y-6">
            <p className="text-base leading-relaxed text-foreground-muted">
              La galerie se remplit bientôt. En attendant, découvrez nos compagnons dans
              l’annuaire ou les portées en cours.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/annuaire">Voir l’annuaire</ButtonLink>
              <ButtonLink href="/portees" variant="ghost">
                Voir les portées
              </ButtonLink>
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-line bg-background-elevated/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-16">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold/85">
              Un profil vous plaît ?
            </p>
            <p className="mt-2 text-base leading-relaxed text-foreground/90">
              Consultez l’annuaire pour les disponibilités, ou écrivez-nous pour en parler.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/annuaire">Annuaire</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Contact
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
