import { redirect, notFound } from "next/navigation";
import { adminGetAnimal } from "@/lib/supabase/queries";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditAnimalRedirect({ params }: PageProps) {
  const { id } = await params;
  const animal = await adminGetAnimal(id);
  if (!animal) notFound();

  if (animal.role === "reproducteur") {
    redirect(`/admin/reproducteurs/${id}`);
  }
  if (animal.litter_id) {
    redirect(`/admin/portees/${animal.litter_id}/jeunes/${id}`);
  }
  redirect("/admin/portees");
}
