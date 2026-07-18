"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createGasto(data: FormData) {
  await prisma.gastoAdicional.create({
    data: {
      descripcion: data.get("descripcion") as string,
      porcentaje: Number(data.get("porcentaje"))
    }
  })
  revalidatePath("/gastos")
}

export async function updateGasto(data: FormData) {
  await prisma.gastoAdicional.update({
    where: { id: data.get("id") as string },
    data: {
      descripcion: data.get("descripcion") as string,
      porcentaje: Number(data.get("porcentaje"))
    }
  })
  revalidatePath("/gastos")
}

export async function deleteGasto(data: FormData) {
  await prisma.gastoAdicional.update({
    where: { id: data.get("id") as string },
    data: { activo: false }
  })
  revalidatePath("/gastos")
}
