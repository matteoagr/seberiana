import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { GalleryBrowser } from "@/components/GalleryBrowser";
import { PageHero } from "@/components/PageHero";
import { siteImages } from "@/data/site-images";
import { buildPageMetadata } from "@/lib/seo";
import { getHomeGalleryImages } from "@/lib/supabase/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Galerie — la vie au Domaine Sibérania",
  description:
    "Photos de la vie au Domaine Sibérania : chiots, chatons, parents et moments du quotidien de l’élevage familial.",
  path: "/galerie",
});

export default async function GaleriePage() {
  const allImages = await getHomeGalleryImages();
  const hero = allImages[0];

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
            <Suspense
              fallback={<p className="mt-8 text-sm text-foreground-muted">Chargement…</p>}
            >
              <GalleryBrowser images={allImages} />
            </Suspense>
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
