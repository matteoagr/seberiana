import type { Metadata } from "next";
import { Suspense } from "react";
import { buildPageMetadata } from "@/lib/seo";
import { AnnuaireBrowser } from "@/components/AnnuaireBrowser";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { siteImages } from "@/data/site-images";
import { getAnimals, getAvailableCount } from "@/lib/supabase/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Annuaire des chiots et chatons",
  description:
    "Annuaire Domaine Sibérania : Pomsky, Shiba Inu, Teckel et Maine Coon disponibles, réservés ou adoptés. Filtrez par espèce, race et statut.",
  path: "/annuaire",
});

export default async function AnnuairePage() {
  const [animals, availableCount] = await Promise.all([
    getAnimals(),
    getAvailableCount(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Annuaire"
        title="Nos chiots et chatons"
        description="Pomsky, Shiba Inu, Teckel et Maine Coon — les disponibles apparaissent en premier. Filtrez par espèce, race ou statut."
        image={siteImages.annuaire}
        imageAlt="Chiots Pomsky du Domaine Sibérania"
      />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Parcourir"
            title="Qui est disponible ?"
            description={`${availableCount} animal${availableCount > 1 ? "aux" : ""} disponible${availableCount > 1 ? "s" : ""} en ce moment.`}
          />
          <ButtonLink href="/contact" className="self-start sm:self-auto">
            Nous contacter
          </ButtonLink>
        </div>

        <Suspense fallback={<p className="mt-8 text-sm text-foreground-muted">Chargement…</p>}>
          <AnnuaireBrowser animals={animals} />
        </Suspense>
      </section>

      <section className="border-t border-line bg-background-elevated/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            eyebrow="Envie d’en savoir plus ?"
            title="Chaque profil a son histoire"
            description="Parents, date de naissance, places restantes — tout est sur la page Portées."
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/portees">Voir les portées</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Nous écrire
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
