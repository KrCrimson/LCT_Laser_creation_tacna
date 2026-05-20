// Tipos compartidos del sistema Laser Creation Tacna
// Basados en el schema de Prisma

export type UserRole = 1 | 2; // 1 = usuario normal, 2 = administrador

export interface SessionUser {
  id: string;
  username: string;
  nombre: string;
  nivel: UserRole;
  foto?: string | null;
}

// Tipos para formularios (sin campos auto-generados)
export interface ClienteForm {
  nombre: string;
  domicilio?: string;
  telefono?: string;
}

export interface MaterialForm {
  descripcion: string;
  espesor: number;
  procedencia?: string;
  largo: number;
  ancho: number;
  cantidad90x60: number;
  precio: number;
  precioCorte: number;
  costoEnvio: number;
}

export interface ComplementoForm {
  descripcion: string;
  precio: number;
  cantidad: number;
}

export interface GastoAdicionalForm {
  descripcion: string;
  porcentaje: number;
}

export interface ProductoForm {
  descripcion: string;
  detalles?: string;
  imagen?: string;
  largo: number;
  ancho: number;
  materialId: string;
  gastosAdicionalesIds: string[];
  complementosIds: string[];
}

export interface ProformaForm {
  clienteId: string;
  descripcion?: string;
  imagen?: string;
  items: ProformaItemForm[];
}

export interface ProformaItemForm {
  productoId: string;
  cantidad: number;
  ganancia: number; // porcentaje de ganancia
}

// Respuesta genérica de API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
