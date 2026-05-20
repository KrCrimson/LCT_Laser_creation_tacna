# Laser Creation Tacna — Sistema Web de Cálculo de Costos

![Logo LCT](documentacion/LOGO_PRINCIPAL_LCT.png)

Sistema de cálculo de costos para corte láser. Versión web moderna migrada desde Visual FoxPro.

## Stack Tecnológico

- **Framework:** Next.js 15 + React 19 + TypeScript
- **UI:** shadcn/ui + Tailwind CSS 4
- **Base de datos:** PostgreSQL (Neon serverless)
- **ORM:** Prisma
- **Autenticación:** Auth.js v5
- **Deploy:** Vercel + Neon

## Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/KrCrimson/LCT_Laser_creation_tacna.git
cd LCT_Laser_creation_tacna

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Ejecutar migraciones de BD
npx prisma migrate dev

# 5. Iniciar servidor de desarrollo
npm run dev
```

## Documentación

Todos los documentos de análisis y planificación están en la carpeta [`documentacion/`](./documentacion/).

## Licencia

Uso privado — Laser Creation Tacna.
