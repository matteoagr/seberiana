import Link from "next/link";
import { archiveAnimalAction } from "@/app/admin/actions";
import { sexLabels, statusLabels } from "@/lib/labels";
import type { AnimalRow } from "@/lib/supabase/types";

export function LitterYoungSection({
  litterId,
  litterTitle,
  young,
  photoCounts = {},
}: {
  litterId: string;
  litterTitle: string;
  young: AnimalRow[];
  photoCounts?: Record<string, number>;
}) {
  return (
    <section className="mt-14 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Jeunes de la portée</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Chiots ou chatons rattachés à « {litterTitle} » — statut et photo ici.
          </p>
        </div>
        <Link
          href={`/admin/portees/${litterId}/jeunes/nouveau`}
          className="rounded-lg border border-gold/50 bg-gold/12 px-4 py-2 text-sm text-gold-soft hover:bg-gold/22"
        >
          + Ajouter un jeune
        </Link>
      </div>

      {young.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line/70 px-6 py-10 text-center">
          <p className="text-sm text-foreground-muted">
            Aucun jeune dans cette portée pour l’instant.
          </p>
          <Link
            href={`/admin/portees/${litterId}/jeunes/nouveau`}
            className="mt-4 inline-block text-sm text-gold-soft hover:text-gold"
          >
            Ajouter le premier
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line/60">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-line bg-background-elevated/60 text-foreground-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Sexe</th>
                <th className="px-4 py-3 font-medium">Couleur</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Photos</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {young.map((animal) => (
                <tr key={animal.id} className="border-b border-line/40">
                  <td className="px-4 py-3 text-foreground">{animal.name}</td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {sexLabels[animal.sex]}
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {animal.color || "—"}
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {statusLabels[animal.status]}
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {photoCounts[animal.id] ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/portees/${litterId}/jeunes/${animal.id}`}
                        className="text-gold-soft hover:text-gold"
                      >
                        Modifier
                      </Link>
                      <Link
                        href={`/admin/portees/${litterId}/jeunes/${animal.id}#photos`}
                        className="text-foreground-muted hover:text-gold-soft"
                      >
                        Photos
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await archiveAnimalAction(animal.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-foreground-muted hover:text-gold-soft"
                        >
                          Retirer
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
