import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { siteImages } from "@/data/site-images";
import { buildPageMetadata } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact — adoption et renseignements",
  description:
    "Contactez le Domaine Sibérania pour une adoption de Pomsky, Shiba Inu, Teckel ou Maine Coon, ou pour toute question sur nos portées.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="On discute ?"
        description="Dites-nous ce que vous cherchez — on vous répond avec plaisir."
        image={siteImages.contact}
        imageAlt="Pomsky du Domaine Sibérania"
      />

      <section className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Nous écrire"
            title="On lit chaque message"
            description="Questions sur une race, une portée ou un de nos petits cœurs : on répond avec soin et transparence."
          />
          <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground-muted">
            Précisez l’espèce ou la race qui vous intéresse (Pomsky, Shiba Inu, Teckel,
            Maine Coon) et votre projet de vie — cela nous aide à vous orienter.
          </p>
          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="font-serif text-gold/90">Courriel</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-foreground-muted transition-colors hover:text-gold-soft"
                >
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-serif text-gold/90">Téléphone</dt>
              <dd className="mt-2">
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="text-foreground-muted transition-colors hover:text-gold-soft"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-serif text-gold/90">Visites</dt>
              <dd className="mt-2 text-foreground-muted">
                Sur rendez-vous, pour le calme des portées.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-gold/90">Délai de réponse</dt>
              <dd className="mt-2 text-foreground-muted">
                Sous 48 à 72 h ouvrées, en général.
              </dd>
            </div>
          </dl>
        </div>

        <Suspense
          fallback={
            <div className="rounded-xl border border-line/60 bg-background-elevated/60 p-6 sm:p-10">
              <p className="text-sm text-foreground-muted">Chargement du formulaire…</p>
            </div>
          }
        >
          <ContactForm />
        </Suspense>
      </section>
    </>
  );
}
