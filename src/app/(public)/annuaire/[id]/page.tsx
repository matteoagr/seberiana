import type { Metadata } from "next";
import Image from "next/image";
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
import type { ParentPreview } from "@/lib/supabase/types";

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

function RelatedAnimalCard({
  animal,
  badge,
}: {
  animal: ParentPreview;
  badge?: string;
}) {
  return (
    <Link
      href={`/annuaire/${animal.id}`}
      className="group overflow-hidden rounded-xl border border-line/60 bg-background-elevated/40 transition-colors hover:border-gold/35"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={animal.image}
          alt={badge ? `${badge} : ${animal.name}` : animal.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 45vw, 220px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        {badge ? (
          <p className="absolute top-3 left-3 rounded-full bg-[#14110e]/90 px-2.5 py-1 text-[11px] font-medium tracking-wide text-gold-soft ring-1 ring-gold/35">
            {badge}
          </p>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-serif text-lg text-foreground">{animal.name}</p>
          {animal.breed ? (
            <p className="mt-0.5 text-xs text-foreground-muted">{animal.breed}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
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
  ];

  const hasParents = Boolean(animal.sire || animal.dam);
  const hasOffspring = animal.offspring.length > 0;
  const hasSiblings = animal.siblings.length > 0;

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

      {hasParents ? (
        <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
            Les parents
          </h2>
          <p className="mt-2 max-w-xl text-sm text-foreground-muted">
            {animal.parentsLabel
              ? `Lignée ${animal.parentsLabel}.`
              : "Père et mère de cette portée."}
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:max-w-2xl">
            {animal.sire ? (
              <RelatedAnimalCard animal={animal.sire} badge="Père" />
            ) : null}
            {animal.dam ? (
              <RelatedAnimalCard animal={animal.dam} badge="Mère" />
            ) : null}
          </div>
        </section>
      ) : null}

      {hasSiblings ? (
        <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
            Frères et sœurs
          </h2>
          <p className="mt-2 max-w-xl text-sm text-foreground-muted">
            {animal.litterTitle
              ? `Même portée : ${animal.litterTitle}.`
              : "Compagnons de la même portée."}
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {animal.siblings.map((sib) => (
              <RelatedAnimalCard key={sib.id} animal={sib} />
            ))}
          </div>
        </section>
      ) : null}

      {hasOffspring ? (
        <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
            Les enfants
          </h2>
          <p className="mt-2 max-w-xl text-sm text-foreground-muted">
            Descendance publiée de {animal.name}.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {animal.offspring.map((child) => (
              <RelatedAnimalCard key={child.id} animal={child} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
