import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Sembrando datos de ejemplo...");

  // ============================================
  // USUARIOS
  // ============================================
  const adminPassword = await hash("admin123", 12);
  const userPassword = await hash("user123", 12);

  const admin = await prisma.usuario.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      nombre: "Administrador",
      apellidoPat: "Laser",
      apellidoMat: "Creation",
      dni: "00000001",
      password: adminPassword,
      nivel: 2, // Administrador
    },
  });

  const usuario = await prisma.usuario.upsert({
    where: { username: "usuario" },
    update: {},
    create: {
      username: "usuario",
      nombre: "Juan",
      apellidoPat: "Pérez",
      apellidoMat: "López",
      dni: "00000002",
      password: userPassword,
      nivel: 1, // Usuario normal
    },
  });

  console.log("✅ Usuarios creados:", { admin: admin.username, usuario: usuario.username });

  // ============================================
  // CLIENTES
  // ============================================
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nombre: "María García Quispe",
        domicilio: "Av. Bolognesi 450, Tacna",
        telefono: "952-481-230",
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: "Carlos Mamani Flores",
        domicilio: "Calle Zela 182, Tacna",
        telefono: "962-553-812",
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: "Restaurante El Sabor Tacneño",
        domicilio: "Av. San Martín 1250, Tacna",
        telefono: "052-425-680",
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: "Ana Luisa Torres Vargas",
        domicilio: "Jr. Ayacucho 320, Tacna",
        telefono: "985-112-347",
      },
    }),
    prisma.cliente.create({
      data: {
        nombre: "Ferretería El Constructor",
        domicilio: "Av. Industrial 890, Tacna",
        telefono: "052-431-200",
      },
    }),
  ]);

  console.log(`✅ ${clientes.length} clientes creados`);

  // ============================================
  // MATERIALES
  // ============================================
  const acrilico3mm = await prisma.material.create({
    data: {
      descripcion: "Acrílico Transparente 3mm",
      espesor: 3.0,
      procedencia: "Lima",
      largo: 2440,
      ancho: 1220,
      area: 2976800, // 2440 * 1220
      cantidad90x60: 5,
      precio: 85.0,
      precioCorte: 15.0,
      costoEnvio: 10.0,
      precioTotal: 110.0, // 85 + 15 + 10
      costo90x60: 22.0, // 110 / 5
    },
  });

  const mdf3mm = await prisma.material.create({
    data: {
      descripcion: "MDF 3mm",
      espesor: 3.0,
      procedencia: "Lima",
      largo: 2440,
      ancho: 1220,
      area: 2976800,
      cantidad90x60: 5,
      precio: 25.0,
      precioCorte: 8.0,
      costoEnvio: 10.0,
      precioTotal: 43.0,
      costo90x60: 8.6,
    },
  });

  const acrilico5mm = await prisma.material.create({
    data: {
      descripcion: "Acrílico Negro 5mm",
      espesor: 5.0,
      procedencia: "Lima",
      largo: 2440,
      ancho: 1220,
      area: 2976800,
      cantidad90x60: 5,
      precio: 130.0,
      precioCorte: 20.0,
      costoEnvio: 10.0,
      precioTotal: 160.0,
      costo90x60: 32.0,
    },
  });

  const carton2mm = await prisma.material.create({
    data: {
      descripcion: "Cartón Prensado 2mm",
      espesor: 2.0,
      procedencia: "Tacna",
      largo: 1000,
      ancho: 700,
      area: 700000,
      cantidad90x60: 1,
      precio: 5.0,
      precioCorte: 2.0,
      costoEnvio: 0.0,
      precioTotal: 7.0,
      costo90x60: 7.0,
    },
  });

  console.log("✅ 4 materiales creados");

  // ============================================
  // COMPLEMENTOS
  // ============================================
  const complementos = await Promise.all([
    prisma.complemento.create({
      data: {
        descripcion: "Base de madera",
        precio: 30.0,
        cantidad: 10,
        costoUnitario: 3.0,
      },
    }),
    prisma.complemento.create({
      data: {
        descripcion: "Soporte metálico",
        precio: 50.0,
        cantidad: 10,
        costoUnitario: 5.0,
      },
    }),
    prisma.complemento.create({
      data: {
        descripcion: "Cadena para colgar",
        precio: 15.0,
        cantidad: 20,
        costoUnitario: 0.75,
      },
    }),
    prisma.complemento.create({
      data: {
        descripcion: "Pintura acrílica (frasco)",
        precio: 12.0,
        cantidad: 1,
        costoUnitario: 12.0,
      },
    }),
    prisma.complemento.create({
      data: {
        descripcion: "Caja de empaque",
        precio: 20.0,
        cantidad: 10,
        costoUnitario: 2.0,
      },
    }),
  ]);

  console.log(`✅ ${complementos.length} complementos creados`);

  // ============================================
  // GASTOS ADICIONALES
  // ============================================
  const gastosAdicionales = await Promise.all([
    prisma.gastoAdicional.create({
      data: {
        descripcion: "Mano de obra",
        porcentaje: 15.0,
      },
    }),
    prisma.gastoAdicional.create({
      data: {
        descripcion: "Electricidad",
        porcentaje: 8.0,
      },
    }),
    prisma.gastoAdicional.create({
      data: {
        descripcion: "Depreciación de máquina",
        porcentaje: 5.0,
      },
    }),
    prisma.gastoAdicional.create({
      data: {
        descripcion: "Mantenimiento",
        porcentaje: 3.0,
      },
    }),
  ]);

  console.log(`✅ ${gastosAdicionales.length} gastos adicionales creados`);

  // ============================================
  // PRODUCTOS DE EJEMPLO
  // ============================================
  // Producto 1: Letrero acrílico
  const costoMat1 = (300 * 200 * 22.0) / 540000; // ~24.44
  const gastoMO1 = (15.0 * costoMat1) / 100;
  const gastoElec1 = (8.0 * costoMat1) / 100;
  const totalAdic1 = gastoMO1 + gastoElec1;
  const totalComp1 = 5.0; // soporte metálico
  const costoTotal1 = costoMat1 + totalAdic1 + totalComp1;

  const producto1 = await prisma.producto.create({
    data: {
      descripcion: "Letrero Acrílico Personalizado 30x20cm",
      detalles: "Letrero cortado en acrílico transparente 3mm con diseño personalizado",
      largo: 300,
      ancho: 200,
      area: 60000,
      materialId: acrilico3mm.id,
      costoMaterial: Math.round(costoMat1 * 100) / 100,
      costosAdicionales: Math.round(totalAdic1 * 100) / 100,
      costosComplementos: totalComp1,
      costoTotal: Math.round(costoTotal1 * 100) / 100,
      gastosAdicionales: {
        create: [
          {
            gastoAdicionalId: gastosAdicionales[0].id,
            porcentaje: 15.0,
            costo: Math.round(gastoMO1 * 100) / 100,
          },
          {
            gastoAdicionalId: gastosAdicionales[1].id,
            porcentaje: 8.0,
            costo: Math.round(gastoElec1 * 100) / 100,
          },
        ],
      },
      complementos: {
        create: [
          {
            complementoId: complementos[1].id, // Soporte metálico
            costo: 5.0,
          },
        ],
      },
    },
  });

  // Producto 2: Rompecabezas MDF
  const costoMat2 = (250 * 250 * 8.6) / 540000; // ~9.95
  const gastoMO2 = (15.0 * costoMat2) / 100;
  const totalAdic2 = gastoMO2;
  const totalComp2 = 2.0; // caja empaque
  const costoTotal2 = costoMat2 + totalAdic2 + totalComp2;

  const producto2 = await prisma.producto.create({
    data: {
      descripcion: "Rompecabezas MDF 25x25cm",
      detalles: "Rompecabezas personalizado en MDF 3mm, ideal para regalos",
      largo: 250,
      ancho: 250,
      area: 62500,
      materialId: mdf3mm.id,
      costoMaterial: Math.round(costoMat2 * 100) / 100,
      costosAdicionales: Math.round(totalAdic2 * 100) / 100,
      costosComplementos: totalComp2,
      costoTotal: Math.round(costoTotal2 * 100) / 100,
      gastosAdicionales: {
        create: [
          {
            gastoAdicionalId: gastosAdicionales[0].id,
            porcentaje: 15.0,
            costo: Math.round(gastoMO2 * 100) / 100,
          },
        ],
      },
      complementos: {
        create: [
          {
            complementoId: complementos[4].id, // Caja empaque
            costo: 2.0,
          },
        ],
      },
    },
  });

  // Producto 3: Tapa para máquina
  const costoMat3 = (500 * 400 * 32.0) / 540000; // ~11.85
  const gastoMO3 = (15.0 * costoMat3) / 100;
  const gastoElec3 = (8.0 * costoMat3) / 100;
  const gastoDepr3 = (5.0 * costoMat3) / 100;
  const totalAdic3 = gastoMO3 + gastoElec3 + gastoDepr3;
  const costoTotal3 = costoMat3 + totalAdic3;

  const producto3 = await prisma.producto.create({
    data: {
      descripcion: "Tapa Acrílico Negro para Máquina A5",
      detalles: "Tapa de protección en acrílico negro 5mm, medidas especiales",
      largo: 500,
      ancho: 400,
      area: 200000,
      materialId: acrilico5mm.id,
      costoMaterial: Math.round(costoMat3 * 100) / 100,
      costosAdicionales: Math.round(totalAdic3 * 100) / 100,
      costosComplementos: 0,
      costoTotal: Math.round(costoTotal3 * 100) / 100,
      gastosAdicionales: {
        create: [
          {
            gastoAdicionalId: gastosAdicionales[0].id,
            porcentaje: 15.0,
            costo: Math.round(gastoMO3 * 100) / 100,
          },
          {
            gastoAdicionalId: gastosAdicionales[1].id,
            porcentaje: 8.0,
            costo: Math.round(gastoElec3 * 100) / 100,
          },
          {
            gastoAdicionalId: gastosAdicionales[2].id,
            porcentaje: 5.0,
            costo: Math.round(gastoDepr3 * 100) / 100,
          },
        ],
      },
    },
  });

  console.log("✅ 3 productos creados con costos calculados");

  // ============================================
  // PROFORMAS DE EJEMPLO
  // ============================================
  const proforma1 = await prisma.proforma.create({
    data: {
      clienteId: clientes[0].id,
      descripcion: "Cotización letreros personalizados para tienda",
      costo: costoTotal1 * 3,
      porcGanancia: 30.0,
      utilidad: costoTotal1 * 3 * 0.3,
      precioFinal: costoTotal1 * 3 * 1.3,
      ventaRealizada: true,
      items: {
        create: [
          {
            productoId: producto1.id,
            cantidad: 3,
            precio: Math.round(costoTotal1 * 100) / 100,
            ganancia: 30.0,
            precioFinal: Math.round(costoTotal1 * 1.3 * 100) / 100,
          },
        ],
      },
    },
  });

  const proforma2 = await prisma.proforma.create({
    data: {
      clienteId: clientes[3].id,
      descripcion: "Rompecabezas para evento familiar",
      costo: costoTotal2 * 10,
      porcGanancia: 40.0,
      utilidad: costoTotal2 * 10 * 0.4,
      precioFinal: costoTotal2 * 10 * 1.4,
      ventaRealizada: false,
      items: {
        create: [
          {
            productoId: producto2.id,
            cantidad: 10,
            precio: Math.round(costoTotal2 * 100) / 100,
            ganancia: 40.0,
            precioFinal: Math.round(costoTotal2 * 1.4 * 100) / 100,
          },
        ],
      },
    },
  });

  console.log("✅ 2 proformas creadas");
  console.log("");
  console.log("🎉 ¡Seed completado exitosamente!");
  console.log("");
  console.log("📋 Credenciales de acceso:");
  console.log("   Admin:   usuario=admin   contraseña=admin123");
  console.log("   Usuario: usuario=usuario contraseña=user123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error en seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
