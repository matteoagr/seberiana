import { MediaAdmin } from "@/components/admin/MediaAdmin";
import {
  adminAnimalOptions,
  adminListMedia,
  adminLitterOptions,
} from "@/lib/supabase/queries";

export default async function AdminMediasPage() {
  const [media, animals, litters] = await Promise.all([
    adminListMedia(),
    adminAnimalOptions(),
    adminLitterOptions(),
  ]);

  return (
    <div>
      <p className="font-serif text-sm text-gold/90">Étape 3</p>
      <h1 className="mt-1 font-serif text-3xl text-foreground">Galerie</h1>
      <p className="mt-3 max-w-xl text-sm text-foreground-muted">
        Photos des pages du site (accueil, élevages) — indépendantes des fiches animaux.
      </p>
      <div className="mt-10">
        <MediaAdmin media={media} animals={animals} litters={litters} />
      </div>
    </div>
  );
}
