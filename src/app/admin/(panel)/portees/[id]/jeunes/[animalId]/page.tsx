import { notFound } from "next/navigation";
import Link from "next/link";
import { AnimalForm } from "@/components/admin/AnimalForm";
import { AnimalPhotosManager } from "@/components/admin/AnimalPhotosManager";
import {
  adminGetAnimal,
  adminGetLitterDetail,
  adminListAnimalMedia,
} from "@/lib/supabase/queries";

type PageProps = { params: Promise<{ id: string; animalId: string }> };

export default async function EditJeunePage({ params }: PageProps) {
  const { id, animalId } = await params;
  const [litter, animal, photos] = await Promise.all([
    adminGetLitterDetail(id),
    adminGetAnimal(animalId),
    adminListAnimalMedia(animalId),
  ]);

  if (!litter || !animal || animal.litter_id !== id) notFound();

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
        Modifier {animal.name}
      </h1>
      <div className="mt-10 max-w-2xl">
        <AnimalForm
          variant="young"
          animal={animal}
          litter={litter}
          returnTo={`/admin/portees/${id}`}
          cancelHref={`/admin/portees/${id}`}
        />
      </div>
      <AnimalPhotosManager
        animalId={animal.id}
        animalName={animal.name}
        litterId={id}
        photos={photos}
      />
    </div>
  );
}
