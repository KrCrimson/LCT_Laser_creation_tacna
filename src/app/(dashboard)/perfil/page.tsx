import { prisma } from "@/lib/prisma";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { PerfilForm } from "./perfil-form";

export default async function PerfilPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id }
  });

  if (!usuario) {
    redirect("/login");
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
        <p className="text-muted-foreground text-sm">
          Administra tu información personal y credenciales de acceso al sistema.
        </p>
      </div>

      <PerfilForm 
        usuario={{
          username: usuario.username,
          nombre: usuario.nombre,
          apellidoPat: usuario.apellidoPat,
          apellidoMat: usuario.apellidoMat,
          dni: usuario.dni,
          nivel: usuario.nivel,
        }} 
      />
    </div>
  );
}
