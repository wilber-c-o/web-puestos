# Sistema de gestión de puestos

Aplicación web para iniciar sesión y consultar la información básica de puestos.

## Características

- Inicio y cierre de sesión mediante carnet de identidad y contraseña.
- Encabezado personalizado con el nombre de la persona autenticada.
- Barra de navegación con las secciones de estudiantes, clases, asientos ocupados y asientos libres.
- Diseño adaptable para computadoras y dispositivos móviles.

## Tecnologías

- React
- TypeScript
- Vite
- React Router

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

Después, abra la dirección que Vite muestre en la terminal, normalmente `http://localhost:5173`.

## Credenciales de prueba

| Usuario | Carnet | Contraseña |
| --- | --- | --- |
| Administrador | `1234567` | `admin123` |
| Usuario de prueba | `7654321` | `usuario123` |

> Estas credenciales son únicamente para desarrollo. No deben utilizarse en un entorno de producción.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el entorno de desarrollo. |
| `npm run build` | Genera la compilación de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de producción. |
| `npm run lint` | Ejecuta las comprobaciones de ESLint. |

## Estructura principal

```text
src/
├── components/       # Componentes reutilizables, como encabezado y navegación
├── data/             # Datos iniciales de usuarios para desarrollo
├── pages/            # Vistas de login e inicio
├── repositories/     # Lógica de autenticación
├── routes/           # Configuración de rutas
├── services/         # Acceso al almacenamiento local
└── types/            # Tipos compartidos de TypeScript
```

## Rutas

| Ruta | Descripción |
| --- | --- |
| `/login` | Pantalla de inicio de sesión. |
| `/` | Página principal para una sesión autenticada. |
