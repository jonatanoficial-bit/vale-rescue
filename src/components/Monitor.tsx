import { useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Rhythm, VitalState } from '../engine/types'
import type { GameState } from '../engine/types'

type MonitorProps = { state: GameState; presentation?: 'embedded' | 'fullscreen'; onExpand?: () => void; onClose?: () => void }

const format = (value: number | null, enabled: boolean, suffix = '') => enabled && value !== null ? `${Math.round(value)}${suffix}` : '—'
const gauss = (value: number, center: number, width: number) => Math.exp(-((value - center) ** 2) / (2 * width ** 2))

function ecgAmplitude(beat: number, rhythm: Rhythm, index: number) {
  if (rhythm === 'vf') {
    const envelope = .15 + Math.abs(Math.sin(index * .045)) * .18
    return envelope * (Math.sin(index * .41) + .56 * Math.sin(index * 1.17) + .24 * Math.sin(index * 2.63))
  }
  if (rhythm === 'asystole' || rhythm === 'post_shock') return .008 * Math.sin(index * .37) + .006 * Math.sin(index * 1.27)
  const p = .07 * gauss(beat, .16, .026)
  const q = -.12 * gauss(beat, .285, .010)
  const r = 1.08 * gauss(beat, .315, .007)
  const s = -.27 * gauss(beat, .345, .014)
  const t = .21 * gauss(beat, .59, .07)
  return p + q + r + s + t
}

function createEcg(vitals: VitalState, phase: number) {
  const heartRate = vitals.heartRate ?? 0
  const duration = 4.8
  const points = Array.from({ length: 240 }, (_, index) => {
    const seconds = phase + (index / 239) * duration
    const beat = heartRate > 0 ? (seconds * heartRate / 60) % 1 : 0
    const amplitude = ecgAmplitude(beat, vitals.rhythm, index + Math.round(phase * 12))
    return `${(index / 239) * 200},${39 - amplitude * 28}`
  }).join(' ')
  return points
}

function createPleth(vitals: VitalState, phase: number) {
  const heartRate = vitals.heartRate ?? 0
  if (vitals.rhythm === 'vf' || vitals.rhythm === 'asystole' || vitals.rhythm === 'post_shock' || !vitals.pulsePresent) return Array.from({ length: 180 }, (_, index) => `${(index / 179) * 200},17`).join(' ')
  return Array.from({ length: 180 }, (_, index) => {
    const seconds = phase + (index / 179) * 4.2
    const beat = heartRate > 0 ? (seconds * heartRate / 60) % 1 : 0
    const pulse = Math.max(0, Math.sin(Math.PI * beat)) ** 1.8
    const y = 17 - pulse * (vitals.spo2 !== null && vitals.spo2 < 88 ? 6 : 10)
    return `${(index / 179) * 200},${y}`
  }).join(' ')
}

export function Monitor({ state, presentation = 'embedded', onExpand, onClose }: MonitorProps) {
  const [phase, setPhase] = useState(0)
  const connected = state.monitorConnected
  useEffect(() => {
    if (!connected) return
    let frame = 0
    let last = window.performance.now()
    const tick = (now: number) => {
      const elapsed = Math.min(.08, (now - last) / 1000)
      last = now
      setPhase((current) => current + elapsed)
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [connected])
  const ecg = useMemo(() => createEcg(state.vitals, phase), [state.vitals, phase])
  const pleth = useMemo(() => createPleth(state.vitals, phase), [state.vitals, phase])
  const rhythmColor = state.vitals.rhythm === 'vf' || state.vitals.rhythm === 'asystole' ? '#ff5975' : state.vitals.spo2 !== null && state.vitals.spo2 < 90 ? '#ffd06b' : '#44f0bd'
  const rhythmLabel: Record<Rhythm, string> = { sinus: 'sinusal', respiratory_stress: 'sinusal acelerado', blood_loss_stress: 'sinusal acelerado', vf: 'fibrilação ventricular', asystole: 'assistolia', post_shock: 'pós-evento' }
  const measuredRate = state.vitals.heartRate === null ? (state.vitals.rhythm === 'asystole' ? 0 : '—') : Math.round(state.vitals.heartRate)
  const interval = state.vitals.heartRate && state.vitals.heartRate > 0 ? `RR ${Math.round(60000 / state.vitals.heartRate)} ms` : 'SEM COMPLEXOS ORGANIZADOS'

  const expand = () => onExpand?.()
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => { if ((event.key === 'Enter' || event.key === ' ') && presentation === 'embedded') { event.preventDefault(); expand() } }

  return <section className={`monitor monitor-${presentation}`} aria-label="Monitor multiparamétrico dinâmico" role={presentation === 'embedded' ? 'button' : undefined} tabIndex={presentation === 'embedded' ? 0 : undefined} onClick={presentation === 'embedded' ? expand : undefined} onKeyDown={onKeyDown}>
    <header><span className="monitor-dot" style={{ background: rhythmColor }} /> MONITOR <small>{connected ? 'SENSOR ATIVO · MOTOR SIMULADO' : 'AGUARDANDO SENSOR'}</small>{presentation === 'embedded' && <button className="monitor-expand" aria-label="Ampliar monitor" onClick={(event) => { event.stopPropagation(); expand() }}>⛶</button>}{presentation === 'fullscreen' && <button className="monitor-close" aria-label="Fechar monitor" onClick={onClose}>Fechar ×</button>}</header>
    <div className="wave-label"><span>ECG</span><b>{measuredRate} BPM</b><em>{rhythmLabel[state.vitals.rhythm]} · {interval}</em></div>
    <svg className="ecg" viewBox="0 0 200 78" role="img" aria-label="Eletrocardiograma simulado dependente da frequência e do ritmo configurados no cenário">
      <path d="M0 15H200M0 39H200M0 63H200M25 0V78M50 0V78M75 0V78M100 0V78M125 0V78M150 0V78M175 0V78" fill="none" stroke="#244153" strokeWidth=".55" />
      <polyline points={connected ? ecg : '0,39 200,39'} fill="none" stroke={connected ? rhythmColor : '#42536b'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
    <div className="pleth-wrap"><span>PLET</span><svg viewBox="0 0 200 24" role="img" aria-label="Curva de oximetria sincronizada"><polyline points={connected ? pleth : '0,17 200,17'} fill="none" stroke="#52ccff" strokeWidth="1.6" vectorEffect="non-scaling-stroke" /></svg></div>
    <div className="vital-grid">
      <Vital name="FC" value={state.vitals.rhythm === 'asystole' ? '0' : format(state.vitals.heartRate, connected)} unit="bpm" color="mint" />
      <Vital name="SpO₂" value={format(state.vitals.spo2, connected, '%')} unit="" color="cyan" />
      <Vital name="PA" value={state.knownInvestigations.includes('bp') && state.vitals.systolicBP !== null ? `${Math.round(state.vitals.systolicBP)}/${Math.round(state.vitals.diastolicBP ?? 0)}` : '—'} unit="mmHg" color="coral" />
      <Vital name="FR" value={format(state.vitals.respiratoryRate, connected)} unit="rpm" color="amber" />
    </div>
  </section>
}

function Vital({ name, value, unit, color }: { name: string; value: string; unit: string; color: string }) {
  return <div className={`vital vital-${color}`}><span>{name}</span><strong>{value}</strong><em>{unit}</em></div>
}
