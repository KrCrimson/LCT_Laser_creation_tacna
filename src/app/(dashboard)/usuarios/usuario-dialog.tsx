"use client";

import { useActionState, useEffect, useState } from "react";
import { createUsuario } from "@/lib/actions/usuarios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UsuarioDialogProps {
  trigger?: React.ReactNode;
  isSuperAdmin: boolean;
}

export function UsuarioDialog({ trigger, isSuperAdmin }: UsuarioDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createUsuario, undefined);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger render={trigger as React.ReactElement} />
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Ingresa los datos para registrar un nuevo usuario en el sistema.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de Usuario *</Label>
            <Input id="username" name="username" placeholder="ej. jgomez" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombres *</Label>
            <Input id="nombre" name="nombre" placeholder="ej. Juan Carlos" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apellidoPat">Ap. Paterno *</Label>
              <Input id="apellidoPat" name="apellidoPat" placeholder="ej. Gómez" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidoMat">Ap. Materno *</Label>
              <Input id="apellidoMat" name="apellidoMat" placeholder="ej. Ruiz" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nivel">Rol / Nivel de Acceso *</Label>
            <select
              id="nivel"
              name="nivel"
              className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="1"
              disabled={!isSuperAdmin}
            >
              <option value="1">Usuario Común</option>
              {isSuperAdmin && <option value="2">Administrador</option>}
            </select>
            {!isSuperAdmin && (
              <p className="text-xs text-muted-foreground mt-1">
                ⚠️ Solo el Super Administrador puede crear otros administradores.
              </p>
            )}
          </div>

          {state?.error && (
            <p className="text-sm font-medium text-destructive">
              {state.error}
            </p>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Usuario
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
