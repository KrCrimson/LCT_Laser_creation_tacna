"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createProducto(data: FormData) {
  const largo = Number(data.get("largo"))
  const ancho = Number(data.get("ancho"))
  const materialId = data.get("materialId") as string
  const descripcion = data.get("descripcion") as string
  const esPlantilla = data.get("esPlantilla") === "on"
  const categoriaPlantilla = (data.get("categoriaPlantilla") as string) || null
  const archivoDiseno = (data.get("archivoDiseno") as string) || null
  
  if (!descripcion || !materialId || largo <= 0 || ancho <= 0) {
    throw new Error("Datos inválidos")
  }

  const material = await prisma.material.findUnique({ where: { id: materialId } })
  if (!material) throw new Error("Material no encontrado")

  // ponytail: fórmula directa en el server.
  const costoMaterial = (largo * ancho * Number(material.costo90x60)) / 540000

  await prisma.producto.create({
    data: {
      descripcion,
      largo,
      ancho,
      area: largo * ancho,
      materialId,
      costoMaterial,
      costoTotal: costoMaterial, // En un futuro se sumarían los gastos extra
      esPlantilla,
      categoriaPlantilla,
      archivoDiseno,
    }
  })

  revalidatePath("/productos")
}

export async function deleteProducto(id: string) {
  await prisma.producto.update({
    where: { id },
    data: { activo: false }
  })
  revalidatePath("/productos")
}
