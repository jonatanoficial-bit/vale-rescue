import { useEffect, useMemo, useState } from 'react'
import type { Rhythm, VitalState } from '../engine/types'
import type { GameState } from '../engine/types'

type MonitorProps = { state: GameState }

const format = (value: number | null, enabled: boolean, suffix = '') => enabled && value !== null ? `${Math.round(value)}${suffix}` : '—'
const gauss = (value: number, center: number, width: number) => Math.exp(-((value - center) ** 2) / (2 * width ** 2))

function ecgAmplitude(beat: number, rhythm: Rhythm, index: number) {
  if (rhythm === 'vf') return Math.sin(index * 1.8) * .23 + Math.sin(index * .47) * .16 + Math.sin(index * 3.3) * .08
  if (rhythm === 'post_shock') return .02 * Math.sin(index * .35)
  return .07 * gauss(beat, .16, .028) - .12 * gauss(beat, .29, .012) + 1.05 * gauss(beat, .32, .009) - .25 * gauss(beat, .35, .016) + .20 * gauss(beat, .61, .075)
}

function createEcg(vitals: VitalState, phase: number) {
  const heartRate = vitals.heartRate ?? 0
  const duration = 3.8
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
  return Array.from({ length: 180 }, (_, index) => {
    const seconds = phase + (index / 179) * 4.2
    const beat = heartRate > 0 ? (seconds * heartRate / 60) % 1 : 0
    const pulse = Math.max(0, Math.sin(Math.PI * beat)) ** 1.8
    const y = 17 - pulse * (vitals.spo2 !== null && vitals.spo2 < 88 ? 6 : 10)
    return `${(index / 179) * 200},${y}`
  }).join(' ')
}

export function Monitor({ state }: MonitorProps) {
  const [phase, setPhase] = useState(0)
  const connected = state.monitorConnected
  useEffect(() => {
    if (!connected) return
    const timer = window.setInterval(() => setPhase((current) => current + .12), 120)
    return () => window.clearInterval(timer)
  }, [connected])
  const ecg = useMemo(() => createEcg(state.vitals, phase), [state.vitals, phase])
  const pleth = useMemo(() => createPleth(state.vitals, phase), [state.vitals, phase])
  const rhythmColor = state.vitals.rhythm === 'vf' ? '#ff5975' : state.vitals.spo2 !== null && state.vitals.spo2 < 90 ? '#ffd06b' : '#44f0bd'

  return <section className="monitor" aria-label="Monitor multiparamétrico dinâmico">
    <header><span className="monitor-dot" style={{ background: rhythmColor }} /> MONITOR <small>{connected ? 'SENSOR ATIVO · MOTOR SIMULADO' : 'AGUARDANDO SENSOR'}</small></header>
    <div className="wave-label"><span>ECG</span><b>{state.vitals.heartRate ?? '—'} BPM</b><em>{state.vitals.rhythm.replaceAll('_', ' ')}</em></div>
    <svg className="ecg" viewBox="0 0 200 78" role="img" aria-label="Eletrocardiograma simulado dependente da frequência cardíaca">
      <path d="M0 15H200M0 39H200M0 63H200M25 0V78M50 0V78M75 0V78M100 0V78M125 0V78M150 0V78M175 0V78" fill="none" stroke="#244153" strokeWidth=".55" />
      <polyline points={connected ? ecg : '0,39 200,39'} fill="none" stroke={connected ? rhythmColor : '#42536b'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
    <div className="pleth-wrap"><span>PLET</span><svg viewBox="0 0 200 24" role="img" aria-label="Curva de oximetria sincronizada"><polyline points={connected ? pleth : '0,17 200,17'} fill="none" stroke="#52ccff" strokeWidth="1.6" vectorEffect="non-scaling-stroke" /></svg></div>
    <div className="vital-grid">
      <Vital name="FC" value={format(state.vitals.heartRate, connected)} unit="bpm" color="mint" />
      <Vital name="SpO₂" value={format(state.vitals.spo2, connected, '%')} unit="" color="cyan" />
      <Vital name="PA" value={state.knownInvestigations.includes('bp') && state.vitals.systolicBP !== null ? `${Math.round(state.vitals.systolicBP)}/${Math.round(state.vitals.diastolicBP ?? 0)}` : '—'} unit="mmHg" color="coral" />
      <Vital name="FR" value={format(state.vitals.respiratoryRate, connected)} unit="rpm" color="amber" />
    </div>
  </section>
}

function Vital({ name, value, unit, color }: { name: string; value: string; unit: string; color: string }) {
  return <div className={`vital vital-${color}`}><span>{name}</span><strong>{value}</strong><em>{unit}</em></div>
}
