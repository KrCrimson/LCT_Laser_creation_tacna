import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MaterialDialog } from "./material-dialog";
import { MaterialActions } from "./material-actions";
import { Badge } from "@/components/ui/badge";

export default async function MaterialesPage() {
  const materialesDb = await prisma.material.findMany({
    orderBy: { descripcion: "asc" },
  });

  // Convertir Decimales de Prisma a numbers para los Client Components
  const materiales = materialesDb.map(m => ({
    ...m,
    espesor: Number(m.espesor),
    largo: Number(m.largo),
    ancho: Number(m.ancho),
    area: Number(m.area),
    precio: Number(m.precio),
    precioCorte: Number(m.precioCorte),
    costoEnvio: Number(m.costoEnvio),
    precioTotal: Number(m.precioTotal),
    costo90x60: Number(m.costo90x60),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Materiales</h2>
          <p className="text-muted-foreground">
            Administra las planchas y el motor calculará el costo base 90x60
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MaterialDialog
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Material
              </Button>
            }
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Medidas (L x A x E)</TableHead>
              <TableHead className="text-right">Planchas 90x60</TableHead>
              <TableHead className="text-right">Inversión Total</TableHead>
              <TableHead className="text-right font-bold bg-muted/50">Costo 90x60</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materiales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No hay materiales registrados.
                </TableCell>
              </TableRow>
            ) : (
              materiales.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{material.descripcion}</span>
                      {material.procedencia && (
                        <span className="text-xs text-muted-foreground">
                          {material.procedencia}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {material.largo} x {material.ancho} x {material.espesor}mm
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{material.cantidad90x60} unid.</Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(material.precioTotal)}
                    <br />
                    <span className="text-[10px]">
                      (P:{material.precio} + C:{material.precioCorte} + E:{material.costoEnvio})
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary bg-muted/20">
                    {formatCurrency(material.costo90x60)}
                  </TableCell>
                  <TableCell className="text-right">
                    <MaterialActions material={material} />
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
