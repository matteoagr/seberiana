import Image from "next/image";
import Link from "next/link";
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
    animal.sex,
    animal.color || null,
    animal.birthDate ? formatBirthDate(animal.birthDate) : null,
    animal.parentsLabel || animal.lineage,
  ].filter(Boolean);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line/60 bg-background-elevated/50 transition-[border-color,transform] duration-500 hover:border-gold/35">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={animal.image}
          alt={animal.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          <StatusBadge status={animal.status} />
          {animal.isLof ? (
            <span className="rounded-md border border-gold/40 bg-background/70 px-2 py-0.5 text-[11px] font-medium tracking-wide text-gold-soft">
              LOF
            </span>
          ) : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-serif text-sm text-gold/90">{animal.breed}</p>
          <h3 className="mt-1 font-serif text-2xl text-foreground">{animal.name}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <p className="text-sm text-foreground-muted">{metaParts.join(" · ")}</p>
        <p className="flex-1 text-sm leading-relaxed text-foreground/80">
          {animal.description}
        </p>
        {canContact ? (
          <Link
            href={contactHref}
            className="mt-2 inline-flex text-sm font-medium text-gold-soft transition-colors hover:text-gold"
          >
            {animal.status === "disponible"
              ? "Nous contacter →"
              : "Poser une question →"}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
