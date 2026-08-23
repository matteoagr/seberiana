import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  priority?: boolean;
  className?: string;
  /** Pass `null` to render without a link (e.g. hero). */
  href?: string | null;
  size?: "sm" | "md" | "lg" | "hero";
  showWordmark?: boolean;
};

const sizes = {
  sm: { width: 48, height: 48 },
  md: { width: 72, height: 72 },
  lg: { width: 140, height: 140 },
  hero: { width: 280, height: 280 },
};

export function Logo({
  priority = false,
  className = "",
  href = "/",
  size = "md",
  showWordmark = false,
}: LogoProps) {
  const dim = sizes[size];

  const content = (
    <span className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <Image
        src="/brand/logo.png"
        alt="Sibérania"
        width={dim.width}
        height={dim.height}
        priority={priority}
        className="h-auto w-auto select-none"
        sizes={`${dim.width}px`}
      />
      {showWordmark ? (
        <span className="font-serif text-sm text-gold/90 sm:text-base">
          Sibérania
        </span>
      ) : null}
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} aria-label="Sibérania — Accueil" className="outline-none">
      {content}
    </Link>
  );
}
