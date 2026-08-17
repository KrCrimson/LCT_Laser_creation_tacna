"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hash } from "bcryptjs";
import { auth } from "../../../auth";

const UsuarioSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  dni: z.string().optional(),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidoPat: z.string().min(2, "El apellido paterno es requerido"),
  apellidoMat: z.string().min(2, "El apellido materno es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  nivel: z.number().int().min(1).max(2),
});

export async function createUsuario(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).nivel !== 2) {
      return { error: "No autorizado. Solo los administradores pueden realizar esta acción." };
    }

    const currentUsername = session.user.username;
    const isSuperAdmin = currentUsername === "admin";

    const inputNivel = Number(formData.get("nivel"));

    // Medida de seguridad: Si no es el super-admin "admin", no puede crear nivel 2 (Administrador)
    if (inputNivel === 2 && !isSuperAdmin) {
      return { error: "Acción denegada. Solo el Super Administrador puede crear otros administradores." };
    }

    const data = {
      username: formData.get("username") as string,
      dni: (formData.get("dni") as string) || undefined,
      nombre: formData.get("nombre") as string,
      apellidoPat: formData.get("apellidoPat") as string,
      apellidoMat: formData.get("apellidoMat") as string,
      password: formData.get("password") as string,
      nivel: inputNivel,
    };

    const validated = UsuarioSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    // Verificar si el usuario ya existe
    const existing = await prisma.usuario.findUnique({
      where: { username: validated.data.username },
    });
    if (existing) {
      return { error: "El nombre de usuario ya está registrado." };
    }

    const hashedPassword = await hash(validated.data.password, 12);

    await prisma.usuario.create({
      data: {
        username: validated.data.username,
        dni: validated.data.dni,
        nombre: validated.data.nombre,
        apellidoPat: validated.data.apellidoPat,
        apellidoMat: validated.data.apellidoMat,
        password: hashedPassword,
        nivel: validated.data.nivel,
      },
    });

    revalidatePath("/usuarios");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al crear el usuario en el servidor." };
  }
}

export async function deleteUsuario(id: string) {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any).nivel !== 2) {
      return { error: "No autorizado." };
    }

    const target = await prisma.usuario.findUnique({ where: { id } });
    if (!target) return { error: "Usuario no encontrado." };

    // Evitar que el super admin sea eliminado o se elimine a sí mismo
    if (target.username === "admin") {
      return { error: "No se puede eliminar al Super Administrador del sistema." };
    }

    if (session.user.username !== "admin" && target.nivel === 2) {
      return { error: "Solo el Super Administrador puede eliminar a otros administradores." };
    }

    await prisma.usuario.delete({ where: { id } });
    revalidatePath("/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar el usuario." };
  }
}
