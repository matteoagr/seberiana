import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { ReproducteursBrowser } from "@/components/ReproducteursBrowser";
import { SectionHeading } from "@/components/SectionHeading";
import { siteImages } from "@/data/site-images";
import { buildPageMetadata } from "@/lib/seo";
import { getBreeders } from "@/lib/supabase/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Nos reproducteurs",
  description:
    "Reproducteurs du Domaine Sibérania : les parents de nos portées de Pomsky, Teckel et Maine Coon.",
  path: "/reproducteurs",
});

export default async function ReproducteursPage() {
  const breeders = await getBreeders();

  return (
    <>
      <PageHero
        compact
        eyebrow="Domaine Sibérania"
        title="Nos reproducteurs"
        description="Les parents de nos portées — sélectionnés pour le caractère, la santé et la vie de famille au Domaine Sibérania."
        image={siteImages.elevageCanin}
        imageAlt="Reproducteurs du Domaine Sibérania"
      />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Lignées"
            title="Les parents de nos petits"
            description={`${breeders.length} reproducteur${breeders.length > 1 ? "s" : ""} publié${breeders.length > 1 ? "s" : ""} — chiens et chats du domaine.`}
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/portees" variant="ghost">
              Voir les portées
            </ButtonLink>
            <ButtonLink href="/annuaire">Nos petits cœurs</ButtonLink>
          </div>
        </div>

        <Suspense fallback={<p className="mt-8 text-sm text-foreground-muted">Chargement…</p>}>
          <ReproducteursBrowser breeders={breeders} />
        </Suspense>
      </section>

      <section className="border-t border-line bg-background-elevated/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            size="section"
            eyebrow="Élevage"
            title="Mieux connaître nos races"
            description="Pomsky et Teckel côté canin — Maine Coon côté félin. Fiches races et pages d’élevage pour aller plus loin."
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/elevage-canin">Nos chiens</ButtonLink>
            <ButtonLink href="/elevage-felin" variant="ghost">
              Nos chats
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
