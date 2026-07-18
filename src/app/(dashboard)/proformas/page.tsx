import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function ProformasPage() {
  const proformas = await prisma.proforma.findMany({
    where: { activo: true },
    include: { cliente: true, items: { include: { producto: true } } }
  })
  
  const clientes = await prisma.cliente.findMany({ where: { activo: true } })
  const productos = await prisma.producto.findMany({ where: { activo: true }, orderBy: { descripcion: 'asc' } })
  const plantillas = productos.filter(p => p.esPlantilla)
  const personalizados = productos.filter(p => !p.esPlantilla)

  async function createProforma(data: FormData) {
    "use server"
    const clienteId = data.get("clienteId") as string
    const productoId = data.get("productoId") as string
    const porcGanancia = Number(data.get("porcGanancia"))

    const producto = await prisma.producto.findUnique({ where: { id: productoId } })
    if (!producto) return

    const costo = Number(producto.costoTotal)
    const utilidad = costo * (porcGanancia / 100)
    const precioFinal = costo + utilidad

    await prisma.proforma.create({
      data: {
        clienteId,
        descripcion: data.get("descripcion") as string,
        costo,
        utilidad,
        porcGanancia,
        precioFinal,
        items: {
          create: [{
            productoId,
            cantidad: 1,
            precio: costo,
            ganancia: utilidad,
            precioFinal,
            detallesExtra: data.get("detallesExtra") as string || null
          }]
        }
      }
    })
    revalidatePath("/proformas")
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Proformas / Cotizaciones</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Listado Histórico</h2>
          <div className="border rounded-lg bg-card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground border-b">
                <tr><th className="p-3">Cliente</th><th className="p-3">Descripción</th><th className="p-3">Costo Base</th><th className="p-3">Precio Final</th></tr>
              </thead>
              <tbody className="divide-y">
                {proformas.map(p => (
                  <tr key={p.id}>
                    <td className="p-3 font-medium">{p.cliente.nombre}</td>
                    <td className="p-3">{p.descripcion}</td>
                    <td className="p-3">S/ {Number(p.costo).toFixed(2)}</td>
                    <td className="p-3 font-bold text-primary">S/ {Number(p.precioFinal).toFixed(2)}</td>
                  </tr>
                ))}
                {proformas.length === 0 && <tr><td colSpan={4} className="p-4 text-center">Sin proformas creadas</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <form action={createProforma} className="border p-6 rounded-lg bg-card space-y-4">
            <h3 className="font-bold text-lg">Nueva Cotización Rápida</h3>
            
            <div>
              <label className="text-sm font-medium">Cliente</label>
              <select name="clienteId" required className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">Seleccione cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Producto (o Plantilla) - 1 unidad</label>
              <select name="productoId" required className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">Seleccione producto o plantilla...</option>
                {plantillas.length > 0 && (
                  <optgroup label="✨ Diseños Estandarizados (Plantillas)">
                    {plantillas.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.descripcion} {p.categoriaPlantilla ? `(${p.categoriaPlantilla})` : ''} - Costo: S/ {Number(p.costoTotal).toFixed(2)}
                      </option>
                    ))}
                  </optgroup>
                )}
                {personalizados.length > 0 && (
                  <optgroup label="🔧 Productos Personalizados">
                    {personalizados.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.descripcion} - Costo: S/ {Number(p.costoTotal).toFixed(2)}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Descripción de cotización</label>
              <Input name="descripcion" placeholder="Ej. Llaveros 50 unidades" required />
            </div>

            <div>
              <label className="text-sm font-medium">Detalles Extra / Modificaciones del Cliente</label>
              <Input name="detallesExtra" placeholder="Ej. El cliente quiere el logo más grande" />
              <p className="text-xs text-muted-foreground mt-1">Escribe aquí si el cliente pidió algún cambio sobre la plantilla elegida.</p>
            </div>

            <div>
              <label className="text-sm font-medium">% Ganancia Esperada</label>
              <Input name="porcGanancia" type="number" min="0" defaultValue="50" required />
            </div>

            <Button type="submit" className="w-full">Generar Proforma</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
