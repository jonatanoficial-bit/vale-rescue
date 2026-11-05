import type { GameState } from '../engine/types'

type MonitorProps = { state: GameState }

const format = (value: number | null, enabled: boolean, suffix = '') => enabled && value !== null ? `${Math.round(value)}${suffix}` : '—'

export function Monitor({ state }: MonitorProps) {
  const connected = state.monitorConnected
  const rhythmColor = state.vitals.rhythm === 'vf' ? '#ff5975' : state.vitals.spo2 !== null && state.vitals.spo2 < 90 ? '#ffd06b' : '#44f0bd'
  const wave = state.vitals.rhythm === 'vf'
    ? '4,49 14,39 22,60 34,22 44,58 56,27 68,52 78,37 91,62 105,24 117,54 130,42 143,61 155,28 168,50 180,44 196,58'
    : '4,51 20,51 26,49 31,52 37,50 44,50 52,51 58,44 62,8 66,70 70,49 76,51 95,51 102,47 108,51 117,51 125,49 132,50 141,50 148,43 152,8 156,70 160,50 168,51 188,51'
  return <section className="monitor" aria-label="Monitor multiparamétrico">
    <header><span className="monitor-dot" style={{ background: rhythmColor }} /> MONITOR <small>{connected ? 'SENSOR ATIVO' : 'AGUARDANDO SENSOR'}</small></header>
    <svg className="ecg" viewBox="0 0 200 78" role="img" aria-label="Curva do monitor simulada">
      <polyline points={connected ? wave : '4,39 196,39'} fill="none" stroke={connected ? rhythmColor : '#42536b'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="64" x2="200" y2="64" stroke="#1c3449" />
    </svg>
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
