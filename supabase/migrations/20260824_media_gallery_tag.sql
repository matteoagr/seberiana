-- Catégorie des photos de galerie (pomsky, teckel, etc.) pour filtres publics
alter table public.media
  add column if not exists gallery_tag text;

alter table public.media
  drop constraint if exists media_gallery_tag_check;

alter table public.media
  add constraint media_gallery_tag_check check (
    gallery_tag is null
    or gallery_tag in ('pomsky', 'teckel', 'maine-coon', 'shiba', 'domaine')
  );

create index if not exists media_gallery_tag_idx
  on public.media (gallery_key, gallery_tag);

comment on column public.media.gallery_tag is
  'Thème de la photo de galerie : pomsky, teckel, maine-coon, shiba, domaine.';
