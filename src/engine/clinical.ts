import { CASES } from '../content/cases'
import { medicationEvidenceFor } from '../content/medicationEvidence'
import type { ActionResult, CaseId, Destination, GameState, LogEntry, ScoreReport } from './types'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const seededOffset = (seed: number, channel: number, amplitude: number) => {
  const value = Math.sin((seed + 17) * (channel + 3) * 12.9898) * 43758.5453
  return (value - Math.floor(value) - .5) * 2 * amplitude
}

const varyVitals = (baseline: GameState['vitals'], seed: number): GameState['vitals'] => ({
  ...baseline,
  heartRate: baseline.heartRate === null ? null : clamp(Math.round(baseline.heartRate + seededOffset(seed, 1, 5)), 30, 180),
  systolicBP: baseline.systolicBP === null ? null : clamp(Math.round(baseline.systolicBP + seededOffset(seed, 2, 6)), 60, 220),
  diastolicBP: baseline.diastolicBP === null ? null : clamp(Math.round(baseline.diastolicBP + seededOffset(seed, 3, 4)), 35, 140),
  spo2: baseline.spo2 === null ? null : clamp(Math.round(baseline.spo2 + seededOffset(seed, 4, 1)), 55, 100),
  respiratoryRate: baseline.respiratoryRate === null ? null : clamp(Math.round(baseline.respiratoryRate + seededOffset(seed, 5, 2)), 0, 45),
  temperatureC: baseline.temperatureC === null ? null : Math.round((baseline.temperatureC + seededOffset(seed, 6, .25)) * 10) / 10,
  glucoseMgDl: baseline.glucoseMgDl === null ? null : clamp(Math.round(baseline.glucoseMgDl + seededOffset(seed, 7, 7)), 35, 350),
})

const copyState = (state: GameState): GameState => ({
  ...state,
  vitals: { ...state.vitals }, wounds: state.wounds.map((wound) => ({ ...wound })),
  knownInvestigations: [...state.knownInvestigations], completedInterventions: [...state.completedInterventions],
  medicationsGiven: [...state.medicationsGiven], protocolEvents: [...(state.protocolEvents ?? [])], actionLog: [...state.actionLog], defibrillator: { ...state.defibrillator },
})

const entry = (state: GameState, code: string, outcome: string, tone: LogEntry['tone'] = 'info'): LogEntry => ({ at: state.elapsedSeconds, code, outcome, tone })

const finish = (state: GameState, log: LogEntry): ActionResult => ({ nextState: { ...state, actionLog: [...state.actionLog, log] }, feedback: log })

const trackProtocolEvent = (state: GameState, eventId: string) => {
  if (!state.protocolEvents.includes(eventId)) state.protocolEvents.push(eventId)
}

const reject = (state: GameState, code: string, outcome: string, penalty = 0): ActionResult => {
  const next = copyState(state)
  next.penalties += penalty
  return finish(next, entry(next, code, outcome, penalty ? 'danger' : 'warning'))
}

const unsafeAttempt = (state: GameState, code: string, outcome: string, penalty = 18): ActionResult => {
  const next = copyState(spendTime(state, 8))
  next.penalties += penalty
  if (next.vitals.heartRate !== null) next.vitals.heartRate = clamp(next.vitals.heartRate + 4, 0, 180)
  if (next.vitals.spo2 !== null) next.vitals.spo2 = clamp(next.vitals.spo2 - 1, 0, 100)
  if (next.vitals.systolicBP !== null) next.vitals.systolicBP = clamp(next.vitals.systolicBP - 2, 50, 230)
  return finish(next, entry(next, code, `${outcome} O motor registrou risco e alteração fisiológica apenas simulados.`, 'danger'))
}

const addVirtualRisk = (state: GameState, medicationId: string): string | null => {
  const hasActiveBleeding = state.caseId === 'CASE-004' && state.wounds.some((wound) => !wound.treated)
  const lowPressure = (state.vitals.systolicBP ?? 999) < 110
  const respiratoryCompromise = (state.vitals.respiratoryRate ?? 99) < 13 || (state.vitals.spo2 ?? 100) < 91
  const lowGlucose = (state.vitals.glucoseMgDl ?? 999) < 80
  if (medicationId === 'epinephrine' && state.vitals.pulsePresent) {
    if (state.vitals.heartRate !== null) state.vitals.heartRate = clamp(state.vitals.heartRate + 8, 0, 190)
    if (state.vitals.systolicBP !== null) state.vitals.systolicBP = clamp(state.vitals.systolicBP + 10, 50, 240)
    return 'Perfil virtual: estímulo cardiovascular e risco de arritmia registrados.'
  }
  if (medicationId === 'propofol' && respiratoryCompromise) {
    if (state.vitals.spo2 !== null) state.vitals.spo2 = clamp(state.vitals.spo2 - 3, 0, 100)
    if (state.vitals.respiratoryRate !== null) state.vitals.respiratoryRate = clamp(state.vitals.respiratoryRate - 4, 0, 45)
    if (state.vitals.systolicBP !== null) state.vitals.systolicBP = clamp(state.vitals.systolicBP - 8, 50, 240)
    return 'Perfil virtual: depressão cardiorrespiratória registrada.'
  }
  if (medicationId === 'morphine' && (respiratoryCompromise || lowPressure)) {
    if (state.vitals.spo2 !== null) state.vitals.spo2 = clamp(state.vitals.spo2 - 2, 0, 100)
    if (state.vitals.respiratoryRate !== null) state.vitals.respiratoryRate = clamp(state.vitals.respiratoryRate - 3, 0, 45)
    if (state.vitals.systolicBP !== null) state.vitals.systolicBP = clamp(state.vitals.systolicBP - 5, 50, 240)
    return 'Perfil virtual: risco de depressão respiratória e hipotensão registrado.'
  }
  if ((medicationId === 'heparin' || medicationId === 'streptokinase' || medicationId === 'ketorolac') && hasActiveBleeding) {
    state.wounds = state.wounds.map((wound) => ({ ...wound, severity: clamp(wound.severity + .12, 0, 1) }))
    if (state.vitals.systolicBP !== null) state.vitals.systolicBP = clamp(state.vitals.systolicBP - 7, 50, 240)
    if (state.vitals.heartRate !== null) state.vitals.heartRate = clamp(state.vitals.heartRate + 5, 0, 190)
    return 'Perfil virtual: janela hemorrágica agravada.'
  }
  if (medicationId === 'nitroglycerin' && lowPressure) {
    if (state.vitals.systolicBP !== null) state.vitals.systolicBP = clamp(state.vitals.systolicBP - 10, 50, 240)
    if (state.vitals.heartRate !== null) state.vitals.heartRate = clamp(state.vitals.heartRate + 4, 0, 190)
    return 'Perfil virtual: risco hemodinâmico por hipotensão registrado.'
  }
  if (medicationId === 'insulin' && lowGlucose) {
    if (state.vitals.glucoseMgDl !== null) state.vitals.glucoseMgDl = clamp(state.vitals.glucoseMgDl - 18, 25, 350)
    if (state.vitals.heartRate !== null) state.vitals.heartRate = clamp(state.vitals.heartRate + 5, 0, 190)
    return 'Perfil virtual: incompatibilidade glicêmica registrada.'
  }
  return null
}

const medicationRiskAttempt = (state: GameState, medicationId: string): ActionResult => {
  const next = copyState(spendTime(state, 8))
  next.penalties += 25
  trackProtocolEvent(next, `unsafe-medication:${medicationId}`)
  const evidence = medicationEvidenceFor(medicationId)
  const virtualRisk = evidence?.status === 'modelo virtual com fonte' ? addVirtualRisk(next, medicationId) : null
  const outcome = virtualRisk
    ? `Tentativa fora do roteiro. ${virtualRisk} Fonte: ${evidence?.sourceLabel}.`
    : `Tentativa de ${medicationId} fora do roteiro. O evento foi marcado como risco sem resposta fisiológica inventada, pois ainda não há modelo virtual com fonte para este item.`
  return finish(next, entry(next, virtualRisk ? 'RISCO_FARMACOLÓGICO_VIRTUAL' : 'MEDICAÇÃO_SEM_MODELO_VALIDADO', outcome, 'danger'))
}

export const createCaseState = (caseId: CaseId, seed = Math.floor(Date.now() % 1000000)): GameState => {
  const scenario = CASES[caseId]
  const state: GameState = {
    schemaVersion: 1, caseId, seed, elapsedSeconds: 0, speed: 1, vitals: varyVitals(scenario.baseline, seed), monitorConnected: true,
    knownInvestigations: [], completedInterventions: ['monitor'], medicationsGiven: [], protocolEvents: [], wounds: scenario.wound ? [{ ...scenario.wound }] : [],
    defibrillator: { pads: false, charged: false, cleared: false, shocked: false }, ventilation: 'off', compressions: 0,
    infusionActive: false, actionLog: [], penalties: 0, status: 'active',
  }
  return finish(state, entry(state, 'START', `Ocorrência ${caseId} recebida pela Central; monitor pré-conectado e seed ${seed}.`)).nextState
}

const spendTime = (state: GameState, seconds: number) => advanceTime(state, seconds)

export const investigate = (state: GameState, investigationId: string): ActionResult => {
  const scenario = CASES[state.caseId]
  if (!scenario.investigations.includes(investigationId)) return reject(state, 'INVESTIGAR_BLOQUEADO', 'Avaliação indisponível: instrumento ou contexto não previsto neste cenário.')
  if (state.knownInvestigations.includes(investigationId)) return reject(state, 'INVESTIGAR_REPETIDO', 'Esta informação já foi registrada; repetir não acrescenta novo achado neste momento.')
  const next = copyState(spendTime(state, 12))
  next.knownInvestigations.push(investigationId)
  trackProtocolEvent(next, investigationId)
  return finish(next, entry(next, 'INVESTIGAR', scenario.findings[investigationId] ?? 'Avaliação registrada.', 'success'))
}

export const intervene = (state: GameState, interventionId: string): ActionResult => {
  const scenario = CASES[state.caseId]
  if (!scenario.interventions.includes(interventionId)) return unsafeAttempt(state, 'AÇÃO_INCOMPATÍVEL', 'Ação incompatível com este cenário ou sem autorização no roteiro.')
  if (state.completedInterventions.includes(interventionId)) return reject(state, 'AÇÃO_REPETIDA', 'Ação já concluída: reavalie o paciente antes de repeti-la.')
  if (interventionId === 'control_bleeding' && !state.knownInvestigations.includes('arm_left')) return unsafeAttempt(state, 'AÇÃO_SEM_AVALIAÇÃO', 'Ação tentada sem a avaliação prévia requerida pelo cenário.', 12)
  const next = copyState(spendTime(state, 15))
  next.completedInterventions.push(interventionId)
  trackProtocolEvent(next, interventionId)
  if (interventionId === 'monitor') next.monitorConnected = true
  if (interventionId === 'oxygen') {
    next.vitals.spo2 = clamp((next.vitals.spo2 ?? 0) + 4, 0, 100)
    next.vitals.respiratoryRate = Math.max(12, (next.vitals.respiratoryRate ?? 12) - 3)
    next.vitals.heartRate = Math.max(60, (next.vitals.heartRate ?? 60) - 6)
  }
  if (interventionId === 'airway' && state.caseId === 'CASE-003') {
    next.vitals.spo2 = clamp((next.vitals.spo2 ?? 0) + 2, 0, 100)
    next.vitals.respiratoryRate = Math.max(12, (next.vitals.respiratoryRate ?? 12) - 2)
    next.vitals.heartRate = Math.max(60, (next.vitals.heartRate ?? 60) - 3)
  }
  if (interventionId === 'control_bleeding') {
    next.wounds = next.wounds.map((wound) => ({ ...wound, treated: true, severity: 0.22 }))
    next.vitals.systolicBP = (next.vitals.systolicBP ?? 0) + 8
    next.vitals.heartRate = Math.max(60, (next.vitals.heartRate ?? 60) - 7)
  }
  return finish(next, entry(next, 'INTERVENÇÃO', `${interventionId === 'control_bleeding' ? 'Controle de sangramento aplicado; ferida atualizada.' : 'Intervenção concluída e registrada no diário.'}`, 'success'))
}

export const administerMedication = (state: GameState, medicationId: string): ActionResult => {
  const scenario = CASES[state.caseId]
  if (!scenario.medications.includes(medicationId)) return medicationRiskAttempt(state, medicationId)
  if (state.medicationsGiven.includes(medicationId)) return reject(state, 'MEDICAÇÃO_REPETIDA', 'Item já registrado neste atendimento.')
  if (medicationId === 'glucose-gel' && !state.knownInvestigations.includes('glucose')) return unsafeAttempt(state, 'MEDICAÇÃO_SEM_AVALIAÇÃO', 'Item tentado sem a avaliação requerida pelo roteiro.', 18)
  const next = copyState(spendTime(state, 10))
  next.medicationsGiven.push(medicationId)
  trackProtocolEvent(next, `medication:${medicationId}`)
  if (medicationId === 'glucose-gel') {
    if (next.vitals.glucoseMgDl !== null) next.vitals.glucoseMgDl = clamp(next.vitals.glucoseMgDl + 18, 35, 110)
    if (next.vitals.heartRate !== null) next.vitals.heartRate = clamp(next.vitals.heartRate - 4, 45, 180)
  }
  if (medicationId === 'bronchodilator') {
    if (next.vitals.spo2 !== null) next.vitals.spo2 = clamp(next.vitals.spo2 + 2, 0, 100)
    if (next.vitals.respiratoryRate !== null) next.vitals.respiratoryRate = clamp(next.vitals.respiratoryRate - 2, 0, 45)
    if (next.vitals.heartRate !== null) next.vitals.heartRate = clamp(next.vitals.heartRate + 2, 0, 190)
  }
  const evidence = medicationEvidenceFor(medicationId)
  return finish(next, entry(next, 'MEDICAÇÃO_REGISTRADA', `Resposta virtual contextual aplicada ao roteiro. ${evidence ? `Fonte do modelo: ${evidence.sourceLabel}.` : 'Sem previsão individual ou dose.'}`, 'success'))
}

export const registerCompression = (state: GameState): ActionResult => {
  if (state.caseId !== 'CASE-011') return reject(state, 'COMPRESSÃO_BLOQUEADA', 'Compressão indisponível: o cenário atual não requer esta mecânica fictícia.')
  const next = copyState(state)
  next.compressions += 1
  trackProtocolEvent(next, 'compress')
  const note = next.compressions % 5 === 0 ? `Compressão ${next.compressions} registrada. Cadência do jogo: sequência em andamento.` : `Compressão ${next.compressions} registrada.`
  return finish(next, entry(next, 'COMPRESSÃO', note, 'success'))
}

export const defibrillate = (state: GameState, step: 'pads' | 'charge' | 'clear' | 'shock'): ActionResult => {
  if (state.caseId !== 'CASE-011') {
    const next = copyState(state)
    next.penalties += 45
    next.vitals.heartRate = next.vitals.heartRate === null ? null : clamp(next.vitals.heartRate + 8, 0, 180)
    next.vitals.spo2 = next.vitals.spo2 === null ? null : clamp(next.vitals.spo2 - 2, 0, 100)
    return finish(next, entry(next, 'DESFIBRILAÇÃO_BLOQUEADA', 'Choque recusado: ritmo/condição sem indicação no cenário. A tentativa inadequada agrava os sinais simulados.', 'danger'))
  }
  const next = copyState(state)
  if (step === 'pads') { next.defibrillator.pads = true; return finish(next, entry(next, 'DESFIBRILADOR', 'Eletrodos simulados posicionados.', 'success')) }
  if (step === 'charge') {
    if (!next.defibrillator.pads) return reject(state, 'CARREGAR_BLOQUEADO', 'Carregamento indisponível: posicione os eletrodos primeiro.')
    next.defibrillator.charged = true; return finish(next, entry(next, 'DESFIBRILADOR', 'Dispositivo fictício carregado. Confirme afastamento.', 'warning'))
  }
  if (step === 'clear') {
    if (!next.defibrillator.charged) return reject(state, 'AFASTAMENTO_BLOQUEADO', 'Confirmação indisponível: o dispositivo ainda não está carregado.')
    next.defibrillator.cleared = true; return finish(next, entry(next, 'DESFIBRILADOR', 'Afastamento registrado no cenário.', 'success'))
  }
  if (!next.defibrillator.charged || !next.defibrillator.cleared) return reject(state, 'CHOQUE_BLOQUEADO', 'Choque recusado: conclua eletrodos, carregamento e afastamento.', 30)
  next.defibrillator.shocked = true; next.defibrillator.charged = false; next.defibrillator.cleared = false; next.vitals.rhythm = 'post_shock'; trackProtocolEvent(next, 'shock')
  return finish(next, entry(next, 'DESFIBRILADOR', 'Choque fictício registrado. O cenário exige reavaliação; não há recuperação automática.', 'warning'))
}

export const setVentilation = (state: GameState, step: 'connect' | 'start' | 'stop'): ActionResult => {
  if (state.caseId !== 'CASE-011') return reject(state, 'VENTILAÇÃO_BLOQUEADA', 'Ventilação mecânica indisponível: equipamento/equipe não previstos neste cenário.')
  const next = copyState(state)
  if (step === 'connect') { next.ventilation = 'connected'; return finish(next, entry(next, 'VENTILAÇÃO', 'Conexão simulada registrada.', 'success')) }
  if (step === 'start') {
    if (next.ventilation !== 'connected') return reject(state, 'VENTILAÇÃO_BLOQUEADA', 'Início indisponível: conecte o equipamento primeiro.')
    next.ventilation = 'running'; trackProtocolEvent(next, 'ventilation'); return finish(next, entry(next, 'VENTILAÇÃO', 'Ventilação fictícia iniciada; acompanhe o monitor.', 'success'))
  }
  next.ventilation = 'off'; return finish(next, entry(next, 'VENTILAÇÃO', 'Ventilação interrompida no cenário.', 'warning'))
}

export const startInfusion = (state: GameState): ActionResult => {
  if (state.caseId !== 'CASE-004') return reject(state, 'INFUSÃO_BLOQUEADA', 'Infusão indisponível: este recurso não é universal no cenário.')
  if (!state.completedInterventions.includes('iv_access')) return reject(state, 'INFUSÃO_REQUER_ACESSO', 'Infusão indisponível: realize o acesso previsto pelo cenário primeiro.')
  const next = copyState(state); next.infusionActive = true; trackProtocolEvent(next, 'infusion')
  return finish(next, entry(next, 'INFUSÃO', 'Infusão contextual iniciada no cenário fictício, sem parâmetros reais.', 'success'))
}

export const advanceTime = (state: GameState, seconds: number): GameState => {
  if (state.status !== 'active' || state.speed === 0 || seconds <= 0) return state
  const next = copyState(state)
  next.elapsedSeconds += seconds
  const has = (id: string) => next.completedInterventions.includes(id)
  if (next.caseId === 'CASE-003' && !has('oxygen')) {
    next.vitals.spo2 = clamp((next.vitals.spo2 ?? 90) - seconds * 0.04, 75, 100)
    next.vitals.respiratoryRate = clamp((next.vitals.respiratoryRate ?? 22) + seconds * 0.02, 10, 38)
    next.vitals.heartRate = clamp((next.vitals.heartRate ?? 100) + seconds * 0.018, 45, 155)
  }
  if (next.caseId === 'CASE-003' && has('oxygen')) next.vitals.heartRate = clamp((next.vitals.heartRate ?? 90) - seconds * 0.006, 62, 130)
  if (next.caseId === 'CASE-004' && !has('control_bleeding')) {
    next.vitals.systolicBP = clamp((next.vitals.systolicBP ?? 105) - seconds * 0.03, 70, 160)
    next.vitals.heartRate = clamp((next.vitals.heartRate ?? 100) + seconds * 0.025, 40, 160)
  }
  if (next.caseId === 'CASE-004' && has('control_bleeding')) next.vitals.heartRate = clamp((next.vitals.heartRate ?? 100) - seconds * 0.008, 62, 130)
  if (next.caseId === 'CASE-004' && has('control_bleeding') && next.infusionActive) {
    next.vitals.systolicBP = clamp((next.vitals.systolicBP ?? 100) + seconds * 0.015, 70, 130)
    next.vitals.heartRate = clamp((next.vitals.heartRate ?? 100) - seconds * 0.006, 62, 130)
  }
  if (next.caseId === 'CASE-011' && next.defibrillator.shocked && next.compressions >= 8 && next.ventilation === 'running') {
    next.vitals.spo2 = clamp((next.vitals.spo2 ?? 70) + seconds * 0.08, 60, 86)
    next.vitals.respiratoryRate = 8
  }
  return next
}

export const evaluateOutcome = (state: GameState, destination: Destination, hypothesis: string, rationale: string): ScoreReport => {
  const scenario = CASES[state.caseId]
  const fulfilled = scenario.expectedActions.filter((action) => action === 'compress' ? state.compressions >= 8 : action === 'shock' ? state.defibrillator.shocked : action === 'ventilation' ? state.ventilation === 'running' : state.knownInvestigations.includes(action) || state.completedInterventions.includes(action)).length
  const assessment = Math.round(Math.min(1, state.knownInvestigations.length / Math.min(4, scenario.investigations.length)) * 160)
  const safety = clamp(180 - state.penalties, 0, 180)
  const decision = Math.round((fulfilled / scenario.expectedActions.length) * 180)
  const reassessment = Math.min(120, (state.monitorConnected ? 70 : 0) + (state.knownInvestigations.includes('spo2') ? 25 : 0) + (state.knownInvestigations.includes('bp') ? 25 : 0))
  const destinationScore = scenario.safeDestinations.includes(destination) ? 120 : 10
  const protocolEvents = state.protocolEvents ?? []
  const matchedEvents = scenario.protocolSequence.filter((eventId) => protocolEvents.includes(eventId)).length
  let inOrderEvents = 0
  for (const eventId of protocolEvents) if (eventId === scenario.protocolSequence[inOrderEvents]) inOrderEvents += 1
  const outOfOrderEvents = Math.max(0, matchedEvents - inOrderEvents)
  const sequence = clamp(Math.round((inOrderEvents / scenario.protocolSequence.length) * 90 + (outOfOrderEvents / scenario.protocolSequence.length) * 40), 0, 130)
  const normalizedHypothesis = hypothesis.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const diagnosisMatched = scenario.diagnosticKeywords.some((keyword) => normalizedHypothesis.includes(keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()))
  const diagnosis = diagnosisMatched ? 80 : 0
  const diagnosticPenalty = diagnosisMatched ? 0 : 55
  const efficiency = clamp(30 - Math.floor(state.elapsedSeconds / 75), 5, 30)
  const score = clamp(assessment + safety + decision + reassessment + destinationScore + sequence + diagnosis + efficiency - diagnosticPenalty, 0, 1000)
  const notes = [
    diagnosisMatched ? `Diagnóstico final do cenário compatível com a chave de missão: ${hypothesis.trim()}.` : `Diagnóstico final sem correspondência no roteiro: ${hypothesis.trim() || 'não informado'}. Penalidade de missão aplicada.`,
    rationale.trim() ? 'Justificativa de destino registrada.' : 'Justificativa de destino ausente.',
    `Sequência: ${inOrderEvents}/${scenario.protocolSequence.length} etapa(s) na ordem de referência; ${outOfOrderEvents} etapa(s) correta(s) fora da ordem receberam crédito parcial.`,
    scenario.safeDestinations.includes(destination) ? 'Destino compatível com o roteiro simulado.' : 'Destino incompatível com o risco do roteiro; pontuação de documentação reduzida.',
  ]
  return { score, xp: Math.round(score * 0.65), destination, dimensions: [
    { label: 'Avaliação', value: assessment, max: 160 }, { label: 'Segurança', value: safety, max: 180 },
    { label: 'Decisão', value: decision, max: 180 }, { label: 'Reavaliação', value: reassessment, max: 120 }, { label: 'Destino', value: destinationScore, max: 120 }, { label: 'Sequência', value: sequence, max: 130 }, { label: 'Diagnóstico', value: diagnosis, max: 80 }, { label: 'Eficiência', value: efficiency, max: 30 },
  ], verdict: score >= 760 ? 'Plantão consistente no roteiro ficcional.' : score >= 480 ? 'Atendimento concluído com pontos de revisão.' : 'Atendimento com riscos registrados para estudo.', notes }
}
