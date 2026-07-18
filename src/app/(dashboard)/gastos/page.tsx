import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createGasto, updateGasto, deleteGasto } from "./gasto-actions"
import { GastoRow } from "./gasto-row"

export default async function GastosPage() {
  const gastos = await prisma.gastoAdicional.findMany({ where: { activo: true }, orderBy: { createdAt: 'desc' } })
  const gastosPlain = gastos.map(g => ({ ...g, porcentaje: Number(g.porcentaje) }))

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Gastos Adicionales</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Catálogo</h2>
          <div className="border rounded-lg bg-card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground border-b">
                <tr><th className="p-3">Descripción</th><th className="p-3">Porcentaje (%)</th><th className="p-3">Acciones</th></tr>
              </thead>
              <tbody className="divide-y">
                {gastosPlain.map(g => (
                  <GastoRow key={g.id} gasto={g} updateAction={updateGasto} deleteAction={deleteGasto} />
                ))}
                {gastos.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">Sin gastos registrados</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <form action={createGasto} className="border p-6 rounded-lg bg-card space-y-4">
            <h3 className="font-bold text-lg">Nuevo Gasto</h3>
            <Input name="descripcion" placeholder="Ej. Diseño, Empaque" required />
            <Input name="porcentaje" type="number" min="0" max="100" step="0.01" placeholder="Porcentaje (Ej. 10)" required />
            <Button type="submit" className="w-full">Agregar Gasto</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
