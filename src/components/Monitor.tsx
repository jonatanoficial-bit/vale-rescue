import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import type { Rhythm, VitalState } from '../engine/types'
import type { GameState } from '../engine/types'

type MonitorProps = { state: GameState; presentation?: 'embedded' | 'fullscreen'; onExpand?: () => void; onClose?: () => void }
type WaveKind = 'ecg' | 'pleth'

const format = (value: number | null, enabled: boolean, suffix = '') => enabled && value !== null ? `${Math.round(value)}${suffix}` : '—'
const gauss = (value: number, center: number, width: number) => Math.exp(-((value - center) ** 2) / (2 * width ** 2))
const cycle = (seconds: number, heartRate: number) => ((seconds * heartRate / 60) % 1 + 1) % 1

function ecgAmplitude(beat: number, rhythm: Rhythm, seconds: number) {
  if (rhythm === 'vf') {
    const envelope = .15 + Math.abs(Math.sin(seconds * 2.7)) * .18
    return envelope * (Math.sin(seconds * 25.8) + .56 * Math.sin(seconds * 73.5) + .24 * Math.sin(seconds * 165.2))
  }
  if (rhythm === 'asystole' || rhythm === 'post_shock') return .008 * Math.sin(seconds * 23) + .006 * Math.sin(seconds * 79)
  const p = .07 * gauss(beat, .16, .026)
  const q = -.12 * gauss(beat, .285, .010)
  const r = 1.08 * gauss(beat, .315, .007)
  const s = -.27 * gauss(beat, .345, .014)
  const t = .21 * gauss(beat, .59, .07)
  return p + q + r + s + t
}

function waveformSample(vitals: VitalState, seconds: number, kind: WaveKind) {
  const heartRate = vitals.heartRate ?? 0
  if (kind === 'ecg') {
    if (vitals.rhythm === 'vf' || vitals.rhythm === 'asystole' || vitals.rhythm === 'post_shock') return ecgAmplitude(0, vitals.rhythm, seconds)
    if (!heartRate || !vitals.pulsePresent) return 0
    return ecgAmplitude(cycle(seconds, heartRate), vitals.rhythm, seconds)
  }
  if (!heartRate || !vitals.pulsePresent) return 0
  const beat = cycle(seconds, heartRate)
  if (vitals.rhythm === 'vf' || vitals.rhythm === 'asystole' || vitals.rhythm === 'post_shock') return 0
  const pulse = Math.max(0, Math.sin(Math.PI * beat)) ** 1.8
  return pulse * (vitals.spo2 !== null && vitals.spo2 < 88 ? .55 : .88)
}

function WaveformCanvas({ vitals, connected, kind, color, label }: { vitals: VitalState; connected: boolean; kind: WaveKind; color: string; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const animation = { id: 0 }
    const sweep = { x: 0, previousY: 0, signalSeconds: 0, last: window.performance.now(), drawFrame: 0 }
    const dimensions = { width: 1, height: 1 }
    const sweepSeconds = kind === 'ecg' ? 4.8 : 4.2

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      dimensions.width = Math.max(1, rect.width)
      dimensions.height = Math.max(1, rect.height)
      canvas.width = Math.round(dimensions.width * pixelRatio)
      canvas.height = Math.round(dimensions.height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      context.clearRect(0, 0, dimensions.width, dimensions.height)
      sweep.x = 0
      sweep.previousY = dimensions.height / 2
    }

    const yFor = (time: number) => {
      const amplitude = connected ? waveformSample(vitals, time, kind) : 0
      return dimensions.height / 2 - amplitude * dimensions.height * .36
    }

    const drawSegment = (fromX: number, toX: number, fromY: number, toY: number) => {
      context.clearRect(Math.max(0, fromX - 1), 0, Math.max(3, toX - fromX + 3), dimensions.height)
      context.beginPath()
      context.moveTo(fromX, fromY)
      context.lineTo(toX, toY)
      context.strokeStyle = connected ? color : '#42536b'
      context.lineWidth = kind === 'ecg' ? 2 : 1.6
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.shadowBlur = connected ? 5 : 0
      context.shadowColor = connected ? color : 'transparent'
      context.stroke()
    }

    const tick = (now: number) => {
      const elapsed = Math.min(.05, (now - sweep.last) / 1000)
      sweep.last = now
      let remaining = Math.max(.18, (dimensions.width / sweepSeconds) * elapsed)
      while (remaining > 0) {
        const length = Math.min(remaining, dimensions.width - sweep.x)
        const nextX = sweep.x + length
        sweep.signalSeconds += length / dimensions.width * sweepSeconds
        const nextY = yFor(sweep.signalSeconds)
        drawSegment(sweep.x, nextX, sweep.previousY, nextY)
        sweep.x = nextX
        sweep.previousY = nextY
        remaining -= length
        if (sweep.x >= dimensions.width) {
          sweep.x = 0
          sweep.previousY = yFor(sweep.signalSeconds)
          context.clearRect(0, 0, 3, dimensions.height)
        }
      }
      canvas.dataset.frame = String(sweep.drawFrame++)
      animation.id = window.requestAnimationFrame(tick)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    animation.id = window.requestAnimationFrame(tick)
    return () => { window.cancelAnimationFrame(animation.id); observer.disconnect() }
  }, [color, connected, kind, vitals])

  return <canvas ref={canvasRef} className={`wave-canvas wave-${kind}`} role="img" aria-label={label} data-wave-mode="progressive-sweep" />
}

export function Monitor({ state, presentation = 'embedded', onExpand, onClose }: MonitorProps) {
  const connected = state.monitorConnected
  const rhythmColor = state.vitals.rhythm === 'vf' || state.vitals.rhythm === 'asystole' ? '#ff5975' : state.vitals.spo2 !== null && state.vitals.spo2 < 90 ? '#ffd06b' : '#44f0bd'
  const rhythmLabel: Record<Rhythm, string> = { sinus: 'sinusal', respiratory_stress: 'sinusal acelerado', blood_loss_stress: 'sinusal acelerado', vf: 'fibrilação ventricular', asystole: 'assistolia', post_shock: 'pós-evento' }
  const measuredRate = state.vitals.heartRate === null ? (state.vitals.rhythm === 'asystole' ? 0 : '—') : Math.round(state.vitals.heartRate)
  const interval = state.vitals.heartRate && state.vitals.heartRate > 0 ? `RR ${Math.round(60000 / state.vitals.heartRate)} ms` : 'SEM COMPLEXOS ORGANIZADOS'
  const expand = () => onExpand?.()
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => { if ((event.key === 'Enter' || event.key === ' ') && presentation === 'embedded') { event.preventDefault(); expand() } }

  return <section className={`monitor monitor-${presentation}`} aria-label="Monitor multiparamétrico dinâmico" role={presentation === 'embedded' ? 'button' : undefined} tabIndex={presentation === 'embedded' ? 0 : undefined} onClick={presentation === 'embedded' ? expand : undefined} onKeyDown={onKeyDown}>
    <header><span className="monitor-dot" style={{ background: rhythmColor }} /> MONITOR <small>{connected ? 'SENSOR ATIVO · MOTOR SIMULADO' : 'AGUARDANDO SENSOR'}</small>{presentation === 'embedded' && <button className="monitor-expand" aria-label="Ampliar monitor" onClick={(event) => { event.stopPropagation(); expand() }}>⛶</button>}{presentation === 'fullscreen' && <button className="monitor-close" aria-label="Fechar monitor" onClick={onClose}>Fechar ×</button>}</header>
    <div className="wave-label"><span>ECG</span><b>{measuredRate} BPM</b><em>{rhythmLabel[state.vitals.rhythm]} · {interval}</em></div>
    <div className="ecg">
      <svg className="ecg-grid" viewBox="0 0 200 78" preserveAspectRatio="none" aria-hidden="true"><path d="M0 15H200M0 39H200M0 63H200M25 0V78M50 0V78M75 0V78M100 0V78M125 0V78M150 0V78M175 0V78" fill="none" stroke="#244153" strokeWidth=".55" /></svg>
      <WaveformCanvas vitals={state.vitals} connected={connected} kind="ecg" color={rhythmColor} label="Eletrocardiograma simulado com varredura contínua, dependente da frequência e do ritmo configurados no cenário" />
    </div>
    <div className="pleth-wrap"><span>PLET</span><div className="pleth"><WaveformCanvas vitals={state.vitals} connected={connected} kind="pleth" color="#52ccff" label="Curva de oximetria simulada com varredura contínua" /></div></div>
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
