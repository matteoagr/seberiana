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
        description="Dites-nous ce que vous cherchez — on vous répond au plus vite."
        image={siteImages.contact}
        imageAlt="Pomsky du Domaine Sibérania"
        compact
        short
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-8 sm:gap-12 sm:px-8 sm:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Suspense
          fallback={
            <div className="rounded-xl border border-line/60 bg-background-elevated/60 p-6 sm:p-8 lg:col-start-2 lg:row-start-1">
              <p className="text-sm text-foreground-muted">Chargement du formulaire…</p>
            </div>
          }
        >
          <div className="lg:col-start-2 lg:row-start-1">
            <ContactForm />
          </div>
        </Suspense>

        <div className="lg:col-start-1 lg:row-start-1">
          <SectionHeading
            eyebrow="Nous écrire"
            title="On lit chaque message"
            description="Questions sur une race, une portée ou un de nos petits cœurs : on répond avec soin et transparence."
            size="section"
          />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground-muted">
            Précisez l’espèce ou la race qui vous intéresse (Pomsky, Shiba Inu, Teckel,
            Maine Coon) et votre projet de vie — cela nous aide à vous orienter.
          </p>
          <dl className="mt-8 grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <dt className="font-serif text-gold/90">Courriel</dt>
              <dd className="mt-1.5">
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
              <dd className="mt-1.5">
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
              <dd className="mt-1.5 text-foreground-muted">
                Possibles sur rendez-vous, pour le calme des portées.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-gold/90">Envois</dt>
              <dd className="mt-1.5 text-foreground-muted">
                Partout en France et à l’étranger, avec des transporteurs de confiance.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-gold/90">Délai de réponse</dt>
              <dd className="mt-1.5 text-foreground-muted">Au plus vite.</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
