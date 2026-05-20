"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { deleteCliente } from "@/lib/actions/clientes";
import { ClienteDialog } from "./cliente-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Cliente = {
  id: string;
  nombre: string;
  domicilio: string | null;
  telefono: string | null;
};

export function ClienteActions({ cliente }: { cliente: Cliente }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm(`¿Estás seguro de eliminar al cliente ${cliente.nombre}?`)) {
      setIsDeleting(true);
      const res = await deleteCliente(cliente.id);
      setIsDeleting(false);
      
      if (res?.error) {
        alert(res.error);
      }
    }
  }

  return (
    <>
      <ClienteDialog 
        cliente={cliente} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
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
