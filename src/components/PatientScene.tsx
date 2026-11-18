import { CASES } from '../content/cases'
import type { GameState } from '../engine/types'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/scene/${name}`

export function PatientScene({ state }: { state: GameState }) {
  const scenario = CASES[state.caseId]
  const wound = state.wounds[0]
  const breathing = state.ventilation === 'running' || (state.vitals.respiratoryRate ?? 0) > 0
  const sceneAsset = scenario.patient.bodyPreset === 'marina' ? 'ambulance-patient-female-v3.png' : 'ambulance-patient-male-v3.png'

  return <section className={`scene ${scenario.patient.bodyPreset}`} aria-label="Ambulância 2,5D e paciente simulado">
    <img className="scene-background" src={asset(sceneAsset)} alt={`Ambulância ficcional com ${scenario.patient.name} deitado na maca`} />
    <div className={`scene-vignette ${breathing ? 'breathing' : ''}`} />
    {wound && <span className={`wound scene-wound ${wound.treated ? 'treated' : ''}`} aria-label={wound.treated ? 'Ferida tratada' : 'Sangramento visível'} />}
    {state.defibrillator.pads && <><span className="pad scene-pad pad-a" /><span className="pad scene-pad pad-b" /></>}
    <div className="scene-caption"><span>UNIDADE 07 · VISUAL 2,5D</span><strong>{scenario.patient.name} · {scenario.patient.age} anos</strong><small>{breathing ? 'monitorização e movimento torácico simulados' : 'sem movimento respiratório detectado no cenário'}</small></div>
  </section>
}
