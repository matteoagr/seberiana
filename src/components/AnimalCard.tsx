import Image from "next/image";
import Link from "next/link";
import { SexBadge } from "./SexBadge";
import { StatusBadge } from "./StatusBadge";
import type { AnimalCardModel } from "@/lib/supabase/types";
import { formatBirthDate } from "@/lib/labels";

export function AnimalCard({
  animal,
  showCta = false,
}: {
  animal: AnimalCardModel;
  showCta?: boolean;
}) {
  const href = `/annuaire/${animal.id}`;
  const canContact =
    showCta && (animal.status === "disponible" || animal.status === "reserve");
  const interest =
    animal.breed === "Pomsky"
      ? "pomsky"
      : animal.breed === "Shiba Inu"
        ? "shiba"
        : animal.breed === "Teckel"
          ? "teckel"
          : "maine-coon";
  const contactHref = `/contact?animal=${encodeURIComponent(animal.name)}&interest=${interest}`;

  const metaParts = [
    animal.color || null,
    animal.birthDate ? formatBirthDate(animal.birthDate) : null,
    animal.parentsLabel || animal.lineage,
  ].filter(Boolean);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line/60 bg-background-elevated/50 transition-[border-color,transform] duration-500 hover:border-gold/35">
      <Link href={href} className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={animal.image}
          alt={animal.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        <div className="absolute top-3 left-3">
          <SexBadge sex={animal.sexRaw} onMedia />
        </div>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          <StatusBadge status={animal.status} onMedia />
          {animal.isLof ? (
            <span className="rounded-full bg-[#14110e]/92 px-2.5 py-1 text-[11px] font-medium tracking-wide text-gold-soft shadow-[0_2px_10px_rgba(0,0,0,0.45)] ring-1 ring-gold/40 backdrop-blur-md">
              LOF
            </span>
          ) : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-serif text-sm text-gold/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]">
            {animal.breed}
          </p>
          <h3 className="mt-1 font-serif text-2xl text-foreground drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)]">
            {animal.name}
          </h3>
        </div>
      </Link>
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <p className="text-sm text-foreground-muted">{metaParts.join(" · ")}</p>
        {animal.description ? (
          <p className="flex-1 text-sm leading-relaxed text-foreground/80 line-clamp-3">
            {animal.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href={href}
            className="inline-flex text-sm font-medium text-gold-soft transition-colors hover:text-gold"
          >
            Voir le profil →
          </Link>
          {canContact ? (
            <Link
              href={contactHref}
              className="inline-flex text-sm text-foreground-muted transition-colors hover:text-gold-soft"
            >
              {animal.status === "disponible" ? "Nous contacter" : "Poser une question"}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
