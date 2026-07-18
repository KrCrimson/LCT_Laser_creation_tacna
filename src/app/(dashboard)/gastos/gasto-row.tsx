"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function GastoRow({ gasto, updateAction, deleteAction }: { gasto: any, updateAction: any, deleteAction: any }) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <tr className="border-t bg-muted/30">
        <td colSpan={3} className="p-2">
          <form action={async (formData) => {
            await updateAction(formData)
            setIsEditing(false)
          }} className="flex items-center gap-2">
            <input type="hidden" name="id" value={gasto.id} />
            <Input name="descripcion" defaultValue={gasto.descripcion} required className="h-8 flex-1" />
            <Input name="porcentaje" type="number" min="0" max="100" step="0.01" defaultValue={Number(gasto.porcentaje)} required className="h-8 w-24" />
            <Button type="submit" size="sm" className="h-8">Guardar</Button>
            <Button type="button" variant="ghost" size="sm" className="h-8" onClick={() => setIsEditing(false)}>Cancelar</Button>
          </form>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-t">
      <td className="p-3 font-medium">{gasto.descripcion}</td>
      <td className="p-3">{Number(gasto.porcentaje)}%</td>
      <td className="p-3 flex gap-4">
        <button onClick={() => setIsEditing(true)} className="text-primary text-xs hover:underline font-medium">Editar</button>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={gasto.id} />
          <button type="submit" className="text-destructive text-xs hover:underline font-medium">Eliminar</button>
        </form>
      </td>
    </tr>
  )
}
