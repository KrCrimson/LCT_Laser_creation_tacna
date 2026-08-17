"use client";

import { useActionState } from "react";
import { updateProfile, changePassword } from "@/lib/actions/perfil";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound, UserCheck, Shield } from "lucide-react";

interface PerfilFormProps {
  usuario: {
    username: string;
    nombre: string;
    apellidoPat: string;
    apellidoMat: string;
    dni: string | null;
    nivel: number;
  };
}

export function PerfilForm({ usuario }: PerfilFormProps) {
  const [profileState, profileAction, isProfilePending] = useActionState(updateProfile, undefined);
  const [passwordState, passwordAction, isPasswordPending] = useActionState(changePassword, undefined);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      
      {/* Tarjeta 1: Información Personal */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Datos Personales</h3>
            <p className="text-xs text-muted-foreground">Actualiza tu nombre y número de documento</p>
          </div>
        </div>

        <form action={profileAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Usuario</Label>
              <Input value={`@${usuario.username}`} disabled className="bg-muted/50 font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label>Rol en el Sistema</Label>
              <div className="flex h-10 items-center px-3 rounded-md border bg-muted/50 text-xs font-semibold">
                <Shield className="h-3.5 w-3.5 mr-1.5 text-primary" />
                {usuario.username === "admin" ? "Super Administrador" : usuario.nivel === 2 ? "Administrador" : "Usuario"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombres *</Label>
            <Input id="nombre" name="nombre" defaultValue={usuario.nombre} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apellidoPat">Ap. Paterno *</Label>
              <Input id="apellidoPat" name="apellidoPat" defaultValue={usuario.apellidoPat} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidoMat">Ap. Materno *</Label>
              <Input id="apellidoMat" name="apellidoMat" defaultValue={usuario.apellidoMat} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni">DNI / Documento</Label>
            <Input id="dni" name="dni" defaultValue={usuario.dni || ""} maxLength={8} placeholder="8 dígitos" />
          </div>

          {profileState?.error && (
            <p className="text-xs font-semibold text-destructive">{profileState.error}</p>
          )}
          {profileState?.success && (
            <p className="text-xs font-semibold text-green-600 dark:text-green-400">{profileState.message}</p>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isProfilePending} size="sm">
              {isProfilePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>

      {/* Tarjeta 2: Cambio de Contraseña */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Seguridad de la Cuenta</h3>
            <p className="text-xs text-muted-foreground">Cambia tu contraseña periódicamente para mayor seguridad</p>
          </div>
        </div>

        <form action={passwordAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual *</Label>
            <Input id="currentPassword" name="currentPassword" type="password" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña *</Label>
            <Input id="newPassword" name="newPassword" type="password" placeholder="Mínimo 6 caracteres" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repite la nueva contraseña" required />
          </div>

          {passwordState?.error && (
            <p className="text-xs font-semibold text-destructive">{passwordState.error}</p>
          )}
          {passwordState?.success && (
            <p className="text-xs font-semibold text-green-600 dark:text-green-400">{passwordState.message}</p>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="secondary" disabled={isPasswordPending} size="sm">
              {isPasswordPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Contraseña
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}
