-- Domaine Sibérania — schéma léger (animaux + portées + médias)
-- Appliqué via MCP apply_migration: lightweight_schema_v2
-- Remplace breeds / animal_photos / galleries / gallery_photos

create extension if not exists "pgcrypto";

do $$ begin create type public.species as enum ('canin', 'felin'); exception when duplicate_object then null; end $$;
do $$ begin create type public.animal_status as enum ('disponible', 'reserve', 'adopte'); exception when duplicate_object then null; end $$;
do $$ begin create type public.animal_role as enum ('reproducteur', 'jeune', 'autre'); exception when duplicate_object then null; end $$;
do $$ begin create type public.animal_sex as enum ('male', 'female'); exception when duplicate_object then null; end $$;
do $$ begin create type public.litter_status as enum ('a_venir', 'nee', 'cloturee'); exception when duplicate_object then null; end $$;
do $$ begin create type public.contact_status as enum ('nouveau', 'lu', 'repondu'); exception when duplicate_object then null; end $$;

drop table if exists public.gallery_photos cascade;
drop table if exists public.galleries cascade;
drop table if exists public.animal_photos cascade;
drop table if exists public.contact_requests cascade;
drop table if exists public.media cascade;
drop table if exists public.animals cascade;
drop table if exists public.litters cascade;
drop table if exists public.breeds cascade;
drop type if exists public.gallery_context cascade;

create table public.litters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  species public.species not null,
  breed text not null,
  sire_id uuid,
  dam_id uuid,
  birth_date date,
  status public.litter_status not null default 'a_venir',
  description text not null default '',
  cover_image_path text,
  published boolean not null default true,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.animals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species public.species not null,
  breed text not null,
  sex public.animal_sex not null,
  birth_date date,
  color text not null default '',
  status public.animal_status not null default 'disponible',
  role public.animal_role not null default 'jeune',
  is_lof boolean not null default false,
  litter_id uuid references public.litters(id) on delete set null,
  sire_id uuid references public.animals(id) on delete set null,
  dam_id uuid references public.animals(id) on delete set null,
  lineage_label text not null default '',
  description text not null default '',
  cover_image_path text,
  cover_url text,
  published boolean not null default true,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.litters
  add constraint litters_sire_id_fkey foreign key (sire_id) references public.animals(id) on delete set null,
  add constraint litters_dam_id_fkey foreign key (dam_id) references public.animals(id) on delete set null;

create table public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  alt_text text not null default '',
  sort_order int not null default 0,
  is_cover boolean not null default false,
  animal_id uuid references public.animals(id) on delete cascade,
  litter_id uuid references public.litters(id) on delete cascade,
  gallery_key text,
  created_at timestamptz not null default now(),
  constraint media_one_target check (
    (animal_id is not null)::int +
    (litter_id is not null)::int +
    (gallery_key is not null)::int >= 1
  )
);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  interest text not null default 'annuaire',
  animal_id uuid references public.animals(id) on delete set null,
  message text not null default '',
  status public.contact_status not null default 'nouveau',
  created_at timestamptz not null default now()
);

create index animals_status_idx on public.animals(status);
create index animals_species_idx on public.animals(species);
create index animals_breed_idx on public.animals(breed);
create index animals_role_idx on public.animals(role);
create index animals_litter_id_idx on public.animals(litter_id);
create index animals_published_idx on public.animals(published, archived);
create index litters_published_idx on public.litters(published, archived);
create index litters_species_idx on public.litters(species);
create index media_animal_id_idx on public.media(animal_id);
create index media_litter_id_idx on public.media(litter_id);
create index media_gallery_key_idx on public.media(gallery_key);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists animals_set_updated_at on public.animals;
create trigger animals_set_updated_at
  before update on public.animals
  for each row execute function public.set_updated_at();

drop trigger if exists litters_set_updated_at on public.litters;
create trigger litters_set_updated_at
  before update on public.litters
  for each row execute function public.set_updated_at();

alter table public.animals enable row level security;
alter table public.litters enable row level security;
alter table public.media enable row level security;
alter table public.contact_requests enable row level security;

create policy "Public read animals" on public.animals
  for select to anon, authenticated
  using (published = true and archived = false);

create policy "Public read litters" on public.litters
  for select to anon, authenticated
  using (published = true and archived = false);

create policy "Public read media" on public.media
  for select to anon, authenticated
  using (
    (animal_id is not null and exists (
      select 1 from public.animals a
      where a.id = animal_id and a.published and not a.archived
    ))
    or (litter_id is not null and exists (
      select 1 from public.litters l
      where l.id = litter_id and l.published and not l.archived
    ))
    or gallery_key is not null
  );

create policy "Public insert contact" on public.contact_requests
  for insert to anon, authenticated with check (true);

create policy "Auth all animals" on public.animals
  for all to authenticated using (true) with check (true);

create policy "Auth all litters" on public.litters
  for all to authenticated using (true) with check (true);

create policy "Auth all media" on public.media
  for all to authenticated using (true) with check (true);

create policy "Auth read contact" on public.contact_requests
  for select to authenticated using (true);

create policy "Auth update contact" on public.contact_requests
  for update to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values
  ('animals', 'animals', true),
  ('galleries', 'galleries', true),
  ('litters', 'litters', true),
  ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read animals bucket" on storage.objects;
drop policy if exists "Public read media buckets" on storage.objects;
drop policy if exists "Auth upload media buckets" on storage.objects;
drop policy if exists "Auth update media buckets" on storage.objects;
drop policy if exists "Auth delete media buckets" on storage.objects;

create policy "Public read media buckets" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('animals', 'galleries', 'litters', 'media'));

create policy "Auth upload media buckets" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('animals', 'galleries', 'litters', 'media'));

create policy "Auth update media buckets" on storage.objects
  for update to authenticated
  using (bucket_id in ('animals', 'galleries', 'litters', 'media'))
  with check (bucket_id in ('animals', 'galleries', 'litters', 'media'));

create policy "Auth delete media buckets" on storage.objects
  for delete to authenticated
  using (bucket_id in ('animals', 'galleries', 'litters', 'media'));
