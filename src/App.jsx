import { BrowserRouter } from "react-router-dom";

import ContenedorGeneral from "./components/layout/ContenedorGeneral.jsx";
import Cabecera from "./components/layout/Cabecera.jsx";
import ContenidoPrincipal from "./components/layout/ContenidoPrincipal.jsx";
import Footer from "./components/footer/Footer.jsx";

import CabeceraFila from "./components/layout/CabeceraFila.jsx";

import ProveedorSesion from "./context/ProveedorSesion.jsx";
import ProveedorRoles from "./context/ProveedorRoles.jsx";
import ProveedorNotificacion from "./context/ProveedorNotificacion.jsx";
import Notificacion from "./components/ui/Notificacion.jsx";

import Rutas from "./routes/Rutas.jsx";
import ProveedorPerfil from "./context/ProveedorPerfil.jsx";

/*
===========================
SQL USADO (Práctica 6.11)
===========================

-- TABLA ROLES (id_rol FK a auth.users.id + cascade, correo, rol por defecto usuario)
create table if not exists public.roles (
  id_rol uuid primary key references auth.users(id) on delete cascade,
  rol text not null default 'usuario',
  correo text,
  created_at timestamptz default now()
);

-- Función: insertar rol por defecto al crear usuario (security definer)
create or replace function public.insert_default_role()
returns trigger as $$
begin
  insert into public.roles (id_rol, correo, rol)
  values (new.id, new.email, 'usuario')
  on conflict (id_rol) do nothing;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger: al crear usuario en auth.users
drop trigger if exists on_auth_user_created_insert_role on auth.users;

create trigger on_auth_user_created_insert_role
after insert on auth.users
for each row execute procedure public.insert_default_role();

-- Función: comprobar si el usuario actual es admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1
    from public.roles
    where id_rol = auth.uid()
      and rol = 'admin'
  );
end;
$$ language plpgsql security definer set search_path = public;

-- Backfill: asegurar que todos los usuarios existentes tengan fila en roles
insert into public.roles (id_rol, correo, rol)
select u.id, u.email, 'usuario'
from auth.users u
left join public.roles r on r.id_rol = u.id
where r.id_rol is null;

-- RLS (hecho desde Policies en Supabase)
-- roles SELECT: (auth.uid() = id_rol) OR public.is_admin()
-- roles UPDATE: public.is_admin()
-- (INSERT no desde cliente, lo hace el trigger)

-------------------------------------------------------

-- TABLA PROFILES (perfil editable)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text default '',
  avatar_url text default '',
  description text default '',
  updated_at timestamptz default now()
);

-- Función: crear perfil automáticamente al crear usuario
create or replace function public.insert_profile()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', '')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger: al crear usuario en auth.users
drop trigger if exists on_auth_user_created_profile on auth.users;

create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.insert_profile();

-- Backfill: crear perfiles para usuarios ya existentes
insert into public.profiles (user_id, email, full_name)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'display_name', '')
from auth.users u
left join public.profiles p on p.user_id = u.id
where p.user_id is null;

-- RLS (hecho desde Policies en Supabase)
-- profiles SELECT: auth.uid() = user_id OR public.is_admin()
-- profiles UPDATE: auth.uid() = user_id OR public.is_admin()
-- profiles INSERT: auth.uid() = user_id
-- profiles DELETE: public.is_admin()

-------------------------------------------------------

-- RLS DEL ENUNCIADO (resumen)
-- shopping_lists:
--   SELECT: owner_id = auth.uid() OR public.is_admin()
--   UPDATE: owner_id = auth.uid()
--   DELETE: owner_id = auth.uid()
-- products:
--   SELECT: true
--   INSERT/UPDATE/DELETE: public.is_admin()
-- shopping_list_items:
--   SELECT: existe lista propia o admin (según tu policy de items)
--   INSERT/UPDATE/DELETE: solo si el item pertenece a una lista propia
*/

function App() {
  return (
    <BrowserRouter>
      <ProveedorNotificacion>
        <ProveedorSesion>
          <ProveedorRoles>
            <ProveedorPerfil>
              <ContenedorGeneral>
                <Notificacion />

                <Cabecera>
                  <CabeceraFila />
                </Cabecera>

                <ContenidoPrincipal>
                  <Rutas />
                </ContenidoPrincipal>

                <Footer />
              </ContenedorGeneral>
            </ProveedorPerfil>
          </ProveedorRoles>
        </ProveedorSesion>
      </ProveedorNotificacion>
    </BrowserRouter>
  );
}

export default App;
