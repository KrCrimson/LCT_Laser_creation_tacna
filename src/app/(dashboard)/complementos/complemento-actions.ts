"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createComplemento(data: FormData) {
  await prisma.complemento.create({
    data: {
      descripcion: data.get("descripcion") as string,
      precio: Number(data.get("precio"))
    }
  })
  revalidatePath("/complementos")
}

export async function updateComplemento(data: FormData) {
  await prisma.complemento.update({
    where: { id: data.get("id") as string },
    data: {
      descripcion: data.get("descripcion") as string,
      precio: Number(data.get("precio"))
    }
  })
  revalidatePath("/complementos")
}

export async function deleteComplemento(data: FormData) {
  await prisma.complemento.update({
    where: { id: data.get("id") as string },
    data: { activo: false }
  })
  revalidatePath("/complementos")
}
