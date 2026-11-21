import { CASES } from '../content/cases'
import type { GameState } from '../engine/types'

export type MissionTarget = 'research' | 'actions' | 'defib' | 'ventilation' | 'compress' | 'finish'

type MissionStep = {
  id: string
  label: string
  target: MissionTarget
  done: (state: GameState) => boolean
}

const stepFor = (id: string): MissionStep => {
  const shared = {
    monitor: { label: 'Monitor conectado', target: 'actions' as const, done: (state: GameState) => state.completedInterventions.includes('monitor') },
    observation: { label: 'Fazer observação inicial', target: 'research' as const, done: (state: GameState) => state.knownInvestigations.includes('observation') },
    consciousness: { label: 'Registrar consciência', target: 'research' as const, done: (state: GameState) => state.knownInvestigations.includes('consciousness') },
    glucose: { label: 'Coletar dado do cenário', target: 'research' as const, done: (state: GameState) => state.knownInvestigations.includes('glucose') },
    spo2: { label: 'Checar o sensor', target: 'research' as const, done: (state: GameState) => state.knownInvestigations.includes('spo2') },
    oxygen: { label: 'Executar suporte do roteiro', target: 'actions' as const, done: (state: GameState) => state.completedInterventions.includes('oxygen') },
    airway: { label: 'Reavaliar via do cenário', target: 'actions' as const, done: (state: GameState) => state.completedInterventions.includes('airway') },
    arm_left: { label: 'Avaliar a região indicada', target: 'research' as const, done: (state: GameState) => state.knownInvestigations.includes('arm_left') },
    control_bleeding: { label: 'Concluir ação contextual', target: 'actions' as const, done: (state: GameState) => state.completedInterventions.includes('control_bleeding') },
    position: { label: 'Registrar posicionamento', target: 'actions' as const, done: (state: GameState) => state.completedInterventions.includes('position') },
    call_support: { label: 'Acionar a Central', target: 'actions' as const, done: (state: GameState) => state.completedInterventions.includes('call_support') },
    compress: { label: 'Completar sequência de treino', target: 'compress' as const, done: (state: GameState) => state.compressions >= 8 },
    shock: { label: 'Concluir etapas do dispositivo', target: 'defib' as const, done: (state: GameState) => state.defibrillator.shocked },
    ventilation: { label: 'Ativar suporte de treino', target: 'ventilation' as const, done: (state: GameState) => state.ventilation === 'running' },
  } as const
  const descriptor = shared[id as keyof typeof shared]
  return descriptor ? { id, ...descriptor } : { id, label: 'Revisar ocorrência', target: 'research', done: () => false }
}

export function MissionPulse({ state, onSelect }: { state: GameState; onSelect: (target: MissionTarget) => void }) {
  const scenario = CASES[state.caseId]
  const steps = scenario.expectedActions.map(stepFor)
  const complete = steps.filter((step) => step.done(state)).length
  const current = steps.find((step) => !step.done(state))
  const done = !current

  return <section className={`mission-pulse ${done ? 'mission-complete' : ''}`} aria-label="Roteiro simulado da missão">
    <header><span>ROTEIRO SIMULADO</span><b>{complete}/{steps.length}</b></header>
    <div className="mission-meter" aria-hidden="true"><i style={{ width: `${(complete / steps.length) * 100}%` }} /></div>
    <div className="mission-current"><div><small>{done ? 'PRONTO PARA DESTINO' : 'PRÓXIMO OBJETIVO'}</small><strong>{done ? 'Defina o encerramento da missão' : current?.label}</strong></div><button onClick={() => onSelect(done ? 'finish' : current!.target)}>{done ? 'Destino' : 'Ir →'}</button></div>
    <ol>{steps.map((step) => <li className={step.done(state) ? 'done' : ''} key={step.id}><span>{step.done(state) ? '✓' : '○'}</span>{step.label}</li>)}</ol>
    <p>Guia de objetivo do jogo; não é protocolo de atendimento.</p>
  </section>
}
