import { describe, expect, it } from 'vitest'
import { administerMedication, advanceTime, createCaseState, defibrillate, evaluateOutcome, investigate, intervene, registerCompression, setVentilation } from './clinical'

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
    expect(initial.monitorConnected).toBe(true)
    const later = advanceTime(initial, 60)
    expect(later.vitals.spo2).toBeLessThan(initial.vitals.spo2 ?? 100)
    expect(later.vitals.heartRate).toBeGreaterThan(initial.vitals.heartRate ?? 0)
    const oxygen = intervene(later, 'oxygen').nextState
    expect(oxygen.vitals.spo2).toBeGreaterThan(later.vitals.spo2 ?? 0)
    expect(oxygen.vitals.heartRate).toBeLessThan(later.vitals.heartRate ?? Infinity)
  })

  it('exige inspeção e trata visualmente a ferida simulada', () => {
    const initial = createCaseState('CASE-004', 56)
    expect(intervene(initial, 'control_bleeding').feedback.code).toBe('AÇÃO_SEM_AVALIAÇÃO')
    const inspected = investigate(initial, 'arm_left').nextState
    const treated = intervene(inspected, 'control_bleeding').nextState
    expect(treated.wounds[0]).toMatchObject({ treated: true, severity: 0.22 })
    expect(treated.completedInterventions).toContain('control_bleeding')
    expect(treated.vitals.heartRate).toBeLessThan(inspected.vitals.heartRate ?? Infinity)
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

  it('não inventa uma resposta individual ao tentar medicamento fora do roteiro', () => {
    const initial = createCaseState('CASE-004', 19)
    const result = administerMedication(initial, 'propofol')
    expect(result.feedback.code).toBe('MEDICAÇÃO_SEM_MODELO_VALIDADO')
    expect(result.nextState.penalties).toBeGreaterThan(initial.penalties)
    expect(result.nextState.elapsedSeconds).toBeGreaterThan(initial.elapsedSeconds)
    expect(result.nextState.vitals).toEqual(advanceTime(initial, 8).vitals)
  })

  it('aplica resposta virtual contextual ao item autorizado', () => {
    let state = createCaseState('CASE-001', 21)
    state = investigate(state, 'glucose').nextState
    const before = { ...state.vitals }
    const result = administerMedication(state, 'glucose-gel')
    expect(result.feedback.code).toBe('MEDICAÇÃO_REGISTRADA')
    expect(result.nextState.medicationsGiven).toContain('glucose-gel')
    expect(result.nextState.vitals.glucoseMgDl).toBeGreaterThan(before.glucoseMgDl ?? 0)
    expect(result.nextState.vitals.heartRate).toBeLessThan(before.heartRate ?? Infinity)
  })

  it('aplica risco virtual com fonte ao anticoagulante em sangramento ativo', () => {
    const initial = createCaseState('CASE-004', 23)
    const expectedTimeline = advanceTime(initial, 8)
    const result = administerMedication(initial, 'heparin')
    expect(result.feedback.code).toBe('RISCO_FARMACOLÓGICO_VIRTUAL')
    expect(result.nextState.wounds[0].severity).toBeGreaterThan(expectedTimeline.wounds[0].severity)
    expect(result.nextState.vitals.systolicBP).toBeLessThan(expectedTimeline.vitals.systolicBP ?? Infinity)
  })

  it('recompensa a sequência de referência e dá crédito parcial fora de ordem', () => {
    let ordered = createCaseState('CASE-001', 44)
    ordered = investigate(ordered, 'observation').nextState
    ordered = investigate(ordered, 'glucose').nextState
    ordered = administerMedication(ordered, 'glucose-gel').nextState

    let reordered = createCaseState('CASE-001', 44)
    reordered = investigate(reordered, 'glucose').nextState
    reordered = investigate(reordered, 'observation').nextState
    reordered = administerMedication(reordered, 'glucose-gel').nextState

    const inOrder = evaluateOutcome(ordered, 'hospital', 'Hipoglicemia no cenário', 'Achados registrados')
    const outOfOrder = evaluateOutcome(reordered, 'hospital', 'Hipoglicemia no cenário', 'Achados registrados')
    expect(inOrder.score).toBeGreaterThan(outOfOrder.score)
    expect(inOrder.dimensions.find((item) => item.label === 'Sequência')?.value).toBeGreaterThan(outOfOrder.dimensions.find((item) => item.label === 'Sequência')?.value ?? 0)
  })

  it('penaliza diagnóstico final incompatível com o roteiro do caso', () => {
    const state = createCaseState('CASE-001', 66)
    const compatible = evaluateOutcome(state, 'hospital', 'Hipoglicemia no cenário', 'Registro')
    const incompatible = evaluateOutcome(state, 'hospital', 'Trauma torácico', 'Registro')
    expect(compatible.score).toBeGreaterThan(incompatible.score)
    expect(incompatible.dimensions.find((item) => item.label === 'Diagnóstico')?.value).toBe(0)
  })
})
