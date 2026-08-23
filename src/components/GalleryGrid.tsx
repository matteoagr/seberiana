import Image from "next/image";

type GalleryGridProps = {
  images: { src: string; alt: string }[];
};

export function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <figure
          key={image.src}
          className={`relative overflow-hidden border border-line/50 ${
            index === 0 ? "sm:col-span-2 sm:row-span-2 min-h-[280px]" : "min-h-[220px]"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </figure>
      ))}
    </div>
  );
}
