import { describe, expect, it } from 'vitest'
import { advanceTime, createCaseState, defibrillate, evaluateOutcome, investigate, intervene, registerCompression, setVentilation } from './clinical'

describe('motor do Vale Rescue', () => {
  it('mantém a investigação separada da fisiologia', () => {
    const initial = createCaseState('CASE-001', 12)
    const result = investigate(initial, 'glucose')
    expect(result.nextState.knownInvestigations).toContain('glucose')
    expect(result.nextState.vitals.glucoseMgDl).toBe(initial.vitals.glucoseMgDl)
    expect(result.nextState.elapsedSeconds).toBeGreaterThan(initial.elapsedSeconds)
  })

  it('deteriora o caso respiratório sem suporte e responde à ação contextual', () => {
    const initial = createCaseState('CASE-003', 34)
    const later = advanceTime(initial, 60)
    expect(later.vitals.spo2).toBeLessThan(initial.vitals.spo2 ?? 100)
    const oxygen = intervene(later, 'oxygen').nextState
    expect(oxygen.vitals.spo2).toBeGreaterThan(later.vitals.spo2 ?? 0)
  })

  it('exige inspeção e trata visualmente a ferida simulada', () => {
    const initial = createCaseState('CASE-004', 56)
    expect(intervene(initial, 'control_bleeding').feedback.code).toBe('AÇÃO_REQUER_AVALIAÇÃO')
    const inspected = investigate(initial, 'arm_left').nextState
    const treated = intervene(inspected, 'control_bleeding').nextState
    expect(treated.wounds[0]).toMatchObject({ treated: true, severity: 0.22 })
    expect(treated.completedInterventions).toContain('control_bleeding')
  })

  it('registra uma compressão por toque e não permite choque sem as etapas', () => {
    const initial = createCaseState('CASE-011', 78)
    expect(registerCompression(initial).nextState.compressions).toBe(1)
    expect(defibrillate(initial, 'shock').feedback.code).toBe('CHOQUE_BLOQUEADO')
    const pads = defibrillate(initial, 'pads').nextState
    const charged = defibrillate(pads, 'charge').nextState
    const cleared = defibrillate(charged, 'clear').nextState
    const shocked = defibrillate(cleared, 'shock').nextState
    expect(shocked.defibrillator.shocked).toBe(true)
    expect(shocked.vitals.pulsePresent).toBe(false)
  })

  it('mantém o fluxo crítico fictício sem recuperação automática', () => {
    let state = createCaseState('CASE-011', 90)
    state = defibrillate(state, 'pads').nextState
    state = defibrillate(state, 'charge').nextState
    state = defibrillate(state, 'clear').nextState
    state = defibrillate(state, 'shock').nextState
    for (let index = 0; index < 8; index += 1) state = registerCompression(state).nextState
    state = setVentilation(state, 'connect').nextState
    state = setVentilation(state, 'start').nextState
    const later = advanceTime(state, 20)
    expect(later.vitals.spo2).toBeGreaterThan(state.vitals.spo2 ?? 0)
    expect(later.vitals.pulsePresent).toBe(false)
  })

  it('avalia destino compatível acima da alta indevida', () => {
    let state = createCaseState('CASE-004', 20)
    state = investigate(state, 'arm_left').nextState
    state = intervene(state, 'control_bleeding').nextState
    state = intervene(state, 'monitor').nextState
    const hospital = evaluateOutcome(state, 'hospital', 'Trauma simulado', 'Transporte registrado')
    const discharge = evaluateOutcome(state, 'discharge', 'Trauma simulado', 'Alta')
    expect(hospital.score).toBeGreaterThan(discharge.score)
    expect(hospital.score).toBeLessThanOrEqual(1000)
  })
})
