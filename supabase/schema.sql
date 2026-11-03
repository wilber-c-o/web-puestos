-- Don Bosco: esquema inicial para Supabase
-- Ejecutar completo en Supabase > SQL Editor > New query.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username text not null unique,
  role text not null check (role in ('SUPER_ADMIN', 'GUIA', 'USUARIO')),
  course_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_course_id_fkey
  foreign key (course_id) references public.courses(id) on delete set null;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.seat_assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  seat_number integer not null check (seat_number between 1 and 42),
  student_id uuid not null references public.students(id) on delete cascade,
  updated_at timestamptz not null default now(),
  unique (course_id, seat_number),
  unique (course_id, student_id)
);

create index if not exists students_course_id_idx on public.students(course_id);
create index if not exists seat_assignments_course_id_idx on public.seat_assignments(course_id);

-- Cursos oficiales del nivel secundario, turno mañana.
insert into public.courses (name) values
  ('1ro A'), ('1ro B'), ('1ro C'),
  ('2do A'), ('2do B'), ('2do C'),
  ('3ro A'), ('3ro B'),
  ('4to A'), ('4to B'),
  ('5to A'), ('5to B'), ('5to C'),
  ('6to A'), ('6to B'), ('6to C')
on conflict (name) do nothing;

-- Funciones auxiliares para aplicar permisos sin recursión de RLS.
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.can_manage_course(target_course uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and (role = 'SUPER_ADMIN' or (role = 'GUIA' and course_id = target_course))
  )
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.students enable row level security;
alter table public.seat_assignments enable row level security;

drop policy if exists "profiles_read_self_or_superadmin" on public.profiles;
create policy "profiles_read_self_or_superadmin"
on public.profiles for select to authenticated
using (id = auth.uid() or public.current_user_role() = 'SUPER_ADMIN');

drop policy if exists "profiles_superadmin_all" on public.profiles;
create policy "profiles_superadmin_all"
on public.profiles for all to authenticated
using (public.current_user_role() = 'SUPER_ADMIN')
with check (public.current_user_role() = 'SUPER_ADMIN');

drop policy if exists "courses_read_authenticated" on public.courses;
create policy "courses_read_authenticated"
on public.courses for select to authenticated
using (true);

drop policy if exists "courses_superadmin_manage" on public.courses;
create policy "courses_superadmin_manage"
on public.courses for all to authenticated
using (public.current_user_role() = 'SUPER_ADMIN')
with check (public.current_user_role() = 'SUPER_ADMIN');

drop policy if exists "students_read_authenticated" on public.students;
create policy "students_read_authenticated"
on public.students for select to authenticated
using (true);

drop policy if exists "students_guides_manage_own_course" on public.students;
create policy "students_guides_manage_own_course"
on public.students for all to authenticated
using (public.can_manage_course(course_id))
with check (public.can_manage_course(course_id));

drop policy if exists "assignments_read_authenticated" on public.seat_assignments;
create policy "assignments_read_authenticated"
on public.seat_assignments for select to authenticated
using (true);

drop policy if exists "assignments_guides_manage_own_course" on public.seat_assignments;
create policy "assignments_guides_manage_own_course"
on public.seat_assignments for all to authenticated
using (public.can_manage_course(course_id))
with check (
  public.can_manage_course(course_id)
  and exists (
    select 1 from public.students s
    where s.id = student_id and s.course_id = seat_assignments.course_id
  )
);

-- Crear los 42 asientos lógicos por curso: la aplicación los representa en una cuadrícula 6 x 7.
-- Las asignaciones se guardan en seat_assignments; un asiento vacío no necesita una fila.
