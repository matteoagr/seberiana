import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimalGallery } from "@/components/AnimalGallery";
import { ButtonLink } from "@/components/ButtonLink";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatBirthDate,
  roleLabels,
  speciesLabels,
} from "@/lib/labels";
import { getPublicAnimalById } from "@/lib/supabase/queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const animal = await getPublicAnimalById(id);

  if (!animal) {
    return { title: "Profil introuvable" };
  }

  const description =
    animal.description?.trim() ||
    `${animal.name} — ${animal.breed} au Domaine Sibérania.`;

  return {
    title: `${animal.name} · ${animal.breed}`,
    description,
    alternates: {
      canonical: `/annuaire/${animal.id}`,
    },
    openGraph: {
      title: `${animal.name} | Domaine Sibérania`,
      description,
      url: `/annuaire/${animal.id}`,
      images: [{ url: animal.photos[0]?.src || animal.image, alt: animal.name }],
    },
  };
}

export default async function AnimalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const animal = await getPublicAnimalById(id);

  if (!animal) {
    notFound();
  }

  const interest =
    animal.breed === "Pomsky"
      ? "pomsky"
      : animal.breed === "Shiba Inu"
        ? "shiba"
        : animal.breed === "Teckel"
          ? "teckel"
          : "maine-coon";

  const contactHref = `/contact?animal=${encodeURIComponent(animal.name)}&interest=${interest}`;
  const canContact =
    animal.status === "disponible" || animal.status === "reserve";

  const facts = [
    { label: "Espèce", value: speciesLabels[animal.species] },
    { label: "Race", value: animal.breed },
    { label: "Sexe", value: animal.sex },
    { label: "Naissance", value: formatBirthDate(animal.birthDate) },
    { label: "Robe", value: animal.color || "—" },
    { label: "Rôle", value: roleLabels[animal.role] },
    {
      label: "LOF / LOOF",
      value: animal.isLof ? "Oui" : "Non",
    },
    {
      label: "Parents",
      value: animal.parentsLabel || animal.lineage || "—",
    },
  ];

  return (
    <article className="pb-20">
      <nav
        aria-label="Fil d'Ariane"
        className="mx-auto max-w-6xl px-5 pt-28 text-sm text-foreground-muted sm:px-8"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors hover:text-gold-soft">
              Accueil
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/annuaire" className="transition-colors hover:text-gold-soft">
              Annuaire
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground/90">{animal.name}</li>
        </ol>
      </nav>

      <section className="mx-auto mt-8 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
        <AnimalGallery photos={animal.photos} animalName={animal.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={animal.status} />
            {animal.isLof ? (
              <span className="inline-flex items-center rounded-full bg-background-elevated px-2.5 py-1 text-[11px] font-medium tracking-wide text-gold-soft ring-1 ring-gold/40">
                LOF
              </span>
            ) : null}
          </div>

          <p className="mt-5 font-serif text-sm text-gold/90">{animal.breed}</p>
          <h1 className="mt-2 font-serif text-4xl text-foreground sm:text-5xl">
            {animal.name}
          </h1>

          {animal.description ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/85">
              {animal.description}
            </p>
          ) : null}

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl border border-line/60 bg-background-elevated/50 px-4 py-3"
              >
                <dt className="text-[11px] uppercase tracking-wide text-gold/75">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm text-foreground/90">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {canContact ? (
              <ButtonLink href={contactHref}>
                {animal.status === "disponible"
                  ? "Nous contacter"
                  : "Poser une question"}
              </ButtonLink>
            ) : null}
            <ButtonLink href="/annuaire" variant="ghost">
              Retour à l’annuaire
            </ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}
