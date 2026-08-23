import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  /** Sur photo ou fond chargé : fond opaque et contraste renforcé. */
  onMedia?: boolean;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  onMedia = false,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-300";
  const styles = onMedia
    ? variant === "primary"
      ? "border border-gold bg-gold text-background hover:bg-gold-soft hover:text-background"
      : "border border-foreground/45 bg-[#14110e]/94 text-foreground backdrop-blur-sm hover:border-gold/55 hover:text-gold-soft"
    : variant === "primary"
      ? "border border-gold/50 bg-gold/12 text-gold-soft hover:bg-gold/22"
      : "border border-line text-foreground/85 hover:border-gold/40 hover:text-gold-soft";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
