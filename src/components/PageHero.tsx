import Image from "next/image";

type PageHeroProps = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  eyebrow?: string;
};

export function PageHero({
  title,
  description,
  image,
  imageAlt,
  eyebrow,
}: PageHeroProps) {
  return (
    <section className="relative isolate min-h-[52vh] overflow-hidden pt-24 sm:min-h-[58vh]">
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

      <div className="mx-auto flex max-w-6xl flex-col justify-end px-5 pb-16 pt-24 sm:px-8 sm:pb-20">
        {eyebrow ? (
          <p className="reveal mb-3 font-serif text-sm text-gold/90">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="reveal reveal-delay-1 max-w-3xl font-serif text-4xl leading-[1.15] text-foreground text-balance sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="reveal reveal-delay-2 mt-5 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
