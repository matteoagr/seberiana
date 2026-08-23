-- Reproducteurs visibles sur fiche publique même s'ils ne sont pas dans l'annuaire
drop policy if exists "Public read animals" on public.animals;

create policy "Public read animals" on public.animals
  for select to anon, authenticated
  using (
    archived = false
    and (
      published = true
      or role = 'reproducteur'
    )
  );

drop policy if exists "Public read media" on public.media;

create policy "Public read media" on public.media
  for select to anon, authenticated
  using (
    (animal_id is not null and exists (
      select 1 from public.animals a
      where a.id = animal_id
        and not a.archived
        and (a.published or a.role = 'reproducteur')
    ))
    or (litter_id is not null and exists (
      select 1 from public.litters l
      where l.id = litter_id and l.published and not l.archived
    ))
    or gallery_key is not null
  );
