/** Libellé public de la section profils (ex-annuaire). */
export const PETITS_COEURS = "Nos petits cœurs";
export const PETITS_COEURS_SHORT = "petits cœurs";

type HeartIconProps = {
  className?: string;
  title?: string;
};

/** Icône cœur — remplace le mot « cœurs » dans l’UI. */
export function HeartIcon({
  className = "h-[0.9em] w-[0.9em] shrink-0",
  title,
}: HeartIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

type PetitsCoeursLabelProps = {
  /** Texte avant le cœur. Défaut : « Nos petits ». */
  leading?: string;
  /** Texte après le cœur (ex. « chiens »). */
  trailing?: string;
  className?: string;
  iconClassName?: string;
};

/**
 * Affiche « Nos petits ♥ » (le mot cœurs est remplacé par l’icône).
 * Accessible : le lecteur d’écran lit « cœurs ».
 */
export function PetitsCoeursLabel({
  leading = "Nos petits",
  trailing,
  className = "inline-flex items-center gap-1",
  iconClassName,
}: PetitsCoeursLabelProps) {
  return (
    <span className={className}>
      {leading}
      <HeartIcon className={iconClassName} />
      <span className="sr-only">cœurs</span>
      {trailing ? <span>{trailing}</span> : null}
    </span>
  );
}
