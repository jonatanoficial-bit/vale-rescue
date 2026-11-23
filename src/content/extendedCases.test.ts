import { describe, expect, it } from 'vitest'
import { CASE_LIST } from './cases'

describe('biblioteca ampliada de ocorrências', () => {
  it('oferece 28 casos-base distribuídos em múltiplas categorias e prioridades', () => {
    expect(CASE_LIST).toHaveLength(28)
    expect(new Set(CASE_LIST.map((item) => item.id)).size).toBe(28)
    expect(new Set(CASE_LIST.map((item) => item.category)).size).toBeGreaterThanOrEqual(8)
    expect(CASE_LIST.filter((item) => item.priority === 'Crítico')).toHaveLength(8)
  })

  it('mantém chave diagnóstica, sequência e destino para cada roteiro', () => {
    for (const scenario of CASE_LIST) {
      expect(scenario.diagnosticKeywords.length).toBeGreaterThan(0)
      expect(scenario.protocolSequence.length).toBeGreaterThan(2)
      expect(scenario.safeDestinations.length).toBeGreaterThan(0)
    }
  })
})
