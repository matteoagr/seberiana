import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { partners } from "@/data/partners";
import { siteImages } from "@/data/site-images";
import { buildPageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Partenaires — réseau de confiance",
  description:
    "Les partenaires du Domaine Sibérania : santé animale, transport et professionnels du bien-être autour de nos activités.",
  path: "/partenaires",
});

export default function PartenairesPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Réseau"
        title="Nos partenaires"
        description="Des interlocuteurs de confiance pour la santé, les envois et les activités autour de l’animal."
        image={siteImages.contact}
        imageAlt="Domaine Sibérania"
      />

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <SectionHeading
            size="page"
            eyebrow="Ensemble"
            title="Un réseau autour du Domaine Sibérania"
            description="Nous collaborons avec des professionnels sélectionnés pour accompagner les familles, les portées et nos activités de bien-être."
          />
          <ul className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <li key={partner.name}>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold/85">
                  {partner.role}
                </p>
                <h2 className="mt-2 font-serif text-2xl text-foreground">{partner.name}</h2>
                <p className="mt-3 text-base leading-relaxed text-foreground-muted">
                  {partner.description}
                </p>
                {partner.website ? (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block text-sm text-gold-soft hover:underline"
                  >
                    Visiter le site →
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            size="section"
            eyebrow="Vous êtes professionnel ?"
            title="Devenir partenaire"
            description={`Écrivez-nous à ${CONTACT_EMAIL} pour présenter votre activité.`}
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact">Nous écrire</ButtonLink>
            <ButtonLink href="/activites" variant="ghost">
              Nos activités
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
