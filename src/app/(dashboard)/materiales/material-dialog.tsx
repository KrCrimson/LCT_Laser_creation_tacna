"use client";

import { useActionState, useEffect, useState } from "react";
import { createMaterial, updateMaterial } from "@/lib/actions/materiales";
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

type Material = {
  id: string;
  descripcion: string;
  espesor: number;
  procedencia: string | null;
  largo: number;
  ancho: number;
  precio: number;
  precioCorte: number;
  costoEnvio: number;
};

interface MaterialDialogProps {
  material?: Material;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MaterialDialog({ material, trigger, open: controlledOpen, onOpenChange }: MaterialDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const action = material 
    ? updateMaterial.bind(null, material.id) 
    : createMaterial;

  const [state, formAction, isPending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger as React.ReactElement} />}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{material ? "Editar Material" : "Nuevo Material"}</DialogTitle>
          <DialogDescription>
            El sistema calculará automáticamente el costo de la plancha 90x60cm en base a estas dimensiones y precios.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="descripcion">Descripción del Material *</Label>
              <Input
                id="descripcion"
                name="descripcion"
                defaultValue={material?.descripcion}
                placeholder="Ej. Acrílico Transparente"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="espesor">Espesor (mm) *</Label>
              <Input
                id="espesor"
                name="espesor"
                type="number"
                step="0.1"
                defaultValue={material?.espesor}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedencia">Procedencia</Label>
              <Input
                id="procedencia"
                name="procedencia"
                defaultValue={material?.procedencia || ""}
                placeholder="Ej. Lima, Arequipa..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="largo">Largo Total (mm) *</Label>
              <Input
                id="largo"
                name="largo"
                type="number"
                defaultValue={material?.largo}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ancho">Ancho Total (mm) *</Label>
              <Input
                id="ancho"
                name="ancho"
                type="number"
                defaultValue={material?.ancho}
                required
              />
            </div>

            <div className="space-y-2 col-span-2 border-t pt-4 mt-2">
              <h4 className="text-sm font-medium mb-2">Costos</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio de Compra (S/) *</Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                step="0.01"
                defaultValue={material?.precio}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precioCorte">Precio de Corte (S/)</Label>
              <Input
                id="precioCorte"
                name="precioCorte"
                type="number"
                step="0.01"
                defaultValue={material?.precioCorte || 0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costoEnvio">Costo de Envío (S/)</Label>
              <Input
                id="costoEnvio"
                name="costoEnvio"
                type="number"
                step="0.01"
                defaultValue={material?.costoEnvio || 0}
              />
            </div>
          </div>

          {state?.error && (
            <p className="text-sm font-medium text-destructive pt-2">
              {state.error}
            </p>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {material ? "Actualizar Material" : "Guardar Material"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
