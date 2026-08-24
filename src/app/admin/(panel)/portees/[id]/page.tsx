import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { LitterForm } from "@/components/admin/LitterForm";
import { LitterYoungSection } from "@/components/admin/LitterYoungSection";
import { deleteLitterAction, unarchiveLitterAction } from "@/app/admin/actions";
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

      {detail.archived ? (
        <div className="mt-6 rounded-xl border border-gold/30 bg-gold/8 p-4 sm:p-5">
          <p className="font-serif text-sm text-gold-soft">Portée archivée</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Elle n’apparaît plus sur le site public. Les données restent ici en historique.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <form
              action={async () => {
                "use server";
                await unarchiveLitterAction(detail.id);
                redirect("/admin/portees?ok=en-ligne");
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm text-gold-soft hover:bg-gold/18"
              >
                Remettre en ligne
              </button>
            </form>
            <form
              action={async () => {
                "use server";
                await deleteLitterAction(detail.id);
                redirect("/admin/portees?ok=supprime");
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-red-300/30 bg-red-300/10 px-4 py-2 text-sm text-red-200 hover:bg-red-300/15"
              >
                Supprimer de l’admin
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-red-300/20 bg-red-300/5 p-4 sm:p-5">
          <p className="font-serif text-sm text-red-200">Supprimer du site et de l’admin</p>
          <p className="mt-1 text-sm text-foreground-muted">
            La portée disparaît du site et de la liste admin. Elle reste enregistrée en base
            comme historique — sans s’afficher ici.
          </p>
          <form
            action={async () => {
              "use server";
              await deleteLitterAction(detail.id);
              redirect("/admin/portees?ok=supprime");
            }}
          >
            <button
              type="submit"
              className="mt-3 rounded-lg border border-red-300/30 bg-red-300/10 px-4 py-2 text-sm text-red-200 hover:bg-red-300/15"
            >
              Supprimer du site
            </button>
          </form>
        </div>
      )}

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
