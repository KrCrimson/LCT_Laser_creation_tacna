"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hash, compare } from "bcryptjs";
import { auth } from "../../../auth";

const UpdateProfileSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidoPat: z.string().min(2, "El apellido paterno es requerido"),
  apellidoMat: z.string().min(2, "El apellido materno es requerido"),
  dni: z.string().optional(),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Debes ingresar tu contraseña actual"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Debes confirmar la nueva contraseña"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas nuevas no coinciden",
  path: ["confirmPassword"]
});

export async function updateProfile(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "No autorizado. Inicia sesión nuevamente." };
    }

    const data = {
      nombre: formData.get("nombre") as string,
      apellidoPat: formData.get("apellidoPat") as string,
      apellidoMat: formData.get("apellidoMat") as string,
      dni: (formData.get("dni") as string) || undefined,
    };

    const validated = UpdateProfileSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    await prisma.usuario.update({
      where: { id: session.user.id },
      data: {
        nombre: validated.data.nombre,
        apellidoPat: validated.data.apellidoPat,
        apellidoMat: validated.data.apellidoMat,
        dni: validated.data.dni,
      }
    });

    revalidatePath("/perfil");
    return { success: true, message: "Datos actualizados correctamente." };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar los datos personales." };
  }
}

export async function changePassword(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "No autorizado." };
    }

    const data = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validated = ChangePasswordSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const user = await prisma.usuario.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return { error: "Usuario no encontrado." };
    }

    // Validar contraseña actual
    const match = await compare(validated.data.currentPassword, user.password);
    if (!match) {
      return { error: "La contraseña actual es incorrecta." };
    }

    // Hashear y actualizar nueva contraseña
    const hashedPassword = await hash(validated.data.newPassword, 12);
    await prisma.usuario.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    revalidatePath("/perfil");
    return { success: true, message: "¡Contraseña actualizada con éxito!" };
  } catch (error) {
    console.error(error);
    return { error: "Error al cambiar la contraseña." };
  }
}
