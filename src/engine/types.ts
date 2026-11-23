export type CaseId =
  | 'CASE-001' | 'CASE-003' | 'CASE-004' | 'CASE-011' | 'CASE-014' | 'CASE-018' | 'CASE-019' | 'CASE-021'
  | 'CASE-022' | 'CASE-023' | 'CASE-024' | 'CASE-025' | 'CASE-026' | 'CASE-027' | 'CASE-028' | 'CASE-029' | 'CASE-030' | 'CASE-031'
  | 'CASE-032' | 'CASE-033' | 'CASE-034' | 'CASE-035' | 'CASE-036' | 'CASE-037' | 'CASE-038' | 'CASE-039' | 'CASE-040' | 'CASE-041'

export type Destination = 'discharge' | 'hospital' | 'advanced_team'

export type Rhythm = 'sinus' | 'respiratory_stress' | 'blood_loss_stress' | 'vf' | 'asystole' | 'post_shock'

export type VitalState = {
  heartRate: number | null
  systolicBP: number | null
  diastolicBP: number | null
  spo2: number | null
  respiratoryRate: number | null
  temperatureC: number | null
  glucoseMgDl: number | null
  rhythm: Rhythm
  pulsePresent: boolean
  consciousness: 'alert' | 'voice' | 'pain' | 'unresponsive'
}

export type Wound = {
  region: 'arm_left' | 'chest'
  severity: number
  treated: boolean
}

export type LogEntry = {
  at: number
  code: string
  outcome: string
  tone: 'info' | 'success' | 'warning' | 'danger'
}

export type DefibrillatorState = {
  pads: boolean
  charged: boolean
  cleared: boolean
  shocked: boolean
}

export type GameState = {
  schemaVersion: 1
  caseId: CaseId
  seed: number
  missionVariantId: string
  elapsedSeconds: number
  speed: 0 | 1 | 2 | 3
  vitals: VitalState
  monitorConnected: boolean
  knownInvestigations: string[]
  completedInterventions: string[]
  medicationsGiven: string[]
  protocolEvents: string[]
  wounds: Wound[]
  defibrillator: DefibrillatorState
  ventilation: 'off' | 'connected' | 'running'
  compressions: number
  infusionActive: boolean
  actionLog: LogEntry[]
  penalties: number
  status: 'active' | 'completed'
}

export type CaseDefinition = {
  id: CaseId
  title: string
  shortTitle: string
  category: string
  priority: 'Rotina' | 'Prioridade' | 'Crítico'
  patient: { name: string; age: number; gender: string; bodyPreset: 'marina' | 'caio' }
  dispatch: string
  witness: string
  history: string
  baseline: VitalState
  findings: Record<string, string>
  investigations: string[]
  interventions: string[]
  medications: string[]
  protocolSequence: string[]
  diagnosticKeywords: string[]
  safeDestinations: Destination[]
  expectedActions: string[]
  progression?: {
    stabilizers: string[]
    untreated: Partial<Record<'heartRate' | 'systolicBP' | 'diastolicBP' | 'spo2' | 'respiratoryRate' | 'temperatureC' | 'glucoseMgDl', number>>
    stabilized?: Partial<Record<'heartRate' | 'systolicBP' | 'diastolicBP' | 'spo2' | 'respiratoryRate' | 'temperatureC' | 'glucoseMgDl', number>>
  }
  unlockXp?: number
  requiredCertification?: 'stroke'
  wound?: Wound
  summary: string
}

export type ActionResult = { nextState: GameState; feedback: LogEntry }

export type ScoreReport = {
  score: number
  xp: number
  destination: Destination
  dimensions: Array<{ label: string; value: number; max: number }>
  verdict: string
  notes: string[]
}
