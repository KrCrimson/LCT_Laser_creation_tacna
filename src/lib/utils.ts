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
  return Math.round((total / Math.max(1, cantidad90x60)) * 100) / 100;
}

export function calcularArea(largo: number, ancho: number): number {
  return largo * ancho;
}

export function calcularCantidad90x60(areaPlancha: number): number {
  // Cuántas piezas de 540,000 caben, redondeado hacia abajo
  return Math.max(1, Math.floor(areaPlancha / AREA_REFERENCIA));
}

export function calcularPrecioTotalMaterial(precio: number, precioCorte: number, costoEnvio: number): number {
  return precio + precioCorte + costoEnvio;
}

export function calcularCostoPlancha90x60(precioTotal: number, cantidad90x60: number): number {
  return Math.round((precioTotal / Math.max(1, cantidad90x60)) * 100) / 100;
}

/**
 * Extrae el ancho y largo (en mm) de un texto SVG.
 */
export function parseSvgDimensions(svgText: string): { ancho: number | null; largo: number | null } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = doc.documentElement;
    
    const wStr = svgElement.getAttribute("width");
    const hStr = svgElement.getAttribute("height");
    
    const extractMm = (str: string) => {
      const val = parseFloat(str);
      if (str.includes("cm")) return val * 10;
      if (str.includes("in")) return val * 25.4;
      if (str.includes("pt")) return val * 0.352778;
      if (str.includes("px")) return val * 0.264583;
      return val; 
    };

    if (wStr && hStr) {
      return { 
        ancho: Math.round(extractMm(wStr)), 
        largo: Math.round(extractMm(hStr)) 
      };
    } else {
      const viewBox = svgElement.getAttribute("viewBox");
      if (viewBox) {
        const parts = viewBox.split(" ");
        if (parts.length >= 4) {
          return { 
            ancho: Math.round(parseFloat(parts[2])), 
            largo: Math.round(parseFloat(parts[3])) 
          };
        }
      }
    }
  } catch (err) {
    console.error("Error parsing SVG", err);
  }
  return { ancho: null, largo: null };
}
