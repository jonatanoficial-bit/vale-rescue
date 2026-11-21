import { describe, expect, it } from 'vitest'
import { CASE_LIST } from './cases'
import { protocolForCase } from './protocols'

describe('registro de protocolos', () => {
  it('vincula cada ocorrência a uma fonte e limite de uso no jogo', () => {
    for (const scenario of CASE_LIST) {
      const protocol = protocolForCase(scenario.id)
      expect(protocol).toBeDefined()
      expect(protocol?.sourceUrl).toMatch(/^https:\/\//)
      expect(protocol?.clinicalApproval).toMatch(/aprova|aprovação|aprove|direção médica|protocolo local/i)
      expect(protocol?.gameBoundary).toBeTruthy()
    }
  })
})
