import { notFound } from "next/navigation";
import { AnimalForm } from "@/components/admin/AnimalForm";
import { adminGetAnimal } from "@/lib/supabase/queries";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditReproducteurPage({ params }: PageProps) {
  const { id } = await params;
  const animal = await adminGetAnimal(id);
  if (!animal || animal.role !== "reproducteur") notFound();

  return (
    <div>
      <p className="font-serif text-sm text-gold/90">Reproducteurs</p>
      <h1 className="mt-1 font-serif text-3xl text-foreground">
        Modifier {animal.name}
      </h1>
      <div className="mt-10 max-w-2xl">
        <AnimalForm
          variant="breeder"
          animal={animal}
          cancelHref="/admin/reproducteurs"
        />
      </div>
    </div>
  );
}
