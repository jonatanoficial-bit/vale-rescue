import { CASES } from '../content/cases'
import type { ActionResult, CaseId, Destination, GameState, LogEntry, ScoreReport } from './types'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const copyState = (state: GameState): GameState => ({
  ...state,
  vitals: { ...state.vitals }, wounds: state.wounds.map((wound) => ({ ...wound })),
  knownInvestigations: [...state.knownInvestigations], completedInterventions: [...state.completedInterventions],
  medicationsGiven: [...state.medicationsGiven], actionLog: [...state.actionLog], defibrillator: { ...state.defibrillator },
})

const entry = (state: GameState, code: string, outcome: string, tone: LogEntry['tone'] = 'info'): LogEntry => ({ at: state.elapsedSeconds, code, outcome, tone })

const finish = (state: GameState, log: LogEntry): ActionResult => ({ nextState: { ...state, actionLog: [...state.actionLog, log] }, feedback: log })

const reject = (state: GameState, code: string, outcome: string, penalty = 0): ActionResult => {
  const next = copyState(state)
  next.penalties += penalty
  return finish(next, entry(next, code, outcome, penalty ? 'danger' : 'warning'))
}

export const createCaseState = (caseId: CaseId, seed = Math.floor(Date.now() % 1000000)): GameState => {
  const scenario = CASES[caseId]
  const state: GameState = {
    schemaVersion: 1, caseId, seed, elapsedSeconds: 0, speed: 1, vitals: { ...scenario.baseline }, monitorConnected: false,
    knownInvestigations: [], completedInterventions: [], medicationsGiven: [], wounds: scenario.wound ? [{ ...scenario.wound }] : [],
    defibrillator: { pads: false, charged: false, cleared: false, shocked: false }, ventilation: 'off', compressions: 0,
    infusionActive: false, actionLog: [], penalties: 0, status: 'active',
  }
  return finish(state, entry(state, 'START', `Ocorrência ${caseId} iniciada com seed ${seed}.`)).nextState
}

const spendTime = (state: GameState, seconds: number) => advanceTime(state, seconds)

export const investigate = (state: GameState, investigationId: string): ActionResult => {
  const scenario = CASES[state.caseId]
  if (!scenario.investigations.includes(investigationId)) return reject(state, 'INVESTIGAR_BLOQUEADO', 'Avaliação indisponível: instrumento ou contexto não previsto neste cenário.')
  if (state.knownInvestigations.includes(investigationId)) return reject(state, 'INVESTIGAR_REPETIDO', 'Esta informação já foi registrada; repetir não acrescenta novo achado neste momento.')
  const next = copyState(spendTime(state, 12))
  next.knownInvestigations.push(investigationId)
  return finish(next, entry(next, 'INVESTIGAR', scenario.findings[investigationId] ?? 'Avaliação registrada.', 'success'))
}

export const intervene = (state: GameState, interventionId: string): ActionResult => {
  const scenario = CASES[state.caseId]
  if (!scenario.interventions.includes(interventionId)) return reject(state, 'AÇÃO_BLOQUEADA', 'Procedimento indisponível: não indicado ou não previsto para este cenário.')
  if (state.completedInterventions.includes(interventionId)) return reject(state, 'AÇÃO_REPETIDA', 'Ação já concluída: reavalie o paciente antes de repeti-la.')
  if (interventionId === 'control_bleeding' && !state.knownInvestigations.includes('arm_left')) return reject(state, 'AÇÃO_REQUER_AVALIAÇÃO', 'Controle indisponível: avalie primeiro a região do ferimento.')
  const next = copyState(spendTime(state, 15))
  next.completedInterventions.push(interventionId)
  if (interventionId === 'monitor') next.monitorConnected = true
  if (interventionId === 'oxygen') { next.vitals.spo2 = clamp((next.vitals.spo2 ?? 0) + 4, 0, 100); next.vitals.respiratoryRate = Math.max(12, (next.vitals.respiratoryRate ?? 12) - 3) }
  if (interventionId === 'airway' && state.caseId === 'CASE-003') next.vitals.spo2 = clamp((next.vitals.spo2 ?? 0) + 2, 0, 100)
  if (interventionId === 'control_bleeding') { next.wounds = next.wounds.map((wound) => ({ ...wound, treated: true, severity: 0.22 })); next.vitals.systolicBP = (next.vitals.systolicBP ?? 0) + 8 }
  return finish(next, entry(next, 'INTERVENÇÃO', `${interventionId === 'control_bleeding' ? 'Controle de sangramento aplicado; ferida atualizada.' : 'Intervenção concluída e registrada no diário.'}`, 'success'))
}

export const administerMedication = (state: GameState, medicationId: string): ActionResult => {
  const scenario = CASES[state.caseId]
  if (!scenario.medications.includes(medicationId)) return reject(state, 'MEDICAÇÃO_BLOQUEADA', 'Item indisponível: não é indicado ou autorizado pelo roteiro deste caso.')
  if (state.medicationsGiven.includes(medicationId)) return reject(state, 'MEDICAÇÃO_REPETIDA', 'Item já registrado neste atendimento.')
  if (medicationId === 'glucose-gel' && !state.knownInvestigations.includes('glucose')) return reject(state, 'MEDICAÇÃO_REQUER_AVALIAÇÃO', 'Item bloqueado: a glicemia precisa ser investigada antes da decisão simulada.')
  const next = copyState(spendTime(state, 10))
  next.medicationsGiven.push(medicationId)
  if (medicationId === 'glucose-gel') { next.vitals.heartRate = Math.max(72, (next.vitals.heartRate ?? 72) - 8); next.vitals.glucoseMgDl = 88 }
  if (medicationId === 'bronchodilator') next.vitals.spo2 = clamp((next.vitals.spo2 ?? 0) + 2, 0, 100)
  return finish(next, entry(next, 'MEDICAÇÃO', 'Item de cenário aplicado após confirmação. Sem dosagem ou posologia neste jogo.', 'success'))
}

export const registerCompression = (state: GameState): ActionResult => {
  if (state.caseId !== 'CASE-011') return reject(state, 'COMPRESSÃO_BLOQUEADA', 'Compressão indisponível: o cenário atual não requer esta mecânica fictícia.')
  const next = copyState(state)
  next.compressions += 1
  const note = next.compressions % 5 === 0 ? `Compressão ${next.compressions} registrada. Cadência do jogo: sequência em andamento.` : `Compressão ${next.compressions} registrada.`
  return finish(next, entry(next, 'COMPRESSÃO', note, 'success'))
}

export const defibrillate = (state: GameState, step: 'pads' | 'charge' | 'clear' | 'shock'): ActionResult => {
  if (state.caseId !== 'CASE-011') return reject(state, 'DESFIBRILAÇÃO_BLOQUEADA', 'Choque recusado: ritmo/condição sem indicação no cenário.', 45)
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
  next.defibrillator.shocked = true; next.defibrillator.charged = false; next.defibrillator.cleared = false; next.vitals.rhythm = 'post_shock'
  return finish(next, entry(next, 'DESFIBRILADOR', 'Choque fictício registrado. O cenário exige reavaliação; não há recuperação automática.', 'warning'))
}

export const setVentilation = (state: GameState, step: 'connect' | 'start' | 'stop'): ActionResult => {
  if (state.caseId !== 'CASE-011') return reject(state, 'VENTILAÇÃO_BLOQUEADA', 'Ventilação mecânica indisponível: equipamento/equipe não previstos neste cenário.')
  const next = copyState(state)
  if (step === 'connect') { next.ventilation = 'connected'; return finish(next, entry(next, 'VENTILAÇÃO', 'Conexão simulada registrada.', 'success')) }
  if (step === 'start') {
    if (next.ventilation !== 'connected') return reject(state, 'VENTILAÇÃO_BLOQUEADA', 'Início indisponível: conecte o equipamento primeiro.')
    next.ventilation = 'running'; return finish(next, entry(next, 'VENTILAÇÃO', 'Ventilação fictícia iniciada; acompanhe o monitor.', 'success'))
  }
  next.ventilation = 'off'; return finish(next, entry(next, 'VENTILAÇÃO', 'Ventilação interrompida no cenário.', 'warning'))
}

export const startInfusion = (state: GameState): ActionResult => {
  if (state.caseId !== 'CASE-004') return reject(state, 'INFUSÃO_BLOQUEADA', 'Infusão indisponível: este recurso não é universal no cenário.')
  if (!state.completedInterventions.includes('iv_access')) return reject(state, 'INFUSÃO_REQUER_ACESSO', 'Infusão indisponível: realize o acesso previsto pelo cenário primeiro.')
  const next = copyState(state); next.infusionActive = true
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
  }
  if (next.caseId === 'CASE-004' && !has('control_bleeding')) {
    next.vitals.systolicBP = clamp((next.vitals.systolicBP ?? 105) - seconds * 0.03, 70, 160)
    next.vitals.heartRate = clamp((next.vitals.heartRate ?? 100) + seconds * 0.025, 40, 160)
  }
  if (next.caseId === 'CASE-004' && has('control_bleeding') && next.infusionActive) next.vitals.systolicBP = clamp((next.vitals.systolicBP ?? 100) + seconds * 0.015, 70, 130)
  if (next.caseId === 'CASE-011' && next.defibrillator.shocked && next.compressions >= 8 && next.ventilation === 'running') {
    next.vitals.spo2 = clamp((next.vitals.spo2 ?? 70) + seconds * 0.08, 60, 86)
    next.vitals.respiratoryRate = 8
  }
  return next
}

export const evaluateOutcome = (state: GameState, destination: Destination, hypothesis: string, rationale: string): ScoreReport => {
  const scenario = CASES[state.caseId]
  const fulfilled = scenario.expectedActions.filter((action) => action === 'compress' ? state.compressions >= 8 : action === 'shock' ? state.defibrillator.shocked : action === 'ventilation' ? state.ventilation === 'running' : state.knownInvestigations.includes(action) || state.completedInterventions.includes(action)).length
  const assessment = Math.round(Math.min(1, state.knownInvestigations.length / Math.min(4, scenario.investigations.length)) * 200)
  const safety = clamp(200 - state.penalties, 0, 200)
  const decision = Math.round((fulfilled / scenario.expectedActions.length) * 250)
  const reassessment = Math.min(150, (state.monitorConnected ? 90 : 0) + (state.knownInvestigations.includes('spo2') ? 30 : 0) + (state.knownInvestigations.includes('bp') ? 30 : 0))
  const destinationScore = scenario.safeDestinations.includes(destination) ? 150 : 10
  const efficiency = clamp(50 - Math.floor(state.elapsedSeconds / 45), 10, 50)
  const score = clamp(assessment + safety + decision + reassessment + destinationScore + efficiency, 0, 1000)
  const notes = [
    hypothesis.trim() ? `Hipótese registrada: ${hypothesis.trim()}.` : 'Hipótese não registrada.',
    rationale.trim() ? 'Justificativa de destino registrada.' : 'Justificativa de destino ausente.',
    scenario.safeDestinations.includes(destination) ? 'Destino compatível com o roteiro simulado.' : 'Destino incompatível com o risco do roteiro; pontuação de documentação reduzida.',
  ]
  return { score, xp: Math.round(score * 0.65), destination, dimensions: [
    { label: 'Avaliação', value: assessment, max: 200 }, { label: 'Segurança', value: safety, max: 200 },
    { label: 'Decisão', value: decision, max: 250 }, { label: 'Reavaliação', value: reassessment, max: 150 },
    { label: 'Destino', value: destinationScore, max: 150 }, { label: 'Eficiência', value: efficiency, max: 50 },
  ], verdict: score >= 760 ? 'Plantão consistente no roteiro ficcional.' : score >= 480 ? 'Atendimento concluído com pontos de revisão.' : 'Atendimento com riscos registrados para estudo.', notes }
}
