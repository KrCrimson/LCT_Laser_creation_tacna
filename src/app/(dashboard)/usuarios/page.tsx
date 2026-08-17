import { prisma } from "@/lib/prisma";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { Plus, Shield, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsuarioDialog } from "./usuario-dialog";
import { UsuarioActions } from "./usuario-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function UsuariosPage() {
  const session = await auth();

  // Bloqueo estricto de seguridad: Solo nivel 2 (Administrador) puede entrar
  if (!session || !session.user || (session.user as any).nivel !== 2) {
    redirect("/");
  }

  const currentUsername = session.user.username || "";
  const isSuperAdmin = currentUsername === "admin";

  const usuarios = await prisma.usuario.findMany({
    orderBy: { username: "asc" },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuarios del Sistema</h2>
          <p className="text-muted-foreground text-sm">
            {isSuperAdmin 
              ? "Acceso Super Administrador: Control total del sistema, gestión y creación de Administradores y Usuarios."
              : "Acceso Administrador: Control total del taller (materiales, costos, cotizaciones y gestión de usuarios comunes)."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <UsuarioDialog
            isSuperAdmin={isSuperAdmin}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
              </Button>
            }
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Rol / Rango</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay usuarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.nombre} {u.apellidoPat} {u.apellidoMat}
                  </TableCell>
                  <TableCell>@{u.username}</TableCell>
                  <TableCell>{u.dni || "-"}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.username === "admin" 
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : u.nivel === 2
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                    }`}>
                      {u.username === "admin" ? (
                        <>
                          <Shield className="h-3 w-3" />
                          Super Admin
                        </>
                      ) : u.nivel === 2 ? (
                        <>
                          <Shield className="h-3 w-3" />
                          Admin
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3" />
                          Usuario
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <UsuarioActions 
                      usuario={{
                        id: u.id,
                        username: u.username,
                        nombre: u.nombre,
                        nivel: u.nivel
                      }}
                      isSuperAdmin={isSuperAdmin}
                      currentUsername={currentUsername}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
