import { notFound } from "next/navigation";
import Link from "next/link";
import { AnimalForm } from "@/components/admin/AnimalForm";
import { adminGetLitterDetail } from "@/lib/supabase/queries";

type PageProps = { params: Promise<{ id: string }> };

export default async function NouveauJeunePage({ params }: PageProps) {
  const { id } = await params;
  const litter = await adminGetLitterDetail(id);
  if (!litter) notFound();

  return (
    <div>
      <Link
        href={`/admin/portees/${id}`}
        className="text-sm text-foreground-muted hover:text-gold-soft"
      >
        ← {litter.title}
      </Link>
      <p className="mt-4 font-serif text-sm text-gold/90">Jeune</p>
      <h1 className="mt-1 font-serif text-3xl text-foreground">
        Ajouter un jeune
      </h1>
      <p className="mt-2 text-sm text-foreground-muted">
        Le jeune sera rattaché à cette portée. Vous pouvez déjà déposer ses photos
        dans le formulaire — elles s’enregistrent avec le profil.
      </p>
      <div className="mt-10 max-w-2xl">
        <AnimalForm
          variant="young"
          litter={litter}
          returnTo={`/admin/portees/${id}`}
          cancelHref={`/admin/portees/${id}`}
        />
      </div>
    </div>
  );
}
