import { describe, it, expect } from 'vitest'
import { 
  formatCurrency, 
  formatDate, 
  calcularGastoAdicional, 
  calcularCosto90x60, 
  calcularCantidad90x60, 
  calcularPrecioTotalMaterial,
  parseSvgDimensions 
} from '../lib/utils'

describe('Utilidades de Formato', () => {
  it('formatCurrency debe formatear números y strings a Moneda Peruana', () => {
    // Reemplazamos el espacio duro con espacio normal para el test, o usamos regex
    expect(formatCurrency(100)).toMatch(/S\/\s*100\.00/)
    expect(formatCurrency("100.50")).toMatch(/S\/\s*100\.50/)
    expect(formatCurrency(0)).toMatch(/S\/\s*0\.00/)
    expect(formatCurrency(-50)).toMatch(/-S\/\s*50\.00/)
  })

  it('formatDate debe formatear fechas correctamente', () => {
    const date = new Date('2026-07-18T12:00:00Z')
    // El formato peruano suele ser DD/MM/YYYY
    expect(formatDate(date)).toMatch(/\d{2}\/\d{2}\/2026/)
    expect(formatDate('2026-07-18')).toMatch(/\d{2}\/\d{2}\/2026/)
  })
})

describe('Cálculos Adicionales', () => {
  it('calcularGastoAdicional debe calcular correctamente porcentajes', () => {
    expect(calcularGastoAdicional(10, 200)).toBe(20) // 10% de 200 = 20
    expect(calcularGastoAdicional(50, 100)).toBe(50)
    expect(calcularGastoAdicional(0, 100)).toBe(0)
    expect(calcularGastoAdicional(10, 0)).toBe(0)
  })

  it('calcularPrecioTotalMaterial debe sumar todo', () => {
    expect(calcularPrecioTotalMaterial(100, 20, 10)).toBe(130)
    expect(calcularPrecioTotalMaterial(0, 0, 0)).toBe(0)
  })

  it('calcularCosto90x60 debe sumar totales y dividir por planchas', () => {
    // 100 + 10 + 10 = 120 total. Entre 4 = 30
    expect(calcularCosto90x60(100, 10, 10, 4)).toBe(30)
    
    // División por cero debe asumir 1
    expect(calcularCosto90x60(100, 10, 10, 0)).toBe(120)
  })

  it('calcularCantidad90x60 calcula cuantas planchas de 90x60 caben en area total', () => {
    const areaReferencia = 540000;
    // Area doble
    expect(calcularCantidad90x60(areaReferencia * 2)).toBe(2)
    // Area triple + extra
    expect(calcularCantidad90x60(areaReferencia * 3 + 1000)).toBe(3)
    // Si el area es menor, mínimo debe ser 1 (por lógica de negocio)
    expect(calcularCantidad90x60(areaReferencia / 2)).toBe(1)
  })
})

describe('SVG Parser', () => {
  it('Debe extraer width y height en diferentes unidades', () => {
    const svgPx = `<svg width="100px" height="50px"></svg>`
    const resPx = parseSvgDimensions(svgPx)
    expect(resPx).toEqual({ ancho: 26, largo: 13 }) // 100 * 0.264583 = 26.45 -> 26

    const svgCm = `<svg width="10cm" height="5cm"></svg>`
    const resCm = parseSvgDimensions(svgCm)
    expect(resCm).toEqual({ ancho: 100, largo: 50 }) // 10 * 10 = 100
  })

  it('Debe usar viewBox si no hay width y height explícitos', () => {
    const svgViewBox = `<svg viewBox="0 0 200.5 150.2"></svg>`
    const resVB = parseSvgDimensions(svgViewBox)
    expect(resVB).toEqual({ ancho: 201, largo: 150 }) // rounded
  })

  it('Debe devolver null si el SVG es inválido o no tiene medidas', () => {
    const svgInvalid = `<svg></svg>`
    const res = parseSvgDimensions(svgInvalid)
    expect(res).toEqual({ ancho: null, largo: null })
  })
})
