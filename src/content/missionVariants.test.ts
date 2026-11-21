import { describe, expect, it } from 'vitest'
import { MISSION_VARIANTS, missionVariantFor } from './missionVariants'

describe('baralho de variações de missão', () => {
  it('produz uma variação estável para a mesma seed e oferece variedade suficiente', () => {
    expect(MISSION_VARIANTS.length).toBeGreaterThanOrEqual(12)
    expect(missionVariantFor('CASE-001', 42)).toEqual(missionVariantFor('CASE-001', 42))
    const variants = new Set(Array.from({ length: 30 }, (_, seed) => missionVariantFor('CASE-001', seed).id))
    expect(variants.size).toBeGreaterThan(6)
  })
})
