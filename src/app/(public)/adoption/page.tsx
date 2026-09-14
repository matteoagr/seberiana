import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { PetitsCoeursLabel } from "@/components/PetitsCoeurs";
import { SectionHeading } from "@/components/SectionHeading";
import { siteImages } from "@/data/site-images";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Comment adopter — parcours et certificat d’engagement",
  description:
    "Adoption responsable au Domaine Sibérania : parcours en étapes, certificat d’engagement et de connaissance (CAC), visite ou envoi, contrat et suivi.",
  path: "/adoption",
});

const STEPS = [
  {
    title: "Découvrir les profils",
    body: (
      <>
        Parcourez{" "}
        <Link href="/annuaire" className="text-gold-soft hover:underline">
          <PetitsCoeursLabel
            leading="nos petits"
            iconClassName="h-3.5 w-3.5 inline"
            className="inline-flex items-center gap-1"
          />
        </Link>{" "}
        et les{" "}
        <Link href="/portees" className="text-gold-soft hover:underline">
          portées
        </Link>{" "}
        pour voir les disponibilités, les parents et l’histoire de chaque jeune.
      </>
    ),
  },
  {
    title: "Nous écrire",
    body: (
      <>
        Présentez votre foyer et votre projet via la page{" "}
        <Link href="/contact" className="text-gold-soft hover:underline">
          contact
        </Link>
        . Nous échangeons pour vérifier l’adéquation et vous accompagner sans précipitation.
      </>
    ),
  },
  {
    title: "Certificat d’engagement",
    body: (
      <>
        Avant toute remise de l’animal, vous signez le{" "}
        <Link href="/certificat-engagement" className="text-gold-soft hover:underline">
          certificat d’engagement et de connaissance
        </Link>{" "}
        (CAC). C’est une étape obligatoire, à réaliser au minimum 7 jours avant l’adoption.
      </>
    ),
  },
  {
    title: "Rencontre et échanges",
    body: (
      <>
        Visite sur rendez-vous au domaine, ou échanges à distance si vous êtes plus loin.
        Posez toutes vos questions : caractère, entretien, vie quotidienne.
      </>
    ),
  },
  {
    title: "Santé et contrat",
    body: (
      <>
        Identification, carnet de santé et documents sont vérifiés. Un contrat de vente
        détaillé est signé entre vous et l’élevage, pour vos droits et la traçabilité.
      </>
    ),
  },
  {
    title: "Départ et suivi",
    body: (
      <>
        Après le délai de réflexion de 7 jours, votre compagnon vous rejoint — sur place ou
        par envoi partout en France et à l’étranger avec des transporteurs de confiance. Nous
        restons disponibles pour le suivi des premiers mois.
      </>
    ),
  },
] as const;

const CAC_POINTS = [
  "Les besoins physiologiques, comportementaux et médicaux de l’animal",
  "Les obligations légales et réglementaires liées à la détention d’un animal",
  "Les coûts d’entretien et de soins vétérinaires",
  "L’engagement à long terme que représente l’adoption",
  "Les conséquences d’un abandon ou d’une négligence",
] as const;

const PRACTICAL = [
  {
    title: "Qui peut adopter ?",
    body: "Toute personne majeure. Un mineur doit être accompagné d’un représentant légal, qui signe le certificat d’engagement et de connaissance.",
  },
  {
    title: "Délai de réflexion",
    body: "Le délai de 7 jours commence à la signature du certificat. Pendant ce temps, vous réfléchissez sereinement : l’animal ne peut pas vous être remis avant.",
  },
  {
    title: "Santé et traçabilité",
    body: "Nos chiots et chatons sont identifiés (puce électronique), suivis vétérinairement et remis avec leur carnet de santé et les documents prévus.",
  },
  {
    title: "Visites et envois",
    body: "Les visites sont possibles sur rendez-vous. Les envois se font partout en France et à l’étranger, avec des transporteurs de confiance.",
  },
  {
    title: "Garanties et suivi",
    body: "Après l’adoption, l’élevage reste votre interlocuteur : conseils sur l’éducation, la santé et le bien-être de votre compagnon.",
  },
] as const;

export default function AdoptionPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Adoption responsable"
        title="Comment adopter"
        description="Un processus simple, encadré et bienveillant pour accueillir votre compagnon au Domaine Sibérania."
        image={siteImages.homeAdoption}
        imageAlt="Chiot prêt à rejoindre sa famille au Domaine Sibérania"
      />

      <section className="border-b border-line bg-background-elevated/35">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <SectionHeading
            size="page"
            eyebrow="Parcours"
            title="L’adoption en 6 étapes"
            description="De la découverte des profils jusqu’à l’arrivée chez vous — le même cadre légal et le même soin, que vous veniez sur place ou à distance."
          />
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="font-serif text-2xl text-gold/80" aria-hidden>
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-foreground">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading
            size="page"
            eyebrow="Cadre légal"
            title="Le certificat d’engagement et de connaissance"
            description="Depuis la loi du 30 novembre 2021, ce document doit être signé avant toute adoption d’animal de compagnie (article D.214-32-4 du Code rural et de la pêche maritime)."
          />

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div className="space-y-8 text-base leading-relaxed text-foreground/85">
              <div>
                <h3 className="font-serif text-xl text-foreground">Obligation légale</h3>
                <p className="mt-3 text-foreground-muted">
                  Le certificat doit être signé par l’adoptant au minimum 7 jours avant
                  l’acquisition de l’animal. C’est une obligation depuis le 1er octobre 2022.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">Délai de réflexion</h3>
                <p className="mt-3 text-foreground-muted">
                  Un délai de 7 jours minimum sépare la signature du certificat et la remise
                  effective de l’animal. Il vous permet de mesurer sereinement votre engagement.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">Protection de l’animal</h3>
                <p className="mt-3 text-foreground-muted">
                  Ce certificat atteste que vous avez pris conscience des responsabilités liées
                  à l’adoption et contribue à lutter contre les abandons.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl text-foreground">Contenu du certificat</h3>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-foreground-muted">
                {CAC_POINTS.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 max-w-3xl space-y-6 text-base leading-relaxed text-foreground/85">
            <h3 className="font-serif text-2xl text-foreground">Comment l’obtenir ?</h3>
            <p className="text-foreground-muted">
              Téléchargez le certificat chien ou chat sur la page{" "}
              <Link href="/certificat-engagement" className="text-gold-soft hover:underline">
                certificat d’engagement
              </Link>
              , signez-le (manuscritement ou électroniquement), puis renvoyez-nous le document
              daté. Il doit aussi être signé par l’élevage, au plus tard 7 jours avant le départ
              de l’animal.
            </p>
            <p className="text-foreground-muted">
              Si la signature n’a pas encore eu lieu lors d’une visite, le délai de réflexion
              commence à la date de signature : l’animal ne pourra pas vous être remis avant
              ces 7 jours.
            </p>
            <div className="pt-2">
              <ButtonLink href="/certificat-engagement">Télécharger les certificats</ButtonLink>
            </div>
            <p className="text-sm text-foreground-muted/90">
              Au Domaine Sibérania, toutes les cessions sont soumises à cette obligation,
              conformément à la réglementation en vigueur.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-background-elevated/30">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading
            size="page"
            eyebrow="Informations pratiques"
            title="Avant de vous lancer"
            description="Les points essentiels pour préparer une adoption sereine et responsable."
          />
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICAL.map((item) => (
              <li key={item.title}>
                <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-foreground-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            size="section"
            eyebrow="Prêt à adopter ?"
            title="Parlons de votre projet"
            description="Consultez les profils disponibles ou écrivez-nous : on vous guide pas à pas."
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/annuaire?statut=disponible">
              <PetitsCoeursLabel
                leading="Voir les disponibles"
                iconClassName="h-3.5 w-3.5"
              />
            </ButtonLink>
            <ButtonLink href="/certificat-engagement" variant="ghost">
              Certificat d’engagement
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
