import Link from "next/link";
import { LitterForm } from "@/components/admin/LitterForm";
import { adminAnimalOptions } from "@/lib/supabase/queries";

export default async function NouvellePorteePage() {
  const animals = await adminAnimalOptions();
  const breeders = animals.filter((a) => a.role === "reproducteur");

  return (
    <div>
      <Link
        href="/admin/portees"
        className="text-sm text-foreground-muted hover:text-gold-soft"
      >
        ← Portées
      </Link>
      <p className="mt-4 font-serif text-sm text-gold/90">Portée</p>
      <h1 className="mt-1 font-serif text-3xl text-foreground">Nouvelle portée</h1>
      <p className="mt-2 text-sm text-foreground-muted">
        Créez la portée puis ajoutez les jeunes depuis la fiche suivante.
      </p>
      <div className="mt-10 max-w-3xl">
        <LitterForm breeders={breeders} />
      </div>
    </div>
  );
}
