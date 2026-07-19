import { describe, it, expect } from 'vitest'
import { calcularArea, calcularCostoPlancha90x60, calcularCostoMaterial } from '../lib/utils'

describe('Cálculos de Costos', () => {
  it('Debe calcular correctamente el área', () => {
    expect(calcularArea(100, 50)).toBe(5000)
    expect(calcularArea(0, 50)).toBe(0)
  })

  it('Debe calcular el costo de la plancha de 90x60 correctamente', () => {
    // Si la plancha cuesta 110 y rinde 5 partes de 90x60, cada parte cuesta 22
    expect(calcularCostoPlancha90x60(110, 5)).toBe(22)
    // Para evitar divisiones por cero, cuando cantidad es 0 asume 1, así que cuesta el total
    expect(calcularCostoPlancha90x60(110, 0)).toBe(110)
  })

  it('Debe calcular el costo del material para un producto', () => {
    // Área de 900x600 es 540000
    // Si la plancha 90x60 cuesta 22 y usamos 300x200 (60000 de area)
    // 60000 * 22 / 540000 = 2.4444... -> redondeado a 2.44
    const result = calcularCostoMaterial(300, 200, 22)
    expect(result).toBe(2.44)
  })
})
