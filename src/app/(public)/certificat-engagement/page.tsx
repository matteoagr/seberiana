import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { siteImages } from "@/data/site-images";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Certificat d’engagement et de connaissance",
  description:
    "Téléchargez le certificat d’engagement et de connaissance (CAC) chien ou chat du Domaine Sibérania — obligatoire 7 jours avant l’adoption.",
  path: "/certificat-engagement",
});

const DOCUMENTS = [
  {
    title: "Certificat chien",
    description:
      "Pour l’adoption d’un Pomsky, Shiba Inu ou Teckel. À signer au moins 7 jours avant la remise de l’animal.",
    href: "/documents/certificat-engagement-chien.pdf",
    fileName: "certificat-engagement-chien-siberiana.pdf",
    species: "Canin",
  },
  {
    title: "Certificat chat",
    description:
      "Pour l’adoption d’un Maine Coon. À signer au moins 7 jours avant la remise de l’animal.",
    href: "/documents/certificat-engagement-chat.pdf",
    fileName: "certificat-engagement-chat-siberiana.pdf",
    species: "Félin",
  },
] as const;

export default function CertificatEngagementPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Adoption responsable"
        title="Certificat d’engagement"
        description="Document obligatoire avant toute adoption — téléchargez la version adaptée à votre compagnon, signez-la, puis renvoyez-nous le document daté."
        image={siteImages.homeAdoption}
        imageAlt="Adoption responsable au Domaine Sibérania"
      />

      <section className="border-b border-line bg-background-elevated/35">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <SectionHeading
            size="page"
            eyebrow="Téléchargements"
            title="Choisir votre certificat"
            description="Deux modèles selon l’espèce. Le délai de réflexion de 7 jours commence à la date de votre signature."
          />
          <ul className="mt-12 grid gap-10 sm:grid-cols-2">
            {DOCUMENTS.map((doc) => (
              <li key={doc.href} className="flex flex-col">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold/85">
                  {doc.species}
                </p>
                <h2 className="mt-2 font-serif text-2xl text-foreground">{doc.title}</h2>
                <p className="mt-3 max-w-md flex-1 text-base leading-relaxed text-foreground-muted">
                  {doc.description}
                </p>
                <a
                  href={doc.href}
                  download={doc.fileName}
                  className="mt-8 inline-flex w-fit items-center justify-center rounded-lg border border-gold/50 bg-gold/12 px-5 py-2.5 text-sm font-medium text-gold-soft transition-colors duration-300 hover:bg-gold/22"
                >
                  Télécharger le PDF
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading
            size="page"
            eyebrow="Mode d’emploi"
            title="Comment procéder"
            description="Un geste simple pour respecter le cadre légal et préparer sereinement l’arrivée de votre compagnon."
          />
          <ol className="mt-12 max-w-3xl space-y-8">
            <li className="flex gap-5">
              <span className="font-serif text-2xl text-gold/80" aria-hidden>
                1
              </span>
              <div>
                <h3 className="font-serif text-xl text-foreground">Télécharger</h3>
                <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                  Choisissez le certificat chien ou chat selon l’animal que vous souhaitez
                  accueillir.
                </p>
              </div>
            </li>
            <li className="flex gap-5">
              <span className="font-serif text-2xl text-gold/80" aria-hidden>
                2
              </span>
              <div>
                <h3 className="font-serif text-xl text-foreground">Lire et signer</h3>
                <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                  Prenez le temps de lire le document, datez-le et signez-le (manuscritement ou
                  électroniquement).
                </p>
              </div>
            </li>
            <li className="flex gap-5">
              <span className="font-serif text-2xl text-gold/80" aria-hidden>
                3
              </span>
              <div>
                <h3 className="font-serif text-xl text-foreground">Nous le renvoyer</h3>
                <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                  Envoyez-nous le certificat signé via la page{" "}
                  <Link href="/contact" className="text-gold-soft hover:underline">
                    contact
                  </Link>{" "}
                  ou lors de nos échanges. Le délai de 7 jours court à partir de cette signature.
                </p>
              </div>
            </li>
          </ol>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-foreground-muted">
            Cadre légal : article D.214-32-4 du Code rural et de la pêche maritime. Plus de
            détails sur le parcours d’adoption sur la page{" "}
            <Link href="/adoption" className="text-gold-soft hover:underline">
              Adoption responsable
            </Link>
            .
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            size="section"
            eyebrow="Besoin d’aide ?"
            title="Une question sur le certificat ?"
            description="On vous guide pour le remplir et le renvoyer au bon moment."
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact">Nous écrire</ButtonLink>
            <ButtonLink href="/adoption" variant="ghost">
              Parcours d’adoption
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
