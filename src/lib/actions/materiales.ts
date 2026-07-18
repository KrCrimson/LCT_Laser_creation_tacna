"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { 
  calcularArea, 
  calcularCantidad90x60, 
  calcularPrecioTotalMaterial, 
  calcularCostoPlancha90x60 
} from "@/lib/utils";

const MaterialSchema = z.object({
  descripcion: z.string().min(2, "La descripción es requerida"),
  espesor: z.number().positive("El espesor debe ser mayor a 0"),
  procedencia: z.string().optional(),
  largo: z.number().positive("El largo debe ser mayor a 0"),
  ancho: z.number().positive("El ancho debe ser mayor a 0"),
  precio: z.number().min(0, "El precio no puede ser negativo"),
  precioCorte: z.number().min(0, "El precio de corte no puede ser negativo"),
  costoEnvio: z.number().min(0, "El costo de envío no puede ser negativo"),
});

export async function createMaterial(prevState: any, formData: FormData) {
  try {
    const data = {
      descripcion: formData.get("descripcion") as string,
      espesor: parseFloat(formData.get("espesor") as string),
      procedencia: formData.get("procedencia") as string,
      largo: parseFloat(formData.get("largo") as string),
      ancho: parseFloat(formData.get("ancho") as string),
      precio: parseFloat(formData.get("precio") as string),
      precioCorte: parseFloat(formData.get("precioCorte") as string) || 0,
      costoEnvio: parseFloat(formData.get("costoEnvio") as string) || 0,
    };

    const validated = MaterialSchema.safeParse(data);

    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const val = validated.data;

    // Cálculos automáticos del motor
    const area = calcularArea(val.largo, val.ancho);
    const cantidad90x60 = calcularCantidad90x60(area);
    const precioTotal = calcularPrecioTotalMaterial(val.precio, val.precioCorte, val.costoEnvio);
    const costo90x60 = calcularCostoPlancha90x60(precioTotal, cantidad90x60);

    await prisma.material.create({
      data: {
        ...val,
        area,
        cantidad90x60,
        precioTotal,
        costo90x60,
      },
    });

    revalidatePath("/materiales");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al crear el material" };
  }
}

export async function updateMaterial(id: string, prevState: any, formData: FormData) {
  try {
    const data = {
      descripcion: formData.get("descripcion") as string,
      espesor: parseFloat(formData.get("espesor") as string),
      procedencia: formData.get("procedencia") as string,
      largo: parseFloat(formData.get("largo") as string),
      ancho: parseFloat(formData.get("ancho") as string),
      precio: parseFloat(formData.get("precio") as string),
      precioCorte: parseFloat(formData.get("precioCorte") as string) || 0,
      costoEnvio: parseFloat(formData.get("costoEnvio") as string) || 0,
    };

    const validated = MaterialSchema.safeParse(data);

    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const val = validated.data;

    // Recalcular
    const area = calcularArea(val.largo, val.ancho);
    const cantidad90x60 = calcularCantidad90x60(area);
    const precioTotal = calcularPrecioTotalMaterial(val.precio, val.precioCorte, val.costoEnvio);
    const costo90x60 = calcularCostoPlancha90x60(precioTotal, cantidad90x60);

    await prisma.material.update({
      where: { id },
      data: {
        ...val,
        area,
        cantidad90x60,
        precioTotal,
        costo90x60,
      },
    });

    // Validar en cascada si algún producto lo usaba, el costo cambiará. 
    // Por ahora solo actualizamos el material.
    // Idealmente: trigger para actualizar el costoMaterial de Productos asociados.

    revalidatePath("/materiales");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar el material" };
  }
}

export async function deleteMaterial(id: string) {
  try {
    const productos = await prisma.producto.count({
      where: { materialId: id }
    });

    if (productos > 0) {
      return { error: "No se puede eliminar porque hay productos usando este material" };
    }

    await prisma.material.delete({
      where: { id },
    });

    revalidatePath("/materiales");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar el material" };
  }
}
