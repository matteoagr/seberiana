import Image from "next/image";
import type { ReactNode } from "react";

type PageHeroProps = {
  title: ReactNode;
  description: string;
  image: string;
  imageAlt: string;
  eyebrow?: ReactNode;
  /** Pages intérieures : hero plus compact et titres plus lisibles. */
  compact?: boolean;
  /** Hero court pour laisser le contenu suivant au-dessus de la ligne de flottaison. */
  short?: boolean;
};

export function PageHero({
  title,
  description,
  image,
  imageAlt,
  eyebrow,
  compact = false,
  short = false,
}: PageHeroProps) {
  const tight = short || compact;

  return (
    <section
      className={`relative isolate overflow-hidden pt-24 ${
        short
          ? "min-h-[26vh] sm:min-h-[30vh]"
          : compact
            ? "min-h-[42vh] sm:min-h-[46vh]"
            : "min-h-[52vh] sm:min-h-[58vh]"
      }`}
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          className="object-cover ken-burns"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(16,15,13,0.55)_100%)]" />
      </div>

      <div
        className={`mx-auto flex max-w-6xl flex-col justify-end px-5 sm:px-8 ${
          short
            ? "pb-6 pt-12 sm:pb-8 sm:pt-14"
            : "pb-12 pt-20 sm:pb-16 sm:pt-24"
        }`}
      >
        {eyebrow ? (
          <div
            className={`reveal mb-2 text-gold/85 ${
              tight
                ? "text-xs font-medium uppercase tracking-[0.14em]"
                : "font-serif text-sm text-gold/90"
            }`}
          >
            {eyebrow}
          </div>
        ) : null}
        <h1
          className={`reveal reveal-delay-1 max-w-3xl font-serif leading-tight text-foreground text-balance ${
            tight
              ? "text-3xl sm:text-4xl lg:text-[2.625rem]"
              : "text-4xl leading-[1.15] sm:text-5xl md:text-6xl"
          }`}
        >
          {title}
        </h1>
        <p
          className={`reveal reveal-delay-2 mt-4 max-w-xl leading-relaxed text-foreground/85 ${
            tight ? "text-lg sm:text-xl" : "text-lg sm:text-xl"
          }`}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
