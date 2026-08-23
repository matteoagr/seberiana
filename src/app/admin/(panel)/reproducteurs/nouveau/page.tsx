import { AnimalForm } from "@/components/admin/AnimalForm";

export default function NouveauReproducteurPage() {
  return (
    <div>
      <p className="font-serif text-sm text-gold/90">Reproducteurs</p>
      <h1 className="mt-1 font-serif text-3xl text-foreground">Nouveau reproducteur</h1>
      <div className="mt-10 max-w-2xl">
        <AnimalForm variant="breeder" cancelHref="/admin/reproducteurs" />
      </div>
    </div>
  );
}
