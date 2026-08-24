alter table public.litters add column if not exists deleted_at timestamptz;

drop policy if exists "Public read litters" on public.litters;
create policy "Public read litters" on public.litters
  for select to anon, authenticated
  using (published = true and archived = false and deleted_at is null);

drop policy if exists "Public read media" on public.media;
create policy "Public read media" on public.media
  for select to anon, authenticated
  using (
    (animal_id is not null and exists (
      select 1 from public.animals a
      where a.id = animal_id and a.published and not a.archived
    ))
    or (litter_id is not null and exists (
      select 1 from public.litters l
      where l.id = litter_id and l.published and not l.archived and l.deleted_at is null
    ))
    or gallery_key is not null
  );
