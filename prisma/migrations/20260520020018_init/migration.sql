-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido_pat" TEXT NOT NULL,
    "apellido_mat" TEXT NOT NULL,
    "dni" TEXT,
    "fecha_nac" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "foto" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "domicilio" TEXT,
    "telefono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materiales" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "espesor" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "procedencia" TEXT,
    "largo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ancho" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "area" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cantidad_90x60" INTEGER NOT NULL DEFAULT 1,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precio_corte" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "costo_envio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precio_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "costo_90x60" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materiales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complementos" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "costo_unitario" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "complementos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastos_adicionales" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "porcentaje" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gastos_adicionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "detalles" TEXT,
    "imagen" TEXT,
    "largo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ancho" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "area" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "material_id" TEXT NOT NULL,
    "costo_material" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "costos_adicionales" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "costos_complementos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "costo_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastos_adicionales_productos" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "gasto_adicional_id" TEXT NOT NULL,
    "porcentaje" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "costo" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "gastos_adicionales_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complementos_productos" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "complemento_id" TEXT NOT NULL,
    "costo" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "complementos_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proformas" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT,
    "costo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "utilidad" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "porc_ganancia" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precio_final" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "venta_realizada" BOOLEAN NOT NULL DEFAULT false,
    "imagen" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proformas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proforma_items" (
    "id" TEXT NOT NULL,
    "proforma_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ganancia" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precio_final" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "proforma_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materiales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos_adicionales_productos" ADD CONSTRAINT "gastos_adicionales_productos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos_adicionales_productos" ADD CONSTRAINT "gastos_adicionales_productos_gasto_adicional_id_fkey" FOREIGN KEY ("gasto_adicional_id") REFERENCES "gastos_adicionales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complementos_productos" ADD CONSTRAINT "complementos_productos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complementos_productos" ADD CONSTRAINT "complementos_productos_complemento_id_fkey" FOREIGN KEY ("complemento_id") REFERENCES "complementos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proformas" ADD CONSTRAINT "proformas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proforma_items" ADD CONSTRAINT "proforma_items_proforma_id_fkey" FOREIGN KEY ("proforma_id") REFERENCES "proformas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proforma_items" ADD CONSTRAINT "proforma_items_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
