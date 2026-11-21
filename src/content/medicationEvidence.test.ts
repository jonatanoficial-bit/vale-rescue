import { describe, expect, it } from 'vitest'
import { MEDICATION_EVIDENCE } from './medicationEvidence'

describe('matriz farmacológica virtual', () => {
  it('exige uma fonte primária para cada perfil ativado no jogo', () => {
    for (const item of MEDICATION_EVIDENCE) {
      expect(item.status).toBe('modelo virtual com fonte')
      expect(item.sourceUrl).toMatch(/^https:\/\//)
      expect(item.gameScope.length).toBeGreaterThan(24)
    }
  })
})
