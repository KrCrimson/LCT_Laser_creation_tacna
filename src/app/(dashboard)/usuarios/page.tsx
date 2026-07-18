import { prisma } from "@/lib/prisma"

export default async function UsuariosPage() {
  const usuarios = await prisma.usuario.findMany()

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Usuarios del Sistema</h1>
      
      <div className="border rounded-lg bg-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground border-b">
            <tr><th className="p-3">Nombre</th><th className="p-3">Email</th><th className="p-3">Rol</th></tr>
          </thead>
          <tbody className="divide-y">
            {usuarios.map(u => (
              <tr key={u.id}>
                <td className="p-3 font-medium">{u.nombre || "Sin nombre"}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.nivel === 2 ? 'Admin' : 'Usuario'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
