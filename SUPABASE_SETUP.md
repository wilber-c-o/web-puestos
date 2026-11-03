# Configuración de Supabase para web-puestos

## 1. Crear el proyecto
1. Entra a https://supabase.com y crea un proyecto nuevo.
2. Guarda la contraseña de la base de datos en un lugar seguro.
3. Cuando termine de crearse, abre **Project Settings > API**.
4. Copia **Project URL** y la clave **anon/public**. Nunca uses ni publiques la clave `service_role`.

## 2. Crear las tablas y permisos
1. En Supabase abre **SQL Editor**.
2. Selecciona **New query**.
3. Copia y ejecuta todo el contenido de `supabase/schema.sql`.

## 3. Crear las variables del proyecto
Crea un archivo `.env.local` en la raíz del proyecto, junto a `package.json`, con:

```env
VITE_SUPABASE_URL=PEGA_AQUI_TU_PROJECT_URL
VITE_SUPABASE_ANON_KEY=PEGA_AQUI_TU_ANON_PUBLIC_KEY
```

No subas `.env.local` a GitHub. Para Vercel, agrega esas mismas dos variables en **Project Settings > Environment Variables**.

## 4. Cuenta del director académico
Primero se creará la cuenta desde Supabase Authentication. Después se registrará su perfil con rol `SUPER_ADMIN`. No se debe asignar ese rol desde un formulario público.

## Importante
Este primer esquema prepara cursos, perfiles, estudiantes y asignaciones de 42 asientos, además de políticas de seguridad por rol. El inicio de sesión y las pantallas del sitio se conectarán en el siguiente paso, después de confirmar que el proyecto Supabase está creado.
