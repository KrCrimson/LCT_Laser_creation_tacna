"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { deleteMaterial } from "@/lib/actions/materiales";
import { MaterialDialog } from "./material-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export function MaterialActions({ material }: { material: Material }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm(`¿Estás seguro de eliminar el material ${material.descripcion}?`)) {
      setIsDeleting(true);
      const res = await deleteMaterial(material.id);
      setIsDeleting(false);
      
      if (res?.error) {
        alert(res.error);
      }
    }
  }

  return (
    <>
      <MaterialDialog 
        material={material} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
