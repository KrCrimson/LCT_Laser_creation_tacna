"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ClienteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  domicilio: z.string().optional(),
  telefono: z.string().optional(),
});

export async function createCliente(prevState: any, formData: FormData) {
  try {
    const data = {
      nombre: formData.get("nombre") as string,
      domicilio: formData.get("domicilio") as string,
      telefono: formData.get("telefono") as string,
    };

    const validated = ClienteSchema.safeParse(data);

    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    await prisma.cliente.create({
      data: validated.data,
    });

    revalidatePath("/clientes");
    return { success: true };
  } catch (error) {
    return { error: "Error al crear el cliente" };
  }
}

export async function updateCliente(id: string, prevState: any, formData: FormData) {
  try {
    const data = {
      nombre: formData.get("nombre") as string,
      domicilio: formData.get("domicilio") as string,
      telefono: formData.get("telefono") as string,
    };

    const validated = ClienteSchema.safeParse(data);

    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    await prisma.cliente.update({
      where: { id },
      data: validated.data,
    });

    revalidatePath("/clientes");
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el cliente" };
  }
}

export async function deleteCliente(id: string) {
  try {
    // Verificar si el cliente tiene proformas asociadas
    const proformas = await prisma.proforma.count({
      where: { clienteId: id }
    });

    if (proformas > 0) {
      return { error: "No se puede eliminar porque tiene proformas asociadas" };
    }

    await prisma.cliente.delete({
      where: { id },
    });

    revalidatePath("/clientes");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar el cliente" };
  }
}
