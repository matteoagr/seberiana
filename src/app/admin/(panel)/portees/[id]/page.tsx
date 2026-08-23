import { notFound } from "next/navigation";
import Link from "next/link";
import { LitterForm } from "@/components/admin/LitterForm";
import { LitterYoungSection } from "@/components/admin/LitterYoungSection";
import {
  adminAnimalOptions,
  adminGetLitterDetail,
  adminMediaCountsByAnimal,
} from "@/lib/supabase/queries";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPorteePage({ params }: PageProps) {
  const { id } = await params;
  const [detail, allAnimals] = await Promise.all([
    adminGetLitterDetail(id),
    adminAnimalOptions(),
  ]);

  if (!detail) notFound();

  const breeders = allAnimals.filter((a) => a.role === "reproducteur");
  const photoCounts = await adminMediaCountsByAnimal(detail.young.map((y) => y.id));

  return (
    <div>
      <Link
        href="/admin/portees"
        className="text-sm text-foreground-muted hover:text-gold-soft"
      >
        ← Portées
      </Link>
      <p className="mt-4 font-serif text-sm text-gold/90">Portée</p>
      <h1 className="mt-1 font-serif text-3xl text-foreground">{detail.title}</h1>

      <div className="mt-10 rounded-xl border border-line/60 bg-background-elevated/20 p-6 sm:p-8">
        <h2 className="font-serif text-xl text-foreground">Informations de la portée</h2>
        <p className="mt-1 mb-8 text-sm text-foreground-muted">
          Parents, date et visibilité — enregistrez avant d’ajouter les jeunes.
        </p>
        <LitterForm litter={detail} breeders={breeders} />
      </div>

      <LitterYoungSection
        litterId={detail.id}
        litterTitle={detail.title}
        young={detail.young}
        photoCounts={photoCounts}
      />
    </div>
  );
}
