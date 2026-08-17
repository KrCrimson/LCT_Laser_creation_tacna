"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import { deleteUsuario } from "@/lib/actions/usuarios";
import { Button } from "@/components/ui/button";

type Usuario = {
  id: string;
  username: string;
  nombre: string;
  nivel: number;
};

export function UsuarioActions({ 
  usuario, 
  isSuperAdmin,
  currentUsername 
}: { 
  usuario: Usuario; 
  isSuperAdmin: boolean;
  currentUsername: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Reglas de visualización y control:
  // No se puede eliminar al super admin "admin"
  const isTargetSuperAdmin = usuario.username === "admin";
  // No se puede auto-eliminar
  const isSelf = usuario.username === currentUsername;
  // Solo el super admin puede borrar administradores (nivel 2)
  const isUnauthorizedToDeleteAdmin = usuario.nivel === 2 && !isSuperAdmin;

  const disabled = isDeleting || isTargetSuperAdmin || isSelf || isUnauthorizedToDeleteAdmin;

  async function handleDelete() {
    if (confirm(`¿Estás seguro de eliminar al usuario @${usuario.username}?`)) {
      setIsDeleting(true);
      const res = await deleteUsuario(usuario.id);
      setIsDeleting(false);

      if (res?.error) {
        alert(res.error);
      }
    }
  }

  if (isTargetSuperAdmin || isSelf || isUnauthorizedToDeleteAdmin) {
    return (
      <span className="text-xs text-muted-foreground italic">
        {isTargetSuperAdmin ? "Protegido" : isSelf ? "Tú" : "Restringido"}
      </span>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
      onClick={handleDelete}
      disabled={disabled}
    >
      <Trash className="h-4 w-4" />
      <span className="sr-only">Eliminar</span>
    </Button>
  );
}
