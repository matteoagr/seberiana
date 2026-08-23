type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** display = home ; page = intro de page ; section = bloc principal ; subsection = sous-bloc (race, etc.) */
  size?: "display" | "page" | "section" | "subsection";
};

const titleClass: Record<NonNullable<SectionHeadingProps["size"]>, string> = {
  display: "text-3xl leading-tight sm:text-4xl",
  page: "text-2xl leading-snug sm:text-3xl",
  section: "text-xl leading-snug sm:text-2xl",
  subsection: "text-lg leading-snug sm:text-xl",
};

const eyebrowClass: Record<NonNullable<SectionHeadingProps["size"]>, string> = {
  display: "mb-2 font-serif text-sm text-gold/90",
  page: "mb-2 text-xs font-medium uppercase tracking-[0.14em] text-gold/85",
  section: "mb-2 text-xs font-medium uppercase tracking-[0.14em] text-gold/85",
  subsection: "mb-1.5 text-xs font-medium uppercase tracking-[0.14em] text-gold/85",
};

const descriptionClass: Record<NonNullable<SectionHeadingProps["size"]>, string> = {
  display: "mt-4 text-base leading-relaxed text-foreground-muted text-balance",
  page: "mt-3 text-base leading-relaxed text-foreground/80 text-balance",
  section: "mt-3 text-sm leading-relaxed text-foreground-muted sm:text-base text-balance",
  subsection: "mt-2 text-sm leading-relaxed text-foreground-muted text-balance",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  size = "display",
}: SectionHeadingProps) {
  const TitleTag = size === "subsection" ? "h3" : "h2";

  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className={eyebrowClass[size]}>{eyebrow}</p> : null}
      <TitleTag
        className={`font-serif text-foreground text-balance ${titleClass[size]}`}
      >
        {title}
      </TitleTag>
      {description ? (
        <p className={descriptionClass[size]}>{description}</p>
      ) : null}
    </div>
  );
}
