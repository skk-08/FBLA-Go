-- ============================================================
-- FBLAgo Supabase Schema
-- Run this entire file in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. users (mirrors auth.users, adds role) ──────────────────
create table if not exists public.users (
  id        uuid primary key references auth.users(id) on delete cascade,
  email     text not null,
  role      text not null default 'member' check (role in ('member','adviser','admin')),
  created_at timestamptz default now()
);
alter table public.users enable row level security;

create policy "Users can read their own row"
  on public.users for select using (auth.uid() = id);

create policy "Users can update their own row"
  on public.users for update using (auth.uid() = id);

-- auto-insert on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users(id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 2. profiles ───────────────────────────────────────────────
create table if not exists public.profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references public.users(id) on delete cascade,
  full_name           text,
  chapter_name        text,
  chapter_id          uuid,
  grade               int check (grade between 9 and 12),
  role                text default 'member',
  bio                 text,
  interests           text[] default '{}',
  links               jsonb default '{}',
  photo_url           text,
  member_id_url       text,
  onboarding_complete boolean default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
alter table public.profiles enable row level security;

-- Migration for existing databases: add links column if missing
alter table public.profiles add column if not exists links jsonb default '{}';

create policy "Profile owner full access"
  on public.profiles for all using (auth.uid() = user_id);

-- auto-create profile on signup
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles(user_id, full_name, chapter_name, grade)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'chapter_name',
    (new.raw_user_meta_data->>'grade')::int
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_profile();


-- ── 3. events (FBLA competitive events library) ───────────────
create table if not exists public.events (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  category         text,
  description      text,
  rubric_url       text,
  competition_date date,
  created_at       timestamptz default now()
);
alter table public.events enable row level security;

create policy "Anyone authenticated can read events"
  on public.events for select using (auth.role() = 'authenticated');


-- ── 4. user_events (member ↔ event registration) ─────────────
create table if not exists public.user_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  event_id   uuid not null references public.events(id) on delete cascade,
  result     text,
  notes      text,
  created_at timestamptz default now(),
  unique(user_id, event_id)
);
alter table public.user_events enable row level security;

create policy "Members can read/write their own user_events"
  on public.user_events for all using (auth.uid() = user_id);


-- ── 5. announcements ──────────────────────────────────────────
create table if not exists public.announcements (
  id          uuid primary key default gen_random_uuid(),
  chapter_id  uuid not null,
  author_id   uuid references public.users(id) on delete set null,
  title       text not null,
  body        text,
  is_pinned   boolean default false,
  created_at  timestamptz default now()
);
alter table public.announcements enable row level security;

create policy "Chapter members can read announcements"
  on public.announcements for select
  using (
    chapter_id in (
      select chapter_id from public.profiles where user_id = auth.uid()
    )
  );

create policy "Advisers/admins can insert announcements"
  on public.announcements for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('adviser','admin')
    )
  );


-- ── 6. todos ──────────────────────────────────────────────────
create table if not exists public.todos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  title        text not null,
  is_done      boolean default false,
  due_date     date,
  calendar_id  uuid,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
alter table public.todos enable row level security;

create policy "Todo owner full access"
  on public.todos for all using (auth.uid() = user_id);


-- ── 7. calendar_events ────────────────────────────────────────
create table if not exists public.calendar_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  chapter_id  uuid,
  title       text not null,
  start_time  timestamptz,
  end_time    timestamptz,
  is_shared   boolean default false,
  created_at  timestamptz default now()
);
alter table public.calendar_events enable row level security;

create policy "Owner or chapter member can read calendar_events"
  on public.calendar_events for select
  using (
    auth.uid() = user_id
    or (
      is_shared = true
      and chapter_id in (
        select chapter_id from public.profiles where user_id = auth.uid()
      )
    )
  );

create policy "Owner can insert/update/delete calendar_events"
  on public.calendar_events for all using (auth.uid() = user_id);


-- ── 8. messages ───────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  chapter_id  uuid not null,
  sender_id   uuid not null references public.users(id) on delete cascade,
  body        text not null,
  is_deleted  boolean default false,
  deleted_by  uuid references public.users(id),
  created_at  timestamptz default now()
);
alter table public.messages enable row level security;

create policy "Chapter members can read non-deleted messages"
  on public.messages for select
  using (
    is_deleted = false
    and chapter_id in (
      select chapter_id from public.profiles where user_id = auth.uid()
    )
  );

create policy "Chapter members can insert messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and chapter_id in (
      select chapter_id from public.profiles where user_id = auth.uid()
    )
  );

create policy "Advisers/admins can soft-delete messages"
  on public.messages for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('adviser','admin')
    )
  );


-- ── 9. notifications ──────────────────────────────────────────
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  title      text,
  body       text,
  is_read    boolean default false,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;

create policy "Notification owner full access"
  on public.notifications for all using (auth.uid() = user_id);


-- ── 10. admin_actions (audit log) ─────────────────────────────
create table if not exists public.admin_actions (
  id          uuid primary key default gen_random_uuid(),
  admin_id    uuid not null references public.users(id) on delete cascade,
  action_type text not null,
  target_id   uuid,
  reason      text,
  created_at  timestamptz default now()
);
alter table public.admin_actions enable row level security;

create policy "Advisers/admins can insert admin_actions"
  on public.admin_actions for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('adviser','admin')
    )
  );

create policy "Advisers/admins can read admin_actions"
  on public.admin_actions for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('adviser','admin')
    )
  );


-- ── Realtime ──────────────────────────────────────────────────
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.announcements;


-- ── Seed: FBLA competitive events ─────────────────────────────
insert into public.events (name, category, description, competition_date) values
  ('Accounting I',              'Business Finance',     'Tests knowledge of accounting fundamentals, financial statements, and basic bookkeeping.', '2026-04-15'),
  ('Business Communication',    'Business Admin',       'Evaluates written and oral business communication skills through case studies and presentations.', '2026-04-15'),
  ('Computer Applications',     'Technology',           'Covers Microsoft Office Suite productivity tools: Word, Excel, PowerPoint, Access.', '2026-04-15'),
  ('Cybersecurity',             'Technology',           'Tests knowledge of network security, ethical hacking, cryptography, and data protection.', '2026-04-15'),
  ('Digital Video Production',  'Communications',       'Produce a short digital video on an assigned topic judged on content, production quality, and creativity.', '2026-04-15'),
  ('Economics',                 'Business Finance',     'Tests knowledge of macroeconomics, microeconomics, and personal finance.', '2026-04-15'),
  ('Entrepreneurship',          'Business Admin',       'Develop and present a complete business plan for a new or existing business concept.', '2026-04-15'),
  ('Global Business',           'Business Admin',       'Covers international trade, global marketing, and cross-cultural business practices.', '2026-04-15'),
  ('Introduction to Business',  'Business Admin',       'Broad introduction to business concepts: management, marketing, finance, and operations.', '2026-04-15'),
  ('Introduction to Marketing', 'Marketing',            'Foundational marketing concepts including the 4 Ps, consumer behavior, and market research.', '2026-04-15'),
  ('Mobile Application Development', 'Technology',      'Design, develop, and present a mobile app addressing a real-world problem or FBLA theme.', '2026-04-15'),
  ('Network Design',            'Technology',           'Design a complete network infrastructure for a given business scenario.', '2026-04-15'),
  ('Personal Finance',          'Business Finance',     'Tests budgeting, investing, insurance, taxes, and long-term financial planning.', '2026-04-15'),
  ('Public Speaking',           'Communications',       'Deliver a prepared speech on a business topic judged on content, delivery, and organization.', '2026-04-15'),
  ('Social Media Strategies',   'Marketing',            'Develop a comprehensive social media campaign for a business scenario.', '2026-04-15'),
  ('Sports & Entertainment Management', 'Business Admin','Apply business management principles to a sports or entertainment scenario.', '2026-04-15'),
  ('Website Design',            'Technology',           'Design and build a functional website for an assigned topic judged on design, usability, and content.', '2026-04-15')
on conflict do nothing;


-- ── Migration: add columns to existing profiles table ─────────
-- Run these if you applied the schema before 2026-04-20
alter table public.profiles add column if not exists role      text    default 'member';
alter table public.profiles add column if not exists bio       text;
alter table public.profiles add column if not exists interests text[]  default '{}';
