import Link from "next/link";
import type { BreedProfile } from "@/data/breeds";

type BreedProfileViewProps = {
  breed: BreedProfile;
};

export function BreedProfileView({ breed }: BreedProfileViewProps) {
  const lofBadgeClass =
    breed.lofAtKennel === "lof"
      ? "border-gold/40 bg-gold/10 text-gold-soft"
      : "border-line bg-background-elevated text-foreground-muted";

  return (
    <article className="pb-20">
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal -mt-6 rounded-2xl border border-line bg-background-elevated/80 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="max-w-2xl text-base leading-relaxed text-foreground/90 sm:text-lg">
              {breed.intro}
            </p>
            <span
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide ${lofBadgeClass}`}
            >
              {breed.lofLabel}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        <h2 className="reveal font-serif text-2xl text-foreground sm:text-3xl">
          Caractéristiques
        </h2>
        <dl className="reveal reveal-delay-1 mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {breed.traits.map((trait) => (
            <div
              key={trait.label}
              className="rounded-xl border border-line bg-background-elevated/60 px-4 py-3"
            >
              <dt className="text-xs uppercase tracking-wide text-gold/80">
                {trait.label}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-foreground/90">
                {trait.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        <h2 className="reveal font-serif text-2xl text-foreground sm:text-3xl">
          En bref
        </h2>
        <ul className="reveal reveal-delay-1 mt-6 grid gap-3 sm:grid-cols-2">
          {breed.highlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-line/80 bg-background-elevated/40 px-4 py-3 text-sm text-foreground/90"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {breed.sections.map((section, index) => (
        <section
          key={section.title}
          className="mx-auto mt-14 max-w-6xl px-5 sm:px-8"
        >
          <h2 className="reveal font-serif text-2xl text-foreground sm:text-3xl">
            {section.title}
          </h2>
          <div className="reveal reveal-delay-1 mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-foreground/85">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <div className="reveal rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/5 to-transparent p-8 sm:p-10">
          <h2 className="font-serif text-2xl text-foreground">
            {breed.name} au Domaine Sibérania
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
            Consultez les jeunes disponibles, les portées en cours ou contactez-nous
            pour en savoir plus sur nos {breed.species === "canin" ? "chiens" : "chats"}{" "}
            {breed.name}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={breed.annuaireHref}
              className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm text-gold-soft transition-colors hover:bg-gold/20"
            >
              Voir l&apos;annuaire {breed.name}
            </Link>
            <Link
              href={breed.elevageHref}
              className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm text-foreground/85 transition-colors hover:border-gold/30 hover:text-gold-soft"
            >
              {breed.species === "canin" ? "Élevage canin" : "Élevage félin"}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm text-foreground/85 transition-colors hover:border-gold/30 hover:text-gold-soft"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
