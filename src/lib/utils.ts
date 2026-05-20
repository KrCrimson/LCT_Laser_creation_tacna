import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un número como moneda (Soles peruanos)
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(num);
}

/**
 * Formatea una fecha a formato local peruano
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Calcula el costo del material para una pieza dada
 * Fórmula original VFP: (areaPieza * costo90x60) / 540000
 */
export const AREA_REFERENCIA = 540000; // 900mm * 600mm

export function calcularCostoMaterial(
  largo: number,
  ancho: number,
  costo90x60: number
): number {
  const areaPieza = largo * ancho;
  return Math.round(((areaPieza * costo90x60) / AREA_REFERENCIA) * 100) / 100;
}

/**
 * Calcula el costo de un gasto adicional basado en porcentaje
 */
export function calcularGastoAdicional(
  porcentaje: number,
  costoMaterial: number
): number {
  return Math.round(((porcentaje * costoMaterial) / 100) * 100) / 100;
}

/**
 * Calcula el costo total de un material por pieza 90x60
 */
export function calcularCosto90x60(
  precio: number,
  precioCorte: number,
  costoEnvio: number,
  cantidad90x60: number
): number {
  const total = precio + precioCorte + costoEnvio;
  return Math.round((total / cantidad90x60) * 100) / 100;
}
