"use client"

import { useState } from "react"
import { createProducto } from "./producto-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { parseSvgDimensions } from "@/lib/utils"

export function ProductoForm({ materiales }: { materiales: any[] }) {
  const [largo, setLargo] = useState(0)
  const [ancho, setAncho] = useState(0)
  const [materialId, setMaterialId] = useState("")
  const [esPlantilla, setEsPlantilla] = useState(false)
  const [archivoDiseno, setArchivoDiseno] = useState("")

  function handleSvgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setArchivoDiseno(result);

      try {
        const base64Data = result.split(',')[1];
        const svgText = atob(base64Data);
        
        const dims = parseSvgDimensions(svgText);
        if (dims.ancho !== null && dims.largo !== null) {
          setAncho(dims.ancho);
          setLargo(dims.largo);
        }
      } catch (err) {
        console.error("Error al procesar SVG", err);
      }
    };
    reader.readAsDataURL(file);
  }

  const materialSeleccionado = materiales.find(m => m.id === materialId)
  const costoMaterial = materialSeleccionado 
    ? (largo * ancho * Number(materialSeleccionado.costo90x60)) / 540000 
    : 0

  return (
    <form action={createProducto} className="space-y-4 max-w-md border p-6 rounded-lg bg-card text-card-foreground">
      <h3 className="text-xl font-bold">Calculadora de Costos (Nuevo Producto)</h3>
      
      <div>
        <label className="text-sm font-medium">Descripción</label>
        <Input name="descripcion" required placeholder="Ej. Llavero personalizado" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Largo / Alto (mm)</label>
          <Input name="largo" type="number" min="1" required value={largo || ""} onChange={(e) => setLargo(Number(e.target.value))} />
        </div>
        <div>
          <label className="text-sm font-medium">Ancho (mm)</label>
          <Input name="ancho" type="number" min="1" required value={ancho || ""} onChange={(e) => setAncho(Number(e.target.value))} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Material Base</label>
        {/* ponytail: un select nativo estilizado como input es más simple que el Select de shadcn que requiere state extra */}
        <select 
          name="materialId" 
          required 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onChange={(e) => setMaterialId(e.target.value)}
        >
          <option value="">Seleccione un material...</option>
          {materiales.map(m => (
            <option key={m.id} value={m.id}>{m.descripcion}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input 
          type="checkbox" 
          id="esPlantilla" 
          name="esPlantilla" 
          checked={esPlantilla}
          onChange={(e) => setEsPlantilla(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="esPlantilla" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Guardar como Diseño Estandarizado (Plantilla)
        </label>
      </div>

      {esPlantilla && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
          <div>
            <label className="text-sm font-medium">Categoría de la Plantilla (opcional)</label>
            <Input name="categoriaPlantilla" placeholder="Ej. Llaveros, Bodas, Cumpleaños..." />
          </div>
          <div>
            <label className="text-sm font-medium">Subir Diseño (.SVG)</label>
            <div className="mt-1 flex items-center gap-2">
              <Input type="file" accept=".svg" onChange={handleSvgUpload} className="cursor-pointer" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">¡Sube tu SVG y extraeremos las medidas automáticamente!</p>
            <input type="hidden" name="archivoDiseno" value={archivoDiseno} />
          </div>
        </div>
      )}

      <div className="p-4 bg-muted rounded-md border text-center">
        <p className="text-sm text-muted-foreground mb-1">Costo Material (Fórmula)</p>
        <p className="text-3xl font-bold text-primary">S/ {costoMaterial.toFixed(2)}</p>
      </div>

      <Button type="submit" className="w-full">Guardar Producto</Button>
    </form>
  )
}
