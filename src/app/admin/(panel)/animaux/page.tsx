import Link from "next/link";
import { AnimalsTable } from "@/components/admin/AnimalsTable";
import { adminListAnimalsDetailed } from "@/lib/supabase/queries";

export default async function AdminAnimauxPage() {
  const animals = await adminListAnimalsDetailed();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-serif text-sm text-gold/90">Tous les animaux</p>
          <h1 className="mt-1 font-serif text-3xl text-foreground">Animaux</h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground-muted">
            Récapitulatif de tous les profils. Pour changer une info ou les
            photos, ouvrez la fiche avec Modifier.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/portees"
            className="rounded-lg border border-line px-4 py-2 text-sm text-foreground-muted hover:border-gold/40 hover:text-gold-soft"
          >
            Portées
          </Link>
          <Link
            href="/admin/reproducteurs/nouveau"
            className="rounded-lg border border-gold/50 bg-gold/12 px-4 py-2 text-sm text-gold-soft hover:bg-gold/22"
          >
            Nouveau reproducteur
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <AnimalsTable animals={animals} />
      </div>
    </div>
  );
}
