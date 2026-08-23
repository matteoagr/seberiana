import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrivez au Domaine Sibérania pour poser vos questions ou parler d’une adoption.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="On discute ?"
        description="Dites-nous ce que vous cherchez — on vous répond avec plaisir et sans pression."
        image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Allée boisée menant au domaine"
      />

      <section className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Nous écrire"
            title="On lit chaque message"
            description="On prend le temps de répondre à chaque demande — la qualité de l’accueil passe avant la vitesse."
          />
          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="font-serif text-gold/90">Courriel</dt>
              <dd className="mt-2">
                <a
                  href="mailto:elevagesiberania@gmail.com"
                  className="text-foreground-muted transition-colors hover:text-gold-soft"
                >
                  elevagesiberania@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-serif text-gold/90">Téléphone</dt>
              <dd className="mt-2">
                <a
                  href="tel:+33606524948"
                  className="text-foreground-muted transition-colors hover:text-gold-soft"
                >
                  06 06 52 49 48
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
