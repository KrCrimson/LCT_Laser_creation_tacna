# 🚀 Plan de Implementación — Laser Creation Tacna Web

## Objetivo
Migrar el sistema de cálculo de costos de corte láser de Visual FoxPro (escritorio) a una aplicación web moderna con Next.js 15, desplegada en Vercel + Neon.

---

## Stack Confirmado

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 + React 19 + TypeScript |
| UI | shadcn/ui + Tailwind CSS 4 |
| ORM | Prisma |
| Base de datos | PostgreSQL en Neon (serverless) |
| Auth | Auth.js v5 (credentials provider) |
| Imágenes | Uploadthing |
| PDF | @react-pdf/renderer |
| Deploy | Vercel (frontend+backend) + Neon (BD) |

---

## Fases de Desarrollo

### Fase 1 — Setup del Proyecto
- [ ] Crear proyecto Next.js 15 con TypeScript y App Router
- [ ] Instalar y configurar Tailwind CSS 4
- [ ] Instalar y configurar shadcn/ui (tema oscuro/claro)
- [ ] Instalar Prisma y configurar conexión a Neon PostgreSQL
- [ ] Configurar variables de entorno (`.env`)
- [ ] Estructura de carpetas del proyecto

**Estructura propuesta:**
```
laser-creation-web/
├── prisma/
│   └── schema.prisma          # Modelo de datos
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/         # Página de login
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx     # Layout con sidebar
│   │   │   ├── page.tsx       # Dashboard principal
│   │   │   ├── clientes/      # CRUD Clientes
│   │   │   ├── materiales/    # CRUD Materiales
│   │   │   ├── complementos/  # CRUD Complementos
│   │   │   ├── gastos/        # CRUD Gastos Adicionales
│   │   │   ├── productos/     # CRUD + Motor de costos
│   │   │   └── proformas/     # CRUD + PDF
│   │   ├── api/               # API Routes
│   │   └── layout.tsx         # Layout raíz
│   ├── components/
│   │   ├── ui/                # Componentes shadcn
│   │   ├── layout/            # Sidebar, Header, etc.
│   │   └── shared/            # DataTable, Formularios reutilizables
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma
│   │   ├── auth.ts            # Config Auth.js
│   │   └── utils.ts           # Utilidades
│   └── types/                 # Tipos TypeScript
├── .env                       # Variables de entorno
└── package.json
```

---

### Fase 2 — Base de Datos (Schema Prisma)

- [ ] Definir modelos Prisma migrando desde las tablas DBF:

```prisma
// Esquema principal - todas las entidades del sistema

model Usuario {
  id            String   @id @default(cuid())
  username      String   @unique
  nombre        String
  apellidoPat   String
  apellidoMat   String
  dni           String?
  fechaNac      DateTime?
  password      String   // bcrypt hash
  nivel         Int      @default(1) // 1=usuario, 2=admin
  foto          String?
  activo        Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Cliente {
  id         String     @id @default(cuid())
  nombre     String
  domicilio  String?
  telefono   String?
  activo     Boolean    @default(true)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  proformas  Proforma[]
}

model Material {
  id              String     @id @default(cuid())
  descripcion     String
  espesor         Decimal    @default(0)
  procedencia     String?
  largo           Decimal    @default(0)
  ancho           Decimal    @default(0)
  area            Decimal    @default(0)
  cantidad90x60   Int        @default(1)
  precio          Decimal    @default(0)
  precioCorte     Decimal    @default(0)
  costoEnvio      Decimal    @default(0)
  precioTotal     Decimal    @default(0)
  costo90x60      Decimal    @default(0)
  activo          Boolean    @default(true)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  productos       Producto[]
}

model Complemento {
  id              String   @id @default(cuid())
  descripcion     String
  precio          Decimal  @default(0)
  cantidad        Int      @default(1)
  costoUnitario   Decimal  @default(0)
  activo          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  productos       ComplementoProducto[]
}

model GastoAdicional {
  id          String   @id @default(cuid())
  descripcion String
  porcentaje  Decimal  @default(0)
  activo      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  productos   GastoAdicionalProducto[]
}

model Producto {
  id                  String   @id @default(cuid())
  descripcion         String
  detalles            String?
  imagen              String?
  largo               Decimal  @default(0)
  ancho               Decimal  @default(0)
  area                Decimal  @default(0)
  materialId          String
  material            Material @relation(fields: [materialId], references: [id])
  costoMaterial       Decimal  @default(0)
  costosAdicionales   Decimal  @default(0)
  costosComplementos  Decimal  @default(0)
  costoTotal          Decimal  @default(0)
  activo              Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  gastosAdicionales   GastoAdicionalProducto[]
  complementos        ComplementoProducto[]
  proformaItems       ProformaItem[]
}

model GastoAdicionalProducto {
  id               String         @id @default(cuid())
  productoId       String
  producto         Producto       @relation(fields: [productoId], references: [id])
  gastoAdicionalId String
  gastoAdicional   GastoAdicional @relation(fields: [gastoAdicionalId], references: [id])
  porcentaje       Decimal        @default(0)
  costo            Decimal        @default(0)
}

model ComplementoProducto {
  id              String      @id @default(cuid())
  productoId      String
  producto        Producto    @relation(fields: [productoId], references: [id])
  complementoId   String
  complemento     Complemento @relation(fields: [complementoId], references: [id])
  costo           Decimal     @default(0)
}

model Proforma {
  id              String         @id @default(cuid())
  clienteId       String
  cliente         Cliente        @relation(fields: [clienteId], references: [id])
  fecha           DateTime       @default(now())
  descripcion     String?
  costo           Decimal        @default(0)
  utilidad        Decimal        @default(0)
  porcGanancia    Decimal        @default(0)
  precioFinal     Decimal        @default(0)
  ventaRealizada  Boolean        @default(false)
  imagen          String?
  activo          Boolean        @default(true)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  items           ProformaItem[]
}

model ProformaItem {
  id          String   @id @default(cuid())
  proformaId  String
  proforma    Proforma @relation(fields: [proformaId], references: [id], onDelete: Cascade)
  productoId  String
  producto    Producto @relation(fields: [productoId], references: [id])
  cantidad    Int      @default(1)
  precio      Decimal  @default(0)
  ganancia    Decimal  @default(0)
  precioFinal Decimal  @default(0)
}
```

- [ ] Ejecutar `npx prisma migrate dev` para crear las tablas
- [ ] Crear seed con datos de ejemplo

---

### Fase 3 — Layout Principal y Navegación
- [ ] Crear layout con sidebar colapsable
- [ ] Logo de Laser Creation Tacna en el sidebar
- [ ] Menú de navegación con iconos (replicando el menú VFP):
  - 📊 Dashboard
  - 👤 Clientes
  - 🧱 Materiales
  - 🔧 Complementos
  - 📊 Gastos Adicionales
  - 📦 Productos
  - 📄 Proformas
  - 👥 Usuarios (solo admin)
- [ ] Header con usuario logueado + botón logout
- [ ] Tema oscuro/claro toggle
- [ ] Breadcrumbs
- [ ] Responsive (sidebar se convierte en menú hamburguesa en móvil)

---

### Fase 4 — Autenticación
- [ ] Configurar Auth.js v5 con Credentials Provider
- [ ] Página de login con diseño premium
- [ ] Hash de contraseñas con bcrypt
- [ ] Middleware para proteger rutas
- [ ] Roles: admin (nivel 2) y usuario normal (nivel 1)
- [ ] Restricción de menú Usuarios solo para admin
- [ ] Sesión persistente con JWT

---

### Fase 5 — Módulo Clientes (CRUD)
- [ ] Página `/clientes` — tabla con búsqueda, paginación
- [ ] Dialog/modal para crear nuevo cliente
- [ ] Dialog/modal para editar cliente
- [ ] Borrado lógico con confirmación
- [ ] Server Actions para las operaciones CRUD
- [ ] Validación con Zod

---

### Fase 6 — Módulo Materiales (CRUD + Cálculos)
- [ ] Página `/materiales` — tabla con todos los campos
- [ ] Formulario con cálculos automáticos:
  - Área = largo × ancho
  - Precio Total = precio + precioCorte + costoEnvío
  - Costo 90×60 = precioTotal / cantidad90x60
- [ ] Cálculos en tiempo real al cambiar valores (como en el VFP original)
- [ ] CRUD completo con borrado lógico

---

### Fase 7 — Módulo Complementos (CRUD + Cálculo)
- [ ] Página `/complementos` — tabla
- [ ] Cálculo automático: costoUnitario = precio / cantidad
- [ ] CRUD completo con borrado lógico

---

### Fase 8 — Módulo Gastos Adicionales (CRUD)
- [ ] Página `/gastos` — tabla
- [ ] Campo porcentaje con validación
- [ ] CRUD completo con borrado lógico

---

### Fase 9 — Módulo Productos (Motor de Costos) ⭐
> Este es el módulo más complejo — el corazón del sistema.

- [ ] Página `/productos` — listado con búsqueda
- [ ] Formulario de creación multi-paso:
  1. Datos básicos (descripción, dimensiones, imagen)
  2. Selección de material → cálculo automático de costo
  3. Agregar gastos adicionales (picker del catálogo) → cálculo por porcentaje
  4. Agregar complementos (picker del catálogo) → costo fijo
  5. Resumen con costo total
- [ ] Motor de cálculo:
  ```
  costoMaterial = (largo × ancho × costo90x60) / 540000
  costoAdicional[i] = (porcentaje[i] × costoMaterial) / 100
  costoTotal = costoMaterial + Σ(adicionales) + Σ(complementos)
  ```
- [ ] Recalcular adicionales al cambiar dimensiones (como el VFP original)
- [ ] Vista detalle del producto
- [ ] CRUD completo

---

### Fase 10 — Módulo Proformas (Cotizaciones + PDF)
- [ ] Página `/proformas` — listado con filtros (fecha, cliente, estado venta)
- [ ] Formulario de creación:
  1. Buscador de clientes con autocompletado
  2. Agregar productos del catálogo (grid)
  3. Definir cantidad y % ganancia por producto
  4. Vista previa del total
  5. Checkbox "venta realizada"
- [ ] Cálculos:
  ```
  precioProducto = costoTotal × (1 + %ganancia/100)
  totalProforma = Σ(precioProducto × cantidad)
  ```
- [ ] Generación de PDF de la proforma
- [ ] Vista detalle con imagen del proyecto
- [ ] CRUD completo

---

### Fase 11 — Dashboard
- [ ] Métricas principales:
  - Total productos registrados
  - Total proformas del mes
  - Ventas realizadas vs pendientes
  - Materiales más usados
- [ ] Gráficos con recharts o similar
- [ ] Resumen de actividad reciente

---

### Fase 12 — Deploy
- [ ] Crear base de datos en Neon
- [ ] Configurar proyecto en Vercel
- [ ] Conectar repositorio GitHub
- [ ] Configurar variables de entorno en Vercel
- [ ] Ejecutar migraciones en Neon
- [ ] Seed con datos iniciales
- [ ] Verificación final

---

## Verificación

### Tests Funcionales
- [ ] Login/logout funciona correctamente
- [ ] CRUD de cada módulo (crear, editar, eliminar lógico)
- [ ] Cálculos de costos son correctos (comparar con sistema VFP)
- [ ] Proformas generan PDF correcto
- [ ] Roles funcionan (usuario normal no ve módulo usuarios)

### Tests de UI
- [ ] Responsive en celular, tablet y desktop
- [ ] Tema oscuro y claro funcionan
- [ ] Navegación completa sin errores

### Tests de Deploy
- [ ] App carga sin hibernación perceptible
- [ ] BD Neon despierta en <1 segundo
- [ ] Imágenes se suben y muestran correctamente

---

## Open Questions

> [!IMPORTANT]
> **Preguntas para definir antes de empezar:**
>
> 1. **¿Empezamos con el proyecto localmente** (npm run dev) y luego desplegamos al final? ¿O prefieres crear la cuenta de Neon y Vercel ahora para ir desplegando mientras avanzamos?
>
> 2. **¿El sistema de tu tío tiene datos reales** que quieras migrar (clientes, materiales, productos)? ¿O empezamos con datos de ejemplo y la migración la hacemos después?
>
> 3. **¿Quieres que el login sea con usuario/contraseña** (como el sistema VFP original) o también quieres opciones como Google login?
