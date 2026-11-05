import { CASES } from '../content/cases'
import type { GameState } from '../engine/types'

export function PatientScene({ state }: { state: GameState }) {
  const scenario = CASES[state.caseId]
  const wound = state.wounds[0]
  const breathing = state.ventilation === 'running' || (state.vitals.respiratoryRate ?? 0) > 0
  return <section className="scene" aria-label="Interior 2,5D original da ambulância">
    <div className="scene-light light-one" /><div className="scene-light light-two" />
    <div className="cabinet cabinet-left"><span>SUPORTE</span><i /><i /><i /></div>
    <div className="cabinet cabinet-right"><span>VALE UNIT</span><i /><i /></div>
    <div className="ceiling-rail" /><div className="stretcher"><div className="mattress" /></div>
    <div className={`patient ${scenario.patient.bodyPreset} ${breathing ? 'breathing' : 'still'}`}>
      <div className="patient-head"><span className="hair" /></div><div className="patient-neck" /><div className="patient-torso"><span className="shirt" /></div>
      <div className="patient-arm arm-left" /><div className="patient-arm arm-right" /><div className="patient-hips" />
      <div className="patient-leg leg-left" /><div className="patient-leg leg-right" />
      {wound && <span className={`wound ${wound.treated ? 'treated' : ''}`} aria-label={wound.treated ? 'Ferida tratada' : 'Sangramento visível'} />}
      {state.defibrillator.pads && <><span className="pad pad-a" /><span className="pad pad-b" /></>}
    </div>
    <div className="scene-caption"><span>RENDER 2,5D</span><strong>{scenario.patient.name} · {scenario.patient.age} anos</strong><small>{breathing ? 'movimento torácico simulado' : 'sem movimento respiratório detectado no cenário'}</small></div>
  </section>
}
