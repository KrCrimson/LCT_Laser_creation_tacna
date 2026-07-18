import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createComplemento, updateComplemento, deleteComplemento } from "./complemento-actions"
import { ComplementoRow } from "./complemento-row"

export default async function ComplementosPage() {
  const complementos = await prisma.complemento.findMany({ where: { activo: true }, orderBy: { createdAt: 'desc' } })
  const complementosPlain = complementos.map(c => ({ 
    ...c, 
    precio: Number(c.precio),
    costoUnitario: Number(c.costoUnitario)
  }))

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Complementos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Catálogo</h2>
          <div className="border rounded-lg bg-card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground border-b">
                <tr><th className="p-3">Descripción</th><th className="p-3">Precio (S/)</th><th className="p-3">Acciones</th></tr>
              </thead>
              <tbody className="divide-y">
                {complementosPlain.map(c => (
                  <ComplementoRow key={c.id} complemento={c} updateAction={updateComplemento} deleteAction={deleteComplemento} />
                ))}
                {complementos.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">Sin complementos registrados</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <form action={createComplemento} className="border p-6 rounded-lg bg-card space-y-4">
            <h3 className="font-bold text-lg">Nuevo Complemento</h3>
            <Input name="descripcion" placeholder="Ej. Argolla para llavero" required />
            <Input name="precio" type="number" min="0" step="0.01" placeholder="Precio (Ej. 0.50)" required />
            <Button type="submit" className="w-full">Agregar Complemento</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
