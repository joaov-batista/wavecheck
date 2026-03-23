-- ============================================================
-- WaveCheck — Schema SQL para Supabase
-- Cole este arquivo inteiro no SQL Editor do Supabase e execute
-- ============================================================

-- ─────────────────────────────────────────
-- 1. PERFIS DE USUÁRIO
-- ─────────────────────────────────────────
create table public.profiles (
  id             uuid references auth.users on delete cascade primary key,
  username       text not null,
  avatar_letter  text generated always as (upper(left(username, 1))) stored,
  favorite_beach_id text default 'rosa',
  points         integer default 0,
  streak         integer default 0,
  best_streak    integer default 0,
  total_sessions integer default 0,
  total_checkins integer default 0,
  early_bird     boolean default false,
  classic_day    boolean default false,
  big_wave       boolean default false,
  created_at     timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Perfis visíveis a todos autenticados"
  on public.profiles for select using (auth.role() = 'authenticated');

create policy "Usuário edita próprio perfil"
  on public.profiles for update using (auth.uid() = id);

create policy "Usuário insere próprio perfil"
  on public.profiles for insert with check (auth.uid() = id);

-- ─────────────────────────────────────────
-- 2. PRAIAS
-- ─────────────────────────────────────────
create table public.beaches (
  id          text primary key,
  name        text not null,
  region      text not null,
  latitude    double precision not null,
  longitude   double precision not null,
  orientation text,
  gradient    text,
  description text,
  created_at  timestamptz default now()
);

alter table public.beaches enable row level security;
create policy "Praias visíveis a todos" on public.beaches for select using (true);

-- ─────────────────────────────────────────
-- 3. SESSÕES (agenda "vou surfar")
-- ─────────────────────────────────────────
create table public.sessions (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles on delete cascade not null,
  beach_id     text references public.beaches not null,
  session_date date not null,
  session_time time not null,
  note         text,
  checked_in   boolean default false,
  created_at   timestamptz default now()
);

alter table public.sessions enable row level security;

create policy "Sessões visíveis a todos autenticados"
  on public.sessions for select using (auth.role() = 'authenticated');
create policy "Usuário cria próprias sessões"
  on public.sessions for insert with check (auth.uid() = user_id);
create policy "Usuário edita próprias sessões"
  on public.sessions for update using (auth.uid() = user_id);
create policy "Usuário deleta próprias sessões"
  on public.sessions for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 4. CHECK-INS
-- ─────────────────────────────────────────
create table public.checkins (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles on delete cascade not null,
  session_id   uuid references public.sessions on delete set null,
  beach_id     text references public.beaches not null,
  checkin_date date default current_date,
  feeling      text check (feeling in ('ruim','ok','bom','classico')) not null,
  comment      text,
  wave_score   numeric(4,1),
  created_at   timestamptz default now()
);

alter table public.checkins enable row level security;

create policy "Checkins visíveis a todos autenticados"
  on public.checkins for select using (auth.role() = 'authenticated');
create policy "Usuário insere próprios checkins"
  on public.checkins for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 5. SEED — PRAIAS
-- ─────────────────────────────────────────
insert into public.beaches (id, name, region, latitude, longitude, orientation, gradient, description) values
  ('rosa',       'Praia do Rosa',   'SC, Brasil', -28.1250, -48.6550, 'Sul',   'linear-gradient(135deg,#0a3d62,#1e6091,#2980b9)', 'Direita bem consistente, ideal para swell de sul.'),
  ('joaquina',   'Joaquina',        'SC, Brasil', -27.6400, -48.4700, 'Leste', 'linear-gradient(135deg,#1a3a4a,#0f6e7c,#16a085)', 'Beach break poderoso, tubo bem fechado.'),
  ('campeche',   'Campeche',        'SC, Brasil', -27.7100, -48.4750, 'Sul-L', 'linear-gradient(135deg,#0d3b5e,#155799,#159957)', 'Ondas longas, ótima para longboard.'),
  ('ferrugem',   'Ferrugem',        'SC, Brasil', -28.2100, -48.6950, 'Sul',   'linear-gradient(135deg,#4a1a2a,#8e2950,#c0392b)', 'Ondas pesadas e tubulares. Intermediário+.'),
  ('itamambuca', 'Itamambuca',      'SP, Brasil', -23.3700, -44.8300, 'Leste', 'linear-gradient(135deg,#1a3a2a,#27ae60,#1abc9c)', 'Beach break consistente, excelente banco de areia.'),
  ('maresias',   'Maresias',        'SP, Brasil', -23.7900, -45.5600, 'Sul-L', 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)', 'Ondas tubulares de direita, uma das melhores de SP.'),
  ('barra',      'Barra da Tijuca', 'RJ, Brasil', -23.0100, -43.3600, 'Sul',   'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)', 'Praia urbana com ondas consistentes de sul.');

-- ─────────────────────────────────────────
-- 6. TRIGGER: criar perfil ao registrar
-- ─────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────
-- 7. VIEW: feed público da comunidade
-- ─────────────────────────────────────────
create or replace view public.community_feed as
  select
    c.id, c.user_id, p.username, p.avatar_letter,
    b.name as beach_name, b.id as beach_id,
    c.feeling, c.comment, c.wave_score,
    c.checkin_date as entry_date, c.created_at,
    'checkin' as entry_type
  from public.checkins c
  join public.profiles p on p.id = c.user_id
  join public.beaches  b on b.id = c.beach_id
union all
  select
    s.id, s.user_id, p.username, p.avatar_letter,
    b.name as beach_name, b.id as beach_id,
    null as feeling, s.note as comment, null as wave_score,
    s.session_date as entry_date, s.created_at,
    'session' as entry_type
  from public.sessions s
  join public.profiles p on p.id = s.user_id
  join public.beaches  b on b.id = s.beach_id
  where s.session_date >= current_date;
