import { prisma } from "@/lib/prisma"
import { ProductoForm } from "./producto-form"

export default async function ProductosPage() {
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    include: { material: true },
    orderBy: { createdAt: 'desc' }
  })
  
  const materiales = await prisma.material.findMany({
    where: { activo: true },
    orderBy: { descripcion: 'asc' }
  })

  // ponytail: Serializar los Decimals a números planos para evitar el error de Next.js Client Components
  const materialesPlain = materiales.map(m => ({
    id: m.id,
    descripcion: m.descripcion,
    costo90x60: Number(m.costo90x60)
  }))

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Productos (Cálculo de Costos)</h1>
        <p className="text-muted-foreground">Define los productos y calcula automáticamente su costo de fabricación.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Listado</h2>
          <div className="border rounded-lg bg-card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground border-b">
                <tr>
                  <th className="p-3 font-medium">Descripción</th>
                  <th className="p-3 font-medium">Material</th>
                  <th className="p-3 font-medium">Dimensiones (mm)</th>
                  <th className="p-3 font-medium">Costo Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {productos.map(p => (
                  <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-medium">
                      {p.descripcion}
                      {p.esPlantilla && (
                        <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Plantilla {p.categoriaPlantilla ? `(${p.categoriaPlantilla})` : ''}
                        </span>
                      )}
                    </td>
                    <td className="p-3">{p.material.descripcion}</td>
                    <td className="p-3">{Number(p.largo)} × {Number(p.ancho)}</td>
                    <td className="p-3 font-bold text-primary">S/ {Number(p.costoTotal).toFixed(2)}</td>
                  </tr>
                ))}
                {productos.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No hay productos. Agrega uno en el panel lateral.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <ProductoForm materiales={materialesPlain} />
        </div>
      </div>
    </div>
  )
}
