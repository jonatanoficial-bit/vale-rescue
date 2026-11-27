import { useEffect, useState } from 'react'
import './App.css'
import { CASE_LIST, CASES, INTERVENTIONS, INVESTIGATIONS, MEDICATIONS } from './content/cases'
import { LEARNING_MODULES } from './content/learning'
import { CLINICAL_REFERENCE } from './content/protocols'
import { missionVariantById, missionVariantFor, type SceneTheme } from './content/missionVariants'
import { SERVICE_PROFILES, serviceProfileFor } from './content/serviceProfiles'
import { Monitor } from './components/Monitor'
import { PatientScene } from './components/PatientScene'
import { applyCareerModifiers, awardCareer, CAREER_LIVERIES, CAREER_MILESTONES, CAREER_OPERATIONS, CAREER_SEASONS, CAREER_UPGRADES, CAREER_VEHICLES, createCareerProfile, dispatchableCases, fictionalTransitSeconds, liveryFor, liveryIsUnlocked, milestoneProgress, nextRankFor, normalizeCareerProfile, purchaseUpgrade, rankFor, seasonFor, seasonProgress, selectCareerCase, specialOperationFor, vehicleFor, vehicleIsUnlocked } from './engine/career'
import type { CareerNarrativeEvent, CareerProfile, CareerReward, CareerSeason, LiveryId, UpgradeId, VehicleModelId } from './engine/career'
import { advanceTime, administerMedication, createCaseState, defibrillate, evaluateOutcome, investigate, intervene, registerCompression, setVentilation, startInfusion } from './engine/clinical'
import type { ActionResult, CaseId, Destination, GameState, LogEntry, ScoreReport, ServiceProfileId } from './engine/types'
import { clearCheckpoint, loadCareerProfile, loadCheckpoint, loadHistory, saveCareerProfile, saveCheckpoint, saveReport } from './services/persistence'

type Screen = 'home' | 'game' | 'report' | 'settings' | 'career' | 'learning'
type Panel = 'record' | 'research' | 'actions' | 'meds' | 'defib' | 'ventilation' | 'infusion' | 'log' | 'finish'
const destinationLabel: Record<Destination, string> = { discharge: 'Casa / Alta', hospital: 'Ambulância / Hospital', advanced_team: 'Equipe avançada' }
const asTime = (total: number) => `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(Math.floor(total % 60)).padStart(2, '0')}`
const homeAsset = (name: string) => `${import.meta.env.BASE_URL}assets/home/${name}`

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [mode, setMode] = useState<'treino' | 'carreira'>('treino')
  const [game, setGame] = useState<GameState | null>(null)
  const [panel, setPanel] = useState<Panel>('record')
  const [feedback, setFeedback] = useState<LogEntry | null>(null)
  const [report, setReport] = useState<ScoreReport | null>(null)
  const [pendingMedication, setPendingMedication] = useState<string | null>(null)
  const [volume, setVolume] = useState(35)
  const [dispatchVisible, setDispatchVisible] = useState(false)
  const [monitorExpanded, setMonitorExpanded] = useState(false)
  const [quickDestination, setQuickDestination] = useState<Destination>('hospital')
  const [career, setCareer] = useState<CareerProfile>(createCareerProfile)
  const [careerLoaded, setCareerLoaded] = useState(false)
  const [careerReward, setCareerReward] = useState<CareerReward | null>(null)
  const [narrativeEvent, setNarrativeEvent] = useState<CareerNarrativeEvent | null>(null)
  const [seasonClosing, setSeasonClosing] = useState<CareerSeason | null>(null)
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false)
  const activeCaseId = game?.caseId
  const activeSeed = game?.seed

  useEffect(() => {
    if (!game || game.status !== 'active' || game.speed === 0) return
    const timer = window.setInterval(() => setGame((current) => current ? advanceTime(current, current.speed) : current), 1000)
    return () => window.clearInterval(timer)
  }, [game])
  useEffect(() => { if (game?.status === 'active') void saveCheckpoint(game).catch(() => undefined) }, [game])
  useEffect(() => {
    let active = true
    void loadCareerProfile().then((saved) => { if (active) setCareer(normalizeCareerProfile(saved)); if (active) setCareerLoaded(true) }).catch(() => { if (active) setCareerLoaded(true) })
    return () => { active = false }
  }, [])
  useEffect(() => { if (careerLoaded) void saveCareerProfile(career).catch(() => undefined) }, [career, careerLoaded])
  useEffect(() => {
    if (!activeCaseId || activeSeed === undefined || screen !== 'game' || dispatchVisible) return
    return playSceneAmbience(missionVariantFor(activeCaseId, activeSeed).visualTheme, volume)
  }, [activeCaseId, activeSeed, screen, dispatchVisible, volume])

  const scenario = game ? CASES[game.caseId] : null
  const enterFullscreen = () => { if (typeof document !== 'undefined' && !document.fullscreenElement) void document.documentElement.requestFullscreen?.().catch(() => undefined) }
  const runResult = (result: ActionResult, cue: SoundCue = 'feedback') => { setGame(result.nextState); setFeedback(result.feedback); playActionCue(cue, result.feedback.tone, volume) }
  const start = (caseId: CaseId, seed?: number) => { const next = createCaseState(caseId, seed, career.serviceProfileId); setGame(next); setFeedback(next.actionLog.at(-1) ?? null); setReport(null); setCareerReward(null); setNarrativeEvent(null); setSeasonClosing(null); setPanel('record'); setQuickDestination('hospital'); setMonitorExpanded(false); setDispatchVisible(true); setScreen('game') }
  const startAssigned = () => { const available = CASE_LIST.filter((item) => (item.unlockXp ?? 0) <= career.xp && (!item.requiredCertification || career.certifications.includes(item.requiredCertification))); start(selectCareerCase(dispatchableCases(available, career), career).id) }
  const continueCareer = async () => { try { const saved = await loadCheckpoint(); if (saved && saved.status === 'active') { const resumed = { ...saved, serviceProfileId: saved.serviceProfileId ?? career.serviceProfileId, missionVariantId: saved.missionVariantId ?? missionVariantFor(saved.caseId, saved.seed).id }; setGame(resumed); setPanel('record'); setDispatchVisible(false); setScreen('game'); return } } catch { /* Private browser storage can fail. */ } setMode('carreira'); startAssigned() }
  const finish = async (destination: Destination, hypothesis: string, rationale: string) => { if (!game) return; const baseReport = evaluateOutcome(game, destination, hypothesis, rationale, fictionalTransitSeconds(destination, career)); const finalReport = applyCareerModifiers(baseReport, career); const operation = specialOperationFor(career, game.caseId, game.seed); const reward = awardCareer(career, finalReport, game.caseId, missionVariantById(game.missionVariantId).creditBonus, operation); const completed = { ...game, status: 'completed' as const }; setGame(completed); setCareer(reward.profile); setCareerReward(reward); setNarrativeEvent(reward.narrativeEvent ?? null); setSeasonClosing(reward.seasonClosing ?? null); setReport(finalReport); setScreen('report'); playActionCue('report', finalReport.score >= 600 ? 'success' : 'warning', volume); try { await saveReport(completed, finalReport); await clearCheckpoint() } catch { /* Gameplay works without persistence. */ } }
  const buyUpgrade = (upgradeId: UpgradeId) => { const next = purchaseUpgrade(career, upgradeId); if (!next) return false; setCareer(next); return true }
  const selectLivery = (liveryId: LiveryId) => { const livery = liveryFor(liveryId); if (!liveryIsUnlocked(career, livery)) return false; setCareer((current) => ({ ...current, liveryId })); return true }
  const selectVehicle = (vehicleModelId: VehicleModelId) => { const vehicle = vehicleFor(vehicleModelId); if (!vehicleIsUnlocked(career, vehicle)) return false; setCareer((current) => ({ ...current, vehicleModelId })); return true }
  const selectServiceProfile = (serviceProfileId: ServiceProfileId) => { const service = serviceProfileFor(serviceProfileId); if (career.xp < service.unlockXp) return false; setCareer((current) => ({ ...current, serviceProfileId })); return true }
  const certify = (moduleId: string) => setCareer((current) => current.certifications.includes(moduleId) ? current : { ...current, certifications: [...current.certifications, moduleId] })

  if (screen === 'home') return <Home profile={career} safetyAcknowledged={safetyAcknowledged} onAcknowledgeSafety={() => setSafetyAcknowledged(true)} onStart={() => { setMode('carreira'); startAssigned() }} onContinue={continueCareer} onSettings={() => setScreen('settings')} onCareer={() => setScreen('career')} />
  if (screen === 'settings') return <Settings volume={volume} onVolume={setVolume} onBack={() => setScreen('home')} />
  if (screen === 'career') return <CareerScreen profile={career} onBuy={buyUpgrade} onSelectLivery={selectLivery} onSelectVehicle={selectVehicle} onSelectService={selectServiceProfile} onLearning={() => setScreen('learning')} onBack={() => setScreen(game?.status === 'active' ? 'game' : 'home')} />
  if (screen === 'learning') return <LearningScreen profile={career} onCertify={certify} onBack={() => setScreen('career')} />
  if (screen === 'report' && report && game && scenario) return <Report state={game} scenario={scenario} report={report} reward={careerReward} narrativeEvent={narrativeEvent} seasonClosing={seasonClosing} onDismissNarrative={() => setNarrativeEvent(null)} onDismissSeason={() => setSeasonClosing(null)} onRetry={() => start(game.caseId, game.seed)} onNew={startAssigned} onHome={() => setScreen('home')} />
  if (!game || !scenario) return null
  const variant = missionVariantById(game.missionVariantId)
  const specialOperation = specialOperationFor(career, game.caseId, game.seed)
  const openFinish = (destination: Destination) => { setQuickDestination(destination); setPanel('finish') }
  return <main className={`game-shell livery-${career.liveryId} vehicle-${career.vehicleModelId}`}>
    <header className="game-header">
      <button className="brand-button" onClick={() => setScreen('home')} aria-label="Encerrar visualização e voltar ao início"><span>VALE</span> RESCUE <small>PLANTÃO / {mode.toUpperCase()}</small></button>
      <div className="case-chip"><b>{scenario.priority}</b><span>{scenario.id} · {variant.title}</span></div>
      <div className="clock-control"><button className="career-chip" onClick={() => setScreen('career')} aria-label="Abrir carreira"><span>{rankFor(career.xp).name}</span><b>◈ {career.credits}</b></button><span>⏱ {asTime(game.elapsedSeconds)}</span>{([0, 1, 2, 3] as const).map((speed) => <button key={speed} className={game.speed === speed ? 'active' : ''} onClick={() => setGame({ ...game, speed })}>{speed === 0 ? 'Ⅱ' : `${speed}×`}</button>)}<button className="fullscreen-toggle" onClick={enterFullscreen} aria-label="Ativar tela cheia">⛶</button></div>
    </header>
    <div className="game-grid">
      <PatientScene state={game}>
        <div className="scene-monitor-slot"><Monitor state={game} presentation="embedded" onExpand={() => setMonitorExpanded(true)} /></div>
        <div className="mission-flavor-chip"><span>{variant.dispatchTag}</span><b>{variant.location}</b><small>{variant.complication}</small></div>
        {specialOperation && <div className="operation-chip"><span>{specialOperation.icon} {specialOperation.dispatchTag}</span><b>{specialOperation.name}</b><small>Recompensa de carreira se a missão for bem avaliada.</small></div>}
        <nav className="scene-tool-dock" aria-label="Controles do atendimento">
          <Tool label="Prontuário" icon="▤" active={panel === 'record'} onClick={() => setPanel('record')} /><Tool label="Liberar vítima" icon="⌂" active={panel === 'finish' && quickDestination === 'discharge'} color="green" onClick={() => openFinish('discharge')} /><Tool label="Transportar" icon="➜" active={panel === 'finish' && quickDestination === 'hospital'} color="coral" onClick={() => openFinish('hospital')} />
          <Tool label="Avaliar" icon="⌕" active={panel === 'research'} color="mint" onClick={() => setPanel('research')} /><Tool label="Procedimentos" icon="✦" active={panel === 'actions'} color="coral" onClick={() => setPanel('actions')} /><Tool label="Medicamentos" icon="◈" active={panel === 'meds'} color="blue" onClick={() => setPanel('meds')} />
          <Tool label={`Compressão · ${game.compressions}`} icon="↡" color="red" onClick={() => runResult(registerCompression(game), 'compression')} /><Tool label="Desfibrilador" icon="ϟ" active={panel === 'defib'} color="amber" onClick={() => setPanel('defib')} /><Tool label="Ventilação" icon="≋" active={panel === 'ventilation'} color="cyan" onClick={() => setPanel('ventilation')} /><Tool label="Infusão" icon="⌇" active={panel === 'infusion'} color="purple" onClick={() => setPanel('infusion')} /><Tool label="Registro" icon="☷" active={panel === 'log'} onClick={() => setPanel('log')} />
        </nav>
      </PatientScene>
      <section className={`command-panel panel-${panel}`} aria-live="polite">
        <PanelTitle panel={panel} scenario={scenario.title} />
        {panel === 'record' && <RecordPanel state={game} />}
        {panel === 'research' && <ResearchPanel state={game} onAction={(id) => runResult(investigate(game, id), 'scan')} />}
        {panel === 'actions' && <ActionsPanel state={game} onAction={(id) => runResult(intervene(game, id), 'tool')} />}
        {panel === 'meds' && <MedicationPanel state={game} pending={pendingMedication} onChoose={setPendingMedication} onConfirm={(id) => { setPendingMedication(null); runResult(administerMedication(game, id), 'medication') }} />}
        {panel === 'defib' && <DefibPanel state={game} onAction={(step) => runResult(defibrillate(game, step), 'defib')} />}
        {panel === 'ventilation' && <VentilationPanel state={game} onAction={(step) => runResult(setVentilation(game, step), 'ventilation')} />}
        {panel === 'infusion' && <InfusionPanel state={game} onAction={() => runResult(startInfusion(game), 'infusion')} />}
        {panel === 'log' && <LogPanel state={game} />}
        {panel === 'finish' && <FinishPanel key={quickDestination} initialDestination={quickDestination} transitForDestination={(destination) => fictionalTransitSeconds(destination, career)} onFinish={finish} />}
        {feedback && <div className={`feedback feedback-${feedback.tone}`}><b>{feedback.code.replaceAll('_', ' ')}</b><span>{feedback.outcome}</span></div>}
      </section>
    </div>
    <footer className="medical-note">REFERÊNCIA-BASE: AHA/ILCOR 2025 · SIMULAÇÃO FICCIONAL · NÃO É ORIENTAÇÃO MÉDICA · regras específicas dependem de validação profissional.</footer>
    {monitorExpanded && <div className="monitor-overlay" role="dialog" aria-modal="true" aria-label="Monitor ampliado"><Monitor state={game} presentation="fullscreen" onClose={() => setMonitorExpanded(false)} /></div>}
    {dispatchVisible && <DispatchOverlay scenario={scenario} variant={variant} operation={specialOperation} career={career} serviceName={serviceProfileFor(game.serviceProfileId).name} onEnter={() => { enterFullscreen(); setDispatchVisible(false) }} />}
  </main>
}

function Home({ profile, safetyAcknowledged, onAcknowledgeSafety, onStart, onContinue, onSettings, onCareer }: { profile: CareerProfile; safetyAcknowledged: boolean; onAcknowledgeSafety: () => void; onStart: () => void; onContinue: () => void; onSettings: () => void; onCareer: () => void }) {
  const rank = rankFor(profile.xp)
  const next = nextRankFor(profile.xp)
  const season = seasonFor(profile.missionsCompleted)
  const hasCareer = profile.missionsCompleted > 0
  const activeMilestone = CAREER_MILESTONES.find((milestone) => !profile.milestones.includes(milestone.id))
  return <main className={`home-screen livery-${profile.liveryId} vehicle-${profile.vehicleModelId}`}>
    <img className="home-cinematic" src={homeAsset('campaign-nightshift-v1.png')} alt="Ambulância ficcional em uma noite chuvosa" />
    <div className="home-ambient" />
    <header className="home-header"><div className="home-brand"><span>VALE</span> RESCUE <small>UNIDADE 07 · TURNO NOTURNO</small></div><button className="home-career-button" onClick={onCareer}><span>CARREIRA</span><b>{rank.name}</b><small>◈ {profile.credits} créditos</small></button></header>
    <section className="home-copy"><p className="eyebrow">CENTRAL ONLINE · MISSÕES FICCIONAIS</p><h1><span>VALE</span><em>RESCUE</em></h1><p className="home-subtitle">{hasCareer ? 'A UNIDADE 07 ESTÁ EM ROTA. CONTINUE A CAMPANHA.' : 'ENTRE NA AMBULÂNCIA. RESPONDA AO CHAMADO.'}</p><p className="home-text">A Central atribui a ocorrência. Analise o cenário, acompanhe o monitor simulado e registre o desfecho da missão.</p><div className="home-actions"><button className="start-mission" onClick={onStart}><span>▶</span><div><b>{hasCareer ? 'CONTINUAR CAMPANHA' : 'INICIAR PLANTÃO'}</b><small>{hasCareer ? `${profile.missionsCompleted} missões arquivadas · nova ocorrência atribuída` : 'Ocorrência atribuída pela Central'}</small></div><i>●</i></button><button className="home-action-card" onClick={onContinue}><span>↻</span><div><b>RETOMAR MISSÃO</b><small>Voltar ao atendimento salvo</small></div></button><button className="home-action-card" onClick={onCareer}><span>◆</span><div><b>CARREIRA E GARAGEM</b><small>XP, promoções e melhorias</small></div></button><button className="home-action-card settings" onClick={onSettings}><span>⚙</span><div><b>AJUSTES</b><small>Som e preferências</small></div></button></div><p className="home-disclaimer">Jogo de simulação ficcional. Não substitui protocolos, orientação médica ou treinamento profissional.</p></section>
    <aside className="home-status"><span>{hasCareer ? 'CAMPANHA EM ANDAMENTO' : 'PROGRESSO DE CARREIRA'}</span><strong>{profile.xp} XP</strong><div><i style={{ width: `${next ? Math.min(100, (profile.xp / next.minXp) * 100) : 100}%` }} /></div><small>{next ? `${next.minXp - profile.xp} XP para ${next.name}` : 'Patente máxima alcançada'}</small>{hasCareer && <div className="home-campaign-route" aria-label="Rota ativa da campanha"><span>ROTA ATIVA</span><b>MISSÃO {String(profile.missionsCompleted + 1).padStart(2, '0')} · {season.icon} {season.name}</b><small>{activeMilestone ? `${activeMilestone.icon} ${activeMilestone.name}: ${Math.min(activeMilestone.target, milestoneProgress(profile, activeMilestone))}/${activeMilestone.target}` : 'Todos os marcos arquivados'}</small></div>}<b>▦ {CASE_LIST.length} casos-base · 18 contextos</b><b>◉ {season.code} · {season.name}</b><b>⚡ {profile.missionStreak} plantão(ões) em sequência · recorde {profile.bestStreak}</b><b>{profile.missionsCompleted} missões concluídas</b></aside>
    <div className="home-scan" aria-hidden="true"><span /><span /><span /></div>
    {!safetyAcknowledged && <SafetyNotice onAcknowledge={onAcknowledgeSafety} />}
  </main>
}
function SafetyNotice({ onAcknowledge }: { onAcknowledge: () => void }) { return <section className="safety-overlay" role="dialog" aria-modal="true" aria-labelledby="safety-title"><div className="safety-card"><p className="eyebrow">AVISO OBRIGATÓRIO · SIMULAÇÃO</p><h2 id="safety-title">Não use este jogo em uma emergência real.</h2><p>Vale Rescue é uma experiência ficcional de treinamento. Não substitui formação profissional, supervisão, protocolos locais, direção médica ou avaliação de uma pessoa real.</p><p>Nomes de medicamentos, equipamentos e protocolos aparecem somente como elementos de simulação: não há doses, quantidades, instruções operacionais ou autorização para uso real.</p><p className="safety-emergency">Em uma emergência real, acione o serviço de urgência local e siga profissionais habilitados.</p><button className="primary" onClick={onAcknowledge}>Entendi — entrar na Central</button><small>Escopo profissional, equipe, recursos e medicamentos variam conforme serviço, jurisdição e autorização clínica.</small></div></section> }
function CareerScreen({ profile, onBuy, onSelectLivery, onSelectVehicle, onSelectService, onLearning, onBack }: { profile: CareerProfile; onBuy: (id: UpgradeId) => boolean; onSelectLivery: (id: LiveryId) => boolean; onSelectVehicle: (id: VehicleModelId) => boolean; onSelectService: (id: ServiceProfileId) => boolean; onLearning: () => void; onBack: () => void }) {
  const rank = rankFor(profile.xp)
  const next = nextRankFor(profile.xp)
  const [notice, setNotice] = useState('')
  const [history, setHistory] = useState<Array<{ state: GameState; report: ScoreReport }>>([])
  useEffect(() => { let mounted = true; void loadHistory().then((records) => { if (mounted) setHistory(records ?? []) }).catch(() => undefined); return () => { mounted = false } }, [])
  return <main className="career-screen">
    <header className="career-header"><button onClick={onBack}>Voltar ao jogo</button><div><p className="eyebrow">CENTRAL · CARREIRA</p><h1>{rank.name}</h1></div><div className="career-wallet"><span>CRÉDITOS</span><b>◈ {profile.credits}</b></div></header>
    <section className="career-overview"><div><span>PATENTE ATUAL</span><strong>{rank.name}</strong><small>{profile.xp} XP acumulado · {profile.missionsCompleted} missões</small></div><div className="career-progress"><span>{next ? `Rumo a ${next.name}` : 'Patente máxima'}</span><i><em style={{ width: `${next ? Math.min(100, ((profile.xp - rank.minXp) / (next.minXp - rank.minXp)) * 100) : 100}%` }} /></i><small>{next ? `${Math.max(0, next.minXp - profile.xp)} XP restantes` : 'Toda a progressão concluída'}</small></div></section>
    <CampaignBoard profile={profile} />
    <SeasonBoard profile={profile} />
    <LiveryBay profile={profile} onSelect={(id) => setNotice(onSelectLivery(id) ? 'Identidade visual aplicada à Unidade 07.' : 'Este acabamento ainda requer um marco de carreira.')} />
    <VehicleBay profile={profile} onSelect={(id) => setNotice(onSelectVehicle(id) ? 'Modelo visual aplicado à Unidade 07.' : 'Este modelo ainda requer progressão de carreira.')} />
    <CareerHistory profile={profile} history={history} />
    <section className="academy-launch"><div><span>PROTOCOLOS DE MISSÃO</span><b>Valide a leitura do cenário e desbloqueie novos tipos de ocorrência.</b><small>{profile.certifications.length} validação(ões) concluída(s)</small></div><button onClick={onLearning}>Abrir protocolos</button></section>
    <ServiceProfileBay profile={profile} onSelect={(id) => setNotice(onSelectService(id) ? 'Contrato de unidade preparado para a próxima missão.' : 'Este contrato ainda requer mais XP.')} />
    <section className="upgrade-section"><div className="upgrade-heading"><div><p className="eyebrow">MELHORIAS DE JOGO</p><h2>Garagem da Unidade</h2></div><small>Alteram recompensa, relatório e deslocamento ficcional — nunca orientam conduta real.</small></div><div className="upgrade-grid">{CAREER_UPGRADES.map((upgrade) => { const owned = profile.upgrades.includes(upgrade.id); const available = profile.credits >= upgrade.cost; return <article className={`upgrade-card ${owned ? 'owned' : ''}`} key={upgrade.id}><span className="upgrade-icon">{upgrade.icon}</span><div><b>{upgrade.name}</b><p>{upgrade.description}</p></div><footer>{owned ? <strong>INSTALADO</strong> : <button disabled={!available} onClick={() => setNotice(onBuy(upgrade.id) ? `${upgrade.name} instalado.` : 'Créditos insuficientes para esta melhoria.')}>◈ {upgrade.cost} · {available ? 'Instalar' : 'Bloqueado'}</button>}</footer></article> })}</div>{notice && <p className="career-notice">{notice}</p>}</section>
    <p className="career-disclaimer">Progressão local do jogo, salva neste navegador. Sem compras reais, publicidade ou itens aleatórios.</p>
  </main>
}
function CampaignBoard({ profile }: { profile: CareerProfile }) {
  const complete = profile.milestones.length
  const active = CAREER_MILESTONES.find((milestone) => !profile.milestones.includes(milestone.id))
  const season = seasonFor(profile.missionsCompleted)
  return <section className="campaign-board"><div className="campaign-heading"><div><p className="eyebrow">{season.code.toUpperCase()} · {season.name.toUpperCase()}</p><h2>Marcos da Central</h2></div><span>{complete}/{CAREER_MILESTONES.length} concluídos</span></div><div className="campaign-grid">{CAREER_MILESTONES.map((milestone) => { const done = profile.milestones.includes(milestone.id); const progress = Math.min(milestone.target, milestoneProgress(profile, milestone)); return <article className={`campaign-card ${done ? 'done' : ''} ${active?.id === milestone.id ? 'active' : ''}`} key={milestone.id}><span className="campaign-icon">{milestone.icon}</span><div><b>{milestone.name}</b><p>{milestone.description}</p><small>{done ? `RECOMPENSA RECEBIDA · ◈ ${milestone.creditReward}` : `${progress}/${milestone.target} · recompensa ◈ ${milestone.creditReward}`}</small></div><i><em style={{ width: `${(progress / milestone.target) * 100}%` }} /></i></article> })}</div><p className="campaign-boundary">Marcos são objetivos de progressão do jogo. Eles não avaliam nem orientam atendimento de pessoas reais.</p></section>
}

function SeasonBoard({ profile }: { profile: CareerProfile }) {
  const current = seasonFor(profile.missionsCompleted)
  const nextOperation = profile.completedOperations.length < CAREER_OPERATIONS.length
  return <section className="season-board"><div className="season-heading"><div><p className="eyebrow">CALENDÁRIO DE CARREIRA</p><h2>Temporadas da Central</h2></div><small>As operações especiais são atribuídas pela Central durante plantões de carreira; elas nunca revelam a solução do cenário.</small></div><div className="season-grid">{CAREER_SEASONS.map((season) => { const active = current.id === season.id; const completed = profile.missionsCompleted > (season.endMission ?? Number.POSITIVE_INFINITY); const progress = seasonProgress(profile, season); const operations = CAREER_OPERATIONS.filter((operation) => operation.seasonId === season.id); const completedOperations = operations.filter((operation) => profile.completedOperations.includes(operation.id)).length; return <article className={`season-card ${active ? 'active' : ''} ${completed ? 'done' : ''}`} key={season.id}><span>{season.icon}</span><div><small>{season.code}</small><b>{season.name}</b><p>{season.description}</p><em>{active ? `${Math.min(progress.completed, progress.target)}/${progress.target} missões nesta etapa` : completed ? 'etapa concluída' : `abre na missão ${season.startMission + 1}`}</em></div><i><strong>{completedOperations}/{operations.length} operações</strong><small>{active && nextOperation ? 'chamada especial pode ser atribuída' : 'arquivo de temporada'}</small></i></article> })}</div><p className="season-boundary">Recompensas de operações são créditos de progressão fictícios. Não há compras reais, itens aleatórios pagos ou impacto em recursos do mundo real.</p></section>
}
function LiveryBay({ profile, onSelect }: { profile: CareerProfile; onSelect: (id: LiveryId) => void }) {
  return <section className="livery-bay"><div className="livery-heading"><div><p className="eyebrow">IDENTIDADE DA UNIDADE</p><h2>Acabamentos da garagem</h2></div><small>Escolhas puramente cosméticas; não alteram recursos, casos, tempo ou pontuação.</small></div><div className="livery-grid">{CAREER_LIVERIES.map((livery) => { const selected = profile.liveryId === livery.id; const unlocked = liveryIsUnlocked(profile, livery); const requirement = livery.requiredMilestone ? CAREER_MILESTONES.find((milestone) => milestone.id === livery.requiredMilestone) : undefined; return <button key={livery.id} className={`livery-card livery-${livery.id} ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}`} disabled={!unlocked} onClick={() => onSelect(livery.id)}><span className="livery-icon">{livery.icon}</span><div><b>{livery.name}</b><p>{livery.description}</p><small>{unlocked ? livery.tag : `Requer: ${requirement?.name ?? livery.tag}`}</small></div><em>{selected ? 'em uso' : unlocked ? 'aplicar' : 'bloqueado'}</em></button> })}</div><p className="livery-boundary">A identidade é ficcional e visual. Ela não representa configuração ou autorização de ambulância real.</p></section>
}

function VehicleBay({ profile, onSelect }: { profile: CareerProfile; onSelect: (id: VehicleModelId) => void }) {
  return <section className="vehicle-bay"><div className="vehicle-heading"><div><p className="eyebrow">HANGAR VISUAL</p><h2>Modelos da Unidade</h2></div><small>São variações de cabine e HUD para o jogo. Não representam veículo, equipamento ou credencial reais.</small></div><div className="vehicle-grid">{CAREER_VEHICLES.map((vehicle) => { const selected = profile.vehicleModelId === vehicle.id; const unlocked = vehicleIsUnlocked(profile, vehicle); const requirement = vehicle.requiredMilestone ? CAREER_MILESTONES.find((milestone) => milestone.id === vehicle.requiredMilestone)?.name : vehicle.requiredXp ? `${vehicle.requiredXp} XP` : vehicle.requiredOperations ? `${vehicle.requiredOperations} operações especiais` : vehicle.tag; return <button key={vehicle.id} className={`vehicle-card vehicle-${vehicle.id} ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}`} disabled={!unlocked} onClick={() => onSelect(vehicle.id)}><span className="vehicle-icon">{vehicle.icon}</span><div><b>{vehicle.name}</b><p>{vehicle.description}</p><small>{unlocked ? vehicle.tag : `Requer: ${requirement}`}</small></div><em>{selected ? 'em uso' : unlocked ? 'aplicar' : 'bloqueado'}</em></button> })}</div><p className="vehicle-boundary">Modelos são uma escolha visual local, sem impacto em pontuação, velocidade, recursos ou conduta real.</p></section>
}
function CareerHistory({ profile, history }: { profile: CareerProfile; history: Array<{ state: GameState; report: ScoreReport }> }) {
  const average = history.length ? Math.round(history.reduce((total, item) => total + item.report.score, 0) / history.length) : 0
  const best = history.reduce((highest, item) => Math.max(highest, item.report.score), 0)
  return <section className="career-history"><div className="history-heading"><div><p className="eyebrow">ARQUIVO LOCAL</p><h2>Histórico de plantões</h2></div><span>{history.length ? `${history.length} relatório(s) salvos` : 'Aguardando primeiro relatório'}</span></div>{history.length ? <><div className="history-stats"><div><span>MÉDIA</span><b>{average}</b><small>/ 1000</small></div><div><span>MELHOR RESULTADO</span><b>{best}</b><small>/ 1000</small></div><div><span>SEQUÊNCIA ATUAL</span><b>{profile.missionStreak}</b><small>missões bem avaliadas</small></div></div><div className="history-list">{history.slice(0, 4).map((item, index) => <div key={`${item.state.caseId}-${index}`}><span>{item.state.caseId}</span><b>{CASES[item.state.caseId].shortTitle}</b><em>{item.report.score}/1000</em></div>)}</div></> : <p className="history-empty">Conclua uma missão para iniciar o arquivo local da Central.</p>}<small className="history-boundary">Resultados são dados de jogo salvos neste navegador; não são prontuário ou registro clínico real.</small></section>
}
function ServiceProfileBay({ profile, onSelect }: { profile: CareerProfile; onSelect: (id: ServiceProfileId) => void }) {
  return <section className="service-bay"><div className="service-heading"><div><p className="eyebrow">CONTRATO DA UNIDADE</p><h2>Equipe e carga da próxima missão</h2></div><small>Itens mostrados aqui existem apenas no universo do jogo. Regras reais variam por serviço, jurisdição e direção médica.</small></div><div className="service-grid">{SERVICE_PROFILES.map((service) => { const selected = profile.serviceProfileId === service.id; const unlocked = profile.xp >= service.unlockXp; return <button key={service.id} className={`service-card ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}`} disabled={!unlocked} onClick={() => onSelect(service.id)}><span className="service-icon">{service.icon}</span><div><b>{service.name}</b><p>{service.subtitle}</p><small>{unlocked ? `${service.interventions.length} recursos · ${service.medications.length} itens no catálogo virtual` : `Requer ${service.unlockXp} XP`}</small></div><em>{selected ? 'em preparo' : unlocked ? 'selecionar' : 'bloqueado'}</em></button> })}</div><p className="service-boundary">O contrato altera somente os recursos ficcionais carregados no jogo; não ensina, autoriza nem substitui conduta em pessoas reais.</p></section>
}
function LearningScreen({ profile, onCertify, onBack }: { profile: CareerProfile; onCertify: (id: string) => void; onBack: () => void }) {
  const [moduleId, setModuleId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const module = LEARNING_MODULES.find((item) => item.id === moduleId)
  const certified = module ? profile.certifications.includes(module.id) : false
  const score = module ? module.questions.filter((question, index) => answers[index] === question.correct).length : 0
  if (module) return <main className="learning-screen"><header className="learning-header"><button onClick={() => { setModuleId(null); setAnswers({}); setSubmitted(false) }}>Protocolos</button><div><p className="eyebrow">AHA/ILCOR 2025 · PROTOCOLO DE MISSÃO</p><h1>{module.title}</h1><p>{module.subtitle}</p></div></header><section className="learning-copy"><p>{CLINICAL_REFERENCE.detail}</p>{module.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<a href={CLINICAL_REFERENCE.ahaUrl} target="_blank" rel="noreferrer">{CLINICAL_REFERENCE.label} ↗</a><a href={module.sourceUrl} target="_blank" rel="noreferrer">Referência complementar do cenário: {module.sourceLabel}</a></section><form className="quiz-card" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); if (score >= 4) onCertify(module.id) }}><header><div><span>VALIDAÇÃO DE MISSÃO</span><b>5 leituras · acesso: 4 acertos</b></div>{submitted && <strong className={score >= 4 ? 'pass' : 'fail'}>{score}/5 {score >= 4 ? '· ACESSO LIBERADO' : '· REVISE A REFERÊNCIA'}</strong>}</header>{module.questions.map((question, index) => <fieldset key={question.prompt}><legend>{index + 1}. {question.prompt}</legend>{question.choices.map((choice, choiceIndex) => <label key={choice}><input type="radio" name={`q${index}`} checked={answers[index] === choiceIndex} onChange={() => setAnswers({ ...answers, [index]: choiceIndex })} />{choice}</label>)}</fieldset>)}<button className="primary" type="submit">Validar leitura</button>{certified && <p className="quiz-certified">Validação concluída. Nova ocorrência disponível no próximo plantão.</p>}</form><p className="learning-disclaimer">AHA/ILCOR é a referência-base de RCP e suporte cardiorrespiratório do jogo. Não é autorização, prescrição, treinamento profissional ou decisão para uma pessoa real.</p></main>
  return <main className="learning-screen"><header className="learning-header"><button onClick={onBack}>Carreira</button><div><p className="eyebrow">PROTOCOLOS DA CENTRAL</p><h1>Trilhas de missão</h1><p>Consulte a referência, valide a leitura e amplie os cenários do jogo.</p></div></header><section className="learning-list">{LEARNING_MODULES.map((item) => { const unlocked = profile.xp >= item.requiredXp; const certified = profile.certifications.includes(item.id); return <article className={unlocked ? '' : 'locked'} key={item.id}><div><span>{certified ? '✓ VALIDADO' : unlocked ? 'DISPONÍVEL' : `REQUER ${item.requiredXp} XP`}</span><h2>{item.title}</h2><p>{item.subtitle}</p><small>Libera: {item.unlocks}</small></div><button disabled={!unlocked} onClick={() => setModuleId(item.id)}>{certified ? 'Revisar' : unlocked ? 'Consultar e validar' : 'Bloqueado'}</button></article>})}</section></main>
}
function Settings({ volume, onVolume, onBack }: { volume: number; onVolume: (value: number) => void; onBack: () => void }) { return <main className="settings-screen"><section className="settings-card"><p className="eyebrow">VALE RESCUE</p><h1>Configurações</h1><label>Áudio ambiente e feedback <output>{volume}%</output><input aria-label="Áudio ambiente e feedback" type="range" min="0" max="100" value={volume} onChange={(event) => onVolume(Number(event.target.value))} /></label><div className="setting-row"><span>Som de cena</span><b>{volume ? 'Ambiente dinâmico' : 'Desligado'}</b></div><div className="setting-row"><span>Modo visual</span><b>2,5D original</b></div><div className="setting-row"><span>Salvamento</span><b>IndexedDB local</b></div><button className="primary" onClick={onBack}>Voltar</button></section></main> }
function DispatchOverlay({ scenario, variant, operation, career, serviceName, onEnter }: { scenario: (typeof CASES)[CaseId]; variant: ReturnType<typeof missionVariantById>; operation: ReturnType<typeof specialOperationFor>; career: CareerProfile; serviceName: string; onEnter: () => void }) { const portrait = scenario.patient.bodyPreset === 'marina' ? 'briefing-female-v1.png' : 'briefing-male-v1.png'; const season = seasonFor(career.missionsCompleted); const objective = CAREER_MILESTONES.find((milestone) => !career.milestones.includes(milestone.id)); return <section className="dispatch-overlay" role="dialog" aria-modal="true" aria-label="Ficha inicial da ocorrência"><div className="dispatch-card"><div className="dispatch-signal"><i /><i /><i /></div><p className="eyebrow">CENTRAL DE REGULAÇÃO · FICHA INICIAL</p><div className="dispatch-id"><span>{scenario.priority}</span><b>{scenario.id} · {variant.title.toUpperCase()}</b></div><div className="dispatch-variant"><span>{variant.dispatchTag}</span><b>{variant.location}</b><small>{variant.atmosphere} · {variant.complication}</small><em>+{variant.creditBonus} créditos de contexto</em></div><div className="dispatch-campaign" aria-label="Registro de campanha"><div><span>ROTA DE CARREIRA</span><b>MISSÃO {String(career.missionsCompleted + 1).padStart(2, '0')} · {season.icon} {season.name}</b></div><small>{rankFor(career.xp).name} · {objective ? `${objective.icon} meta: ${objective.name} ${Math.min(objective.target, milestoneProgress(career, objective))}/${objective.target}` : 'marcos de carreira concluídos'}</small></div>{operation && <div className="dispatch-operation"><span>{operation.icon} {operation.dispatchTag}</span><b>{operation.name}</b><p>{operation.description}</p><small>Conclusão bem avaliada: ◈ {operation.creditReward} de carreira.</small></div>}<div className="dispatch-profile"><img src={`${import.meta.env.BASE_URL}assets/patients/${portrait}`} alt={`Retrato simulado de ${scenario.patient.name}`} /><div><p>VÍTIMA SIMULADA</p><h2>{scenario.patient.name}</h2><span>{scenario.patient.age} anos · {scenario.patient.gender}</span><strong>{scenario.title}</strong></div></div><p className="dispatch-copy">{scenario.dispatch}</p><div className="dispatch-history"><span>HISTÓRICO RELATADO</span><p>{scenario.history}</p><span>ACOMPANHANTE</span><p>{scenario.witness}</p></div><div className="dispatch-meta"><span>UNIDADE 07 · {serviceName.toUpperCase()}</span><span>MONITOR PRÉ-CONECTADO · CONFIGURAÇÃO VARIÁVEL</span></div><button className="primary" onClick={onEnter}>Iniciar atendimento <span>●</span></button><small>Foto, contexto e histórico são ficcionais. Ações incompatíveis mudam o estado e a pontuação do jogo.</small></div></section> }
function PanelTitle({ panel, scenario }: { panel: Panel; scenario: string }) { const names: Record<Panel, string> = { record: 'Prontuário', research: 'Avaliação', actions: 'Procedimentos', meds: 'Medicamentos', defib: 'Desfibrilador', ventilation: 'Ventilação', infusion: 'Infusão', log: 'Diário da ocorrência', finish: 'Destino e relatório' }; return <div className="panel-title"><div><p>{scenario}</p><h2>{names[panel]}</h2></div><span className="panel-status">LOCAL</span></div> }
function RecordPanel({ state }: { state: GameState }) {
  const c = CASES[state.caseId]
  const status = state.vitals.consciousness === 'unresponsive'
    ? 'Não responsivo — sem fala atribuída.'
    : 'Paciente pode responder conforme o roteiro.'

  return <div className="panel-content record" tabIndex={0} aria-label={`Prontuário ficcional de ${c.patient.name}`}>
    <header className="record-summary">
      <span className="record-avatar" aria-hidden="true">{c.patient.bodyPreset === 'marina' ? 'M' : 'C'}</span>
      <div><p>VÍTIMA SIMULADA</p><b>{c.patient.name}</b><small>{c.patient.age} anos · {c.patient.gender}</small></div>
      <em>LOCAL</em>
    </header>
    <div className="record-info-grid">
      <Info label="Central" value={c.dispatch} />
      <Info label="Testemunha" value={c.witness} />
      <Info label="Histórico" value={c.history} />
      <Info label="Status" value={status} />
    </div>
    <p className="record-boundary">Registro ficcional da missão. Ele não é prontuário real nem orientação para atendimento.</p>
  </div>
}
function ResearchPanel({ state, onAction }: { state: GameState; onAction: (id: string) => void }) { return <div className="panel-content"><p className="helper">Registre as avaliações que quiser. A Central não revela uma sequência durante a missão.</p>{INVESTIGATIONS.map((item) => <button className={`list-button ${state.knownInvestigations.includes(item.id) ? 'done' : ''}`} key={item.id} onClick={() => onAction(item.id)}><span>{item.icon}</span><div><b>{item.label}</b><small>{state.knownInvestigations.includes(item.id) ? CASES[state.caseId].findings[item.id] : 'Aferir e registrar no diário'}</small></div><em>{state.knownInvestigations.includes(item.id) ? 'feito' : 'aferir'}</em></button>)}</div> }
function ActionsPanel({ state, onAction }: { state: GameState; onAction: (id: string) => void }) { const service = serviceProfileFor(state.serviceProfileId); return <div className="panel-content"><p className="helper">Inventário da unidade: {service.name}. A decisão é sua; o jogo registra consequências e pontuação.</p>{INTERVENTIONS.map((item) => { const stocked = service.interventions.includes(item.id); const done = state.completedInterventions.includes(item.id); return <button className={`list-button ${done ? 'done' : ''} ${!stocked ? 'locked' : ''}`} key={item.id} onClick={() => onAction(item.id)}><span>✦</span><div><b>{item.label}</b><small>{done ? 'Registro salvo no diário.' : stocked ? 'Recurso embarcado nesta unidade.' : 'Recurso fora da carga desta unidade.'}</small></div><em>{done ? 'feito' : stocked ? 'usar' : 'fora da carga'}</em></button> })}</div> }
function MedicationPanel({ state, pending, onChoose, onConfirm }: { state: GameState; pending: string | null; onChoose: (id: string | null) => void; onConfirm: (id: string) => void }) { const service = serviceProfileFor(state.serviceProfileId); const selected = MEDICATIONS.find((item) => item.id === pending); return <div className="panel-content"><p className="helper">Catálogo ficcional com nomes reais. Não há doses, prescrição, indicação em tela ou previsão para pessoa real.</p>{selected && <div className="confirmation"><b>Registrar {selected.label} nesta ocorrência?</b><span>A entrada será avaliada apenas pelo motor do paciente virtual. Ela pode registrar efeito, risco ou nenhuma mudança, conforme o estado fictício.</span><div><button onClick={() => onChoose(null)}>Cancelar</button><button className="primary" onClick={() => onConfirm(selected.id)}>Registrar no diário</button></div></div>}{MEDICATIONS.map((item) => { const stocked = service.medications.includes(item.id); const done = state.medicationsGiven.includes(item.id); return <button className={`list-button ${done ? 'done' : ''} ${!stocked ? 'locked' : ''}`} key={item.id} onClick={() => onChoose(item.id)}><span>◈</span><div><b>{item.label}</b><small>{item.category} · {stocked ? 'no catálogo virtual da unidade' : 'fora da carga da unidade'}</small></div><em>{done ? 'registrado' : stocked ? 'registrar' : 'fora da carga'}</em></button> })}</div> }
function DefibPanel({ state, onAction }: { state: GameState; onAction: (step: 'pads' | 'charge' | 'clear' | 'shock') => void }) { const d = state.defibrillator; return <div className="panel-content"><p className="helper">Interface de treino ficcional. Observe o monitor e assuma as consequências da decisão registrada.</p><div className="step-grid"><Step label="1 · Eletrodos" done={d.pads} onClick={() => onAction('pads')} /><Step label="2 · Carregar" done={d.charged} onClick={() => onAction('charge')} /><Step label="3 · Afastar" done={d.cleared} onClick={() => onAction('clear')} /><Step label="4 · Choque" done={d.shocked} danger onClick={() => onAction('shock')} /></div><Info label="Estado da interface" value={d.shocked ? 'Evento registrado. Continue a acompanhar o cenário.' : 'Nenhum evento de choque registrado.'} /></div> }
function VentilationPanel({ state, onAction }: { state: GameState; onAction: (step: 'connect' | 'start' | 'stop') => void }) { return <div className="panel-content"><p className="helper">Recurso condicionado a caso, equipe e equipamento simulados.</p><div className="step-grid"><Step label="Conectar" done={state.ventilation !== 'off'} onClick={() => onAction('connect')} /><Step label="Iniciar" done={state.ventilation === 'running'} onClick={() => onAction('start')} /><Step label="Parar" onClick={() => onAction('stop')} /></div><Info label="Estado" value={state.ventilation === 'running' ? 'Ventilação fictícia em andamento.' : 'Nenhuma ventilação ativa.'} /></div> }
function InfusionPanel({ state, onAction }: { state: GameState; onAction: () => void }) { return <div className="panel-content"><p className="helper">Recurso de interface ficcional; a disponibilidade é julgada pelo motor da ocorrência.</p><button className={`large-action ${state.infusionActive ? 'done' : ''}`} onClick={onAction}>{state.infusionActive ? 'Infusão em curso no cenário' : 'Registrar início da infusão'}</button><Info label="Estado" value={state.infusionActive ? 'Evento registrado no diário.' : 'Nenhum evento de infusão registrado.'} /></div> }
function LogPanel({ state }: { state: GameState }) { return <div className="panel-content log-list">{[...state.actionLog].reverse().map((item, index) => <div className={`log-item ${item.tone}`} key={`${item.at}-${index}`}><time>{asTime(item.at)}</time><div><b>{item.code.replaceAll('_', ' ')}</b><span>{item.outcome}</span></div></div>)}</div> }
function FinishPanel({ initialDestination, transitForDestination, onFinish }: { initialDestination: Destination; transitForDestination: (destination: Destination) => number; onFinish: (destination: Destination, hypothesis: string, rationale: string) => void }) { const [destination, setDestination] = useState<Destination>(initialDestination); const [hypothesis, setHypothesis] = useState(''); const [rationale, setRationale] = useState(''); return <form className="panel-content finish" onSubmit={(event) => { event.preventDefault(); onFinish(destination, hypothesis, rationale) }}><p className="helper">Registre sua leitura final. A nota será calculada somente depois de encerrar o cenário.</p><label>Destino<select value={destination} onChange={(event) => setDestination(event.target.value as Destination)}>{(Object.keys(destinationLabel) as Destination[]).map((item) => <option value={item} key={item}>{destinationLabel[item]}</option>)}</select></label><Info label="Deslocamento ficcional" value={destination === 'discharge' ? 'Sem deslocamento de frota.' : `${asTime(transitForDestination(destination))} estimados pela garagem virtual.`} /><label>Diagnóstico final do cenário<input required minLength={3} placeholder="Descreva a hipótese final da missão" value={hypothesis} onChange={(event) => setHypothesis(event.target.value)} /></label><label>Justificativa<textarea required rows={3} placeholder="Registre os achados que sustentam a decisão" value={rationale} onChange={(event) => setRationale(event.target.value)} /></label><button className="primary full" type="submit">Encerrar cenário e gerar relatório →</button></form> }
function Step({ label, done, danger, onClick }: { label: string; done?: boolean; danger?: boolean; onClick: () => void }) { return <button className={`step ${done ? 'done' : ''} ${danger ? 'danger' : ''}`} onClick={onClick}>{done ? '✓ ' : ''}{label}</button> }
function Info({ label, value }: { label: string; value: string }) { return <div className="info"><span>{label}</span><p>{value}</p></div> }
function Tool({ label, icon, active, color, onClick }: { label: string; icon: string; active?: boolean; color?: string; onClick: () => void }) { return <button title={label} aria-label={label} aria-pressed={active} className={`tool ${active ? 'active' : ''} ${color ?? ''}`} onClick={onClick}><span>{icon}</span><small>{label}</small></button> }
function Report({ state, scenario, report, reward, narrativeEvent, seasonClosing, onDismissNarrative, onDismissSeason, onRetry, onNew, onHome }: { state: GameState; scenario: (typeof CASES)[CaseId]; report: ScoreReport; reward: CareerReward | null; narrativeEvent: CareerNarrativeEvent | null; seasonClosing: CareerSeason | null; onDismissNarrative: () => void; onDismissSeason: () => void; onRetry: () => void; onNew: () => void; onHome: () => void }) {
  const variant = missionVariantById(state.missionVariantId)
  const profile = reward?.profile
  const upcomingSeason = profile ? seasonFor(profile.missionsCompleted) : null
  const upcomingRank = profile ? nextRankFor(profile.xp) : null
  return <main className="report-screen"><section className="report-card">
    <header><div><p className="eyebrow">RELATÓRIO LOCAL · {scenario.id} · {variant.title.toUpperCase()}</p><h1>{scenario.title}</h1><p>{report.verdict}</p><small className="report-transit">{report.transportSeconds ? `Deslocamento ficcional: ${asTime(report.transportSeconds)}` : 'Sem deslocamento de frota'}</small></div><div className="score"><strong>{report.score}</strong><span>/ 1000</span><small>+{report.xp} XP</small></div></header>
    {reward && <div className="mission-reward"><span>RECOMPENSA DA MISSÃO</span><b>+{reward.xpEarned} XP · +{reward.creditsEarned} créditos</b><small>{reward.contextBonus ? `Contexto da ocorrência: +${reward.contextBonus} créditos. ` : ''}{reward.streakBonus ? `Sequência de plantão: +${reward.streakBonus} créditos antes dos multiplicadores. ` : ''}{reward.promoted ? `Promoção desbloqueada: ${rankFor(reward.profile.xp).name}.` : `Carreira: ${rankFor(reward.profile.xp).name}.`}</small></div>}
    {reward?.milestoneRewards.length ? <section className="milestone-reward" aria-label="Marcos desbloqueados"><span>MARCO(S) DESBLOQUEADO(S)</span><div>{reward.milestoneRewards.map((milestone) => <article key={milestone.id}><b>{milestone.icon} {milestone.name}</b><small>+◈ {milestone.creditReward} créditos · {milestone.description}</small></article>)}</div></section> : null}
    {reward?.operationReward ? <section className="operation-reward" aria-label="Operação especial concluída"><span>{reward.operationReward.dispatchTag}</span><b>{reward.operationReward.icon} {reward.operationReward.name} concluída</b><small>+◈ {reward.operationReward.creditReward} créditos de carreira · {reward.operationReward.description}</small></section> : null}
    {profile && upcomingSeason && <section className="campaign-continuity" aria-label="Continuidade da campanha"><span>CONTINUIDADE DA CAMPANHA</span><b>{upcomingSeason.icon} {upcomingSeason.code} · {upcomingSeason.name}</b><p>A próxima ocorrência será atribuída pela Central para a missão {profile.missionsCompleted + 1}. Sua patente, créditos, garagem e histórico seguem com a Unidade 07.</p><small>{profile.missionsCompleted} missão(ões) arquivada(s) · {upcomingRank ? `${Math.max(0, upcomingRank.minXp - profile.xp)} XP para ${upcomingRank.name}` : 'patente máxima alcançada'}</small></section>}
    <div className="score-bars">{report.dimensions.map((item) => <div key={item.label}><span>{item.label}<b>{item.value}/{item.max}</b></span><i><em style={{ width: `${(item.value / item.max) * 100}%` }} /></i></div>)}</div>
    <div className="report-columns"><section><h2>Leitura do cenário</h2><p>{scenario.summary}</p><ul>{report.notes.map((note) => <li key={note}>{note}</li>)}</ul></section><section><h2>Linha do tempo</h2><div className="report-log">{state.actionLog.slice(-8).map((item, index) => <p key={`${item.code}-${index}`}><time>{asTime(item.at)}</time>{item.outcome}</p>)}</div></section></div>
    <footer><button onClick={onHome}>Voltar à Central</button><button onClick={onRetry}>Reiniciar mesma seed</button><button className="primary" onClick={onNew}>Continuar campanha</button></footer><p className="report-disclaimer">Resultado de jogo simulado; não representa avaliação, diagnóstico ou conduta médica real.</p>
  </section>{seasonClosing ? <SeasonClosingSequence season={seasonClosing} onClose={onDismissSeason} /> : narrativeEvent && <NarrativeTransmission event={narrativeEvent} onClose={onDismissNarrative} />}</main>
}
function NarrativeTransmission({ event, onClose }: { event: CareerNarrativeEvent; onClose: () => void }) { return <section className="narrative-overlay" role="dialog" aria-modal="true" aria-label="Transmissão da Central"><div className="narrative-card"><div className="narrative-scan" aria-hidden="true"><i /><i /><i /></div><span>{event.icon} {event.channel}</span><h2>{event.title}</h2><p>{event.body}</p><small>{event.signoff}</small><button className="primary" onClick={onClose}>Arquivar transmissão</button><em>EVENTO FICCIONAL DE CARREIRA · SEM IMPACTO FORA DO JOGO</em></div></section> }
function SeasonClosingSequence({ season, onClose }: { season: CareerSeason; onClose: () => void }) { return <section className="season-closing-overlay" role="dialog" aria-modal="true" aria-label="Temporada concluída"><div className="season-closing-card"><div className="season-closing-rings" aria-hidden="true"><i /><i /><i /></div><span>{season.icon} {season.code} · ARQUIVO ENCERRADO</span><h2>{season.closureTitle ?? `${season.name} concluída`}</h2><p>{season.closureBody ?? 'A Central atualizou a rota da Unidade 07 para o próximo ciclo ficcional.'}</p><small>PRÓXIMA ROTA DISPONÍVEL NA CENTRAL</small><button className="primary" onClick={onClose}>Abrir próxima temporada</button><em>CENA DE CARREIRA FICCIONAL · SEM IMPACTO FORA DO JOGO</em></div></section> }
function playSceneAmbience(theme: SceneTheme, volume: number) {
  if (!volume || typeof window === 'undefined' || !window.AudioContext) return
  try {
    const context = new AudioContext()
    const tones: Record<SceneTheme, readonly [number, number]> = { rain: [74, 148], crowd: [92, 184], industrial: [58, 116], quiet: [72, 144], market: [108, 216], road: [64, 128], school: [86, 172], festival: [112, 224], blackout: [52, 104], dawn: [96, 192], warehouse: [61, 122], hillside: [67, 134], metro: [70, 140], heatwave: [84, 168], harbor: [56, 112], suburb: [76, 152], tunnel: [48, 96], park: [88, 176] }
    const [baseFrequency, detailFrequency] = tones[theme]
    const master = context.createGain()
    const base = context.createOscillator()
    const detail = context.createOscillator()
    const filter = context.createBiquadFilter()
    master.gain.value = Math.min(volume / 100 * 0.018, 0.018)
    filter.type = 'lowpass'
    filter.frequency.value = theme === 'rain' || theme === 'harbor' ? 420 : 620
    base.type = 'sine'
    detail.type = theme === 'industrial' || theme === 'tunnel' ? 'triangle' : 'sine'
    base.frequency.value = baseFrequency
    detail.frequency.value = detailFrequency
    detail.detune.value = -7
    base.connect(filter); detail.connect(filter); filter.connect(master); master.connect(context.destination)
    base.start(); detail.start(); void context.resume().catch(() => undefined)
    return () => { master.gain.setTargetAtTime(0.0001, context.currentTime, .05); window.setTimeout(() => { try { base.stop(); detail.stop(); void context.close() } catch { /* Audio nodes may already be closed. */ } }, 130) }
  } catch { return }
}
type SoundCue = 'feedback' | 'scan' | 'tool' | 'medication' | 'defib' | 'ventilation' | 'infusion' | 'compression' | 'report'
function playActionCue(cue: SoundCue, outcome: LogEntry['tone'], volume: number) {
  if (!volume || typeof window === 'undefined' || !window.AudioContext) return
  try {
    const context = new AudioContext()
    const notes: Record<SoundCue, readonly number[]> = { feedback: [330], scan: [420, 610], tool: [250, 310], medication: [360, 510], defib: [190, 130], ventilation: [260, 340], infusion: [310, 430], compression: [118], report: [420, 590, 740] }
    const modifier = outcome === 'danger' ? .72 : outcome === 'warning' ? .86 : outcome === 'success' ? 1.08 : 1
    const master = context.createGain()
    master.gain.value = Math.min(volume / 100 * .05, .05)
    master.connect(context.destination)
    notes[cue].forEach((note, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const start = context.currentTime + index * .075
      oscillator.type = cue === 'compression' || cue === 'defib' ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(note * modifier, start)
      if (cue === 'scan') oscillator.frequency.exponentialRampToValueAtTime(note * modifier * 1.12, start + .06)
      gain.gain.setValueAtTime(.0001, start)
      gain.gain.exponentialRampToValueAtTime(1, start + .008)
      gain.gain.exponentialRampToValueAtTime(.0001, start + .065)
      oscillator.connect(gain); gain.connect(master); oscillator.start(start); oscillator.stop(start + .07)
    })
    void context.resume().catch(() => undefined)
    window.setTimeout(() => void context.close(), notes[cue].length * 80 + 160)
  } catch { /* Browsers may deny optional game audio. */ }
}
export default App
