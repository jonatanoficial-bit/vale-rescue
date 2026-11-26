import type { CaseDefinition, ScoreReport, ServiceProfileId } from './types'
import { serviceProfileFor } from '../content/serviceProfiles'

export type UpgradeId = 'signal_link' | 'scene_console' | 'fleet_clearance' | 'shift_pass' | 'case_library' | 'night_drive'
export type CareerMilestoneId = 'first_route' | 'steady_shift' | 'first_promotion' | 'garage_online' | 'central_veteran'
export type LiveryId = 'vale_standard' | 'nightwatch' | 'gold_signal' | 'central_archive'
export type CareerSeasonId = 'nightshift' | 'crosswind' | 'frontline'
export type CareerOperationId = 'open_frequency' | 'rain_line' | 'signal_crossing' | 'district_watch' | 'network_pulse' | 'last_lantern'
export type CareerNarrativeEventId = 'first_frequency' | 'crosswind_signal' | 'frontline_open'
export type VehicleModelId = 'rescue_van' | 'urban_response' | 'night_runner' | 'command_unit'

export type CareerProfile = {
  schemaVersion: 1
  xp: number
  credits: number
  missionsCompleted: number
  missionStreak: number
  bestStreak: number
  recentCaseIds: string[]
  upgrades: UpgradeId[]
  certifications: string[]
  serviceProfileId: ServiceProfileId
  milestones: CareerMilestoneId[]
  liveryId: LiveryId
  completedOperations: CareerOperationId[]
  seenNarrativeEvents: CareerNarrativeEventId[]
  vehicleModelId: VehicleModelId
}

export type CareerReward = {
  profile: CareerProfile
  xpEarned: number
  creditsEarned: number
  streakBonus: number
  contextBonus: number
  promoted: boolean
  milestoneRewards: CareerMilestone[]
  operationReward?: CareerOperation
  narrativeEvent?: CareerNarrativeEvent
  seasonClosing?: CareerSeason
}

export type CareerUpgrade = {
  id: UpgradeId
  name: string
  description: string
  cost: number
  icon: string
  scoreBonus: number
  xpMultiplier: number
  travelSecondsSaved: number
}

export type CareerMilestone = {
  id: CareerMilestoneId
  name: string
  description: string
  icon: string
  metric: 'missions' | 'streak' | 'xp' | 'upgrades'
  target: number
  creditReward: number
}

export type CareerLivery = {
  id: LiveryId
  name: string
  description: string
  tag: string
  icon: string
  requiredMilestone?: CareerMilestoneId
}

export type CareerVehicle = {
  id: VehicleModelId
  name: string
  description: string
  tag: string
  icon: string
  requiredMilestone?: CareerMilestoneId
  requiredXp?: number
  requiredOperations?: number
}

export type CareerSeason = {
  id: CareerSeasonId
  code: string
  name: string
  description: string
  icon: string
  startMission: number
  endMission?: number
  closureTitle?: string
  closureBody?: string
}

export type CareerOperation = {
  id: CareerOperationId
  seasonId: CareerSeasonId
  name: string
  description: string
  dispatchTag: string
  unlockMission: number
  creditReward: number
  icon: string
}

export type CareerNarrativeEvent = {
  id: CareerNarrativeEventId
  seasonId: CareerSeasonId
  missionThreshold: number
  channel: string
  title: string
  body: string
  signoff: string
  icon: string
}

export const CAREER_RANKS = [
  { name: 'Cadete', minXp: 0 },
  { name: 'Socorrista', minXp: 500 },
  { name: 'Operador de Unidade', minXp: 1400 },
  { name: 'Líder de Plantão', minXp: 3000 },
  { name: 'Veterano da Central', minXp: 5200 },
  { name: 'Coordenador de Área', minXp: 8500 },
  { name: 'Comandante da Central', minXp: 13000 },
  { name: 'Lenda do Vale', minXp: 19000 },
] as const

export const CAREER_UPGRADES: CareerUpgrade[] = [
  { id: 'signal_link', name: 'Link de Sinal', description: '+12% de XP em missões concluídas.', cost: 180, icon: '⌁', scoreBonus: 0, xpMultiplier: 1.12, travelSecondsSaved: 0 },
  { id: 'scene_console', name: 'Console de Cena', description: '+30 pontos de carreira no relatório.', cost: 420, icon: '▦', scoreBonus: 30, xpMultiplier: 1, travelSecondsSaved: 0 },
  { id: 'fleet_clearance', name: 'Credencial de Frota', description: 'Reduz 35 s do deslocamento ficcional ao hospital.', cost: 760, icon: '◆', scoreBonus: 0, xpMultiplier: 1, travelSecondsSaved: 35 },
  { id: 'shift_pass', name: 'Passe de Plantão', description: '+25% de créditos ganhos em missões.', cost: 980, icon: '◈', scoreBonus: 0, xpMultiplier: 1, travelSecondsSaved: 0 },
  { id: 'case_library', name: 'Arquivo de Casos', description: '+35 pontos de carreira por relatório documentado.', cost: 1180, icon: '▤', scoreBonus: 35, xpMultiplier: 1, travelSecondsSaved: 0 },
  { id: 'night_drive', name: 'Direção Noturna', description: '+18% de XP e reduz 20 s do deslocamento ficcional.', cost: 1500, icon: '☾', scoreBonus: 0, xpMultiplier: 1.18, travelSecondsSaved: 20 },
]

export const CAREER_MILESTONES: readonly CareerMilestone[] = [
  { id: 'first_route', name: 'Rota inaugurada', description: 'Conclua 3 missões na Central.', icon: '◈', metric: 'missions', target: 3, creditReward: 90 },
  { id: 'steady_shift', name: 'Plantão consistente', description: 'Alcance uma sequência de 3 missões bem avaliadas.', icon: '⌁', metric: 'streak', target: 3, creditReward: 140 },
  { id: 'first_promotion', name: 'Primeira promoção', description: 'Chegue a 500 XP totais.', icon: '✦', metric: 'xp', target: 500, creditReward: 180 },
  { id: 'garage_online', name: 'Garagem ativa', description: 'Instale a primeira melhoria da unidade.', icon: '◆', metric: 'upgrades', target: 1, creditReward: 120 },
  { id: 'central_veteran', name: 'Arquivo da Central', description: 'Conclua 12 missões.', icon: '▦', metric: 'missions', target: 12, creditReward: 320 },
]

export const CAREER_LIVERIES: readonly CareerLivery[] = [
  { id: 'vale_standard', name: 'Vale padrão', description: 'Acabamento original da Unidade 07.', tag: 'BASE', icon: '▣' },
  { id: 'nightwatch', name: 'Nightwatch', description: 'Acentos de patrulha noturna para a Central.', tag: 'ROTA INAUGURADA', icon: '☾', requiredMilestone: 'first_route' },
  { id: 'gold_signal', name: 'Sinal dourado', description: 'Detalhes de comando para a primeira promoção.', tag: 'PROMOÇÃO', icon: '✦', requiredMilestone: 'first_promotion' },
  { id: 'central_archive', name: 'Arquivo Central', description: 'Identidade de veterania da Central.', tag: 'VETERANIA', icon: '▦', requiredMilestone: 'central_veteran' },
]

export const CAREER_VEHICLES: readonly CareerVehicle[] = [
  { id: 'rescue_van', name: 'Rescue Van 07', description: 'Modelo-base da Central, com interior clássico da Unidade 07.', tag: 'BASE', icon: '▣' },
  { id: 'urban_response', name: 'Urban Response', description: 'Cabine urbana com acentos de sinal e console compacto.', tag: 'ROTA INAUGURADA', icon: '◫', requiredMilestone: 'first_route' },
  { id: 'night_runner', name: 'Night Runner', description: 'Configuração visual de patrulha com iluminação noturna reforçada.', tag: '2 OPERAÇÕES', icon: '☾', requiredOperations: 2 },
  { id: 'command_unit', name: 'Command Unit', description: 'Acabamento de comando para plantões de carreira avançada.', tag: '3000 XP', icon: '◆', requiredXp: 3000 },
]

export const CAREER_SEASONS: readonly CareerSeason[] = [
  { id: 'nightshift', code: 'TEMPORADA 01', name: 'Plantão Noturno', description: 'A Central abre a primeira rota e atribui operações de estreia.', icon: '☾', startMission: 0, endMission: 9, closureTitle: 'As luzes permanecem acesas', closureBody: 'Dez plantões foram arquivados. A Unidade 07 deixa a primeira rota e a Central libera os setores de Sinais Cruzados.' },
  { id: 'crosswind', code: 'TEMPORADA 02', name: 'Sinais Cruzados', description: 'Novos bairros, contextos variados e operações de rede.', icon: '⌁', startMission: 10, endMission: 24, closureTitle: 'A malha mudou de ritmo', closureBody: 'A rota foi consolidada em diferentes setores. A Central abre a Linha de Frente para os próximos plantões.' },
  { id: 'frontline', code: 'TEMPORADA 03', name: 'Linha de Frente', description: 'A carreira entra em rodízio avançado com chamadas especiais contínuas.', icon: '✦', startMission: 25 },
]

export const CAREER_OPERATIONS: readonly CareerOperation[] = [
  { id: 'open_frequency', seasonId: 'nightshift', name: 'Frequência Aberta', description: 'Uma chamada de estreia atravessa a malha noturna da Central.', dispatchTag: 'OPERAÇÃO ESPECIAL', unlockMission: 0, creditReward: 85, icon: '◈' },
  { id: 'rain_line', seasonId: 'nightshift', name: 'Linha de Chuva', description: 'A unidade é redirecionada durante uma sequência de chamados sob chuva.', dispatchTag: 'OPERAÇÃO ESPECIAL', unlockMission: 5, creditReward: 120, icon: '☂' },
  { id: 'signal_crossing', seasonId: 'crosswind', name: 'Cruzamento de Sinal', description: 'A Central conecta relatos de setores diferentes em uma mesma janela.', dispatchTag: 'OPERAÇÃO ESPECIAL', unlockMission: 10, creditReward: 145, icon: '⌁' },
  { id: 'district_watch', seasonId: 'crosswind', name: 'Vigília de Distrito', description: 'Uma unidade cobre o setor enquanto a cidade muda de ritmo.', dispatchTag: 'OPERAÇÃO ESPECIAL', unlockMission: 17, creditReward: 170, icon: '◌' },
  { id: 'network_pulse', seasonId: 'frontline', name: 'Pulso da Rede', description: 'A rota mistura contextos e mantém a Central em alerta prolongado.', dispatchTag: 'OPERAÇÃO ESPECIAL', unlockMission: 25, creditReward: 210, icon: 'ϟ' },
  { id: 'last_lantern', seasonId: 'frontline', name: 'Última Lanterna', description: 'Uma chamada especial fecha o turno com visibilidade reduzida.', dispatchTag: 'OPERAÇÃO ESPECIAL', unlockMission: 34, creditReward: 260, icon: '✦' },
]

export const CAREER_NARRATIVE_EVENTS: readonly CareerNarrativeEvent[] = [
  { id: 'first_frequency', seasonId: 'nightshift', missionThreshold: 1, channel: 'TRANSMISSÃO 01', title: 'A cidade acendeu', body: 'A primeira ocorrência foi arquivada. A Central abre o turno noturno e novas rotas começam a aparecer no mapa fictício da Unidade 07.', signoff: 'CENTRAL · MANTENHA O CANAL ABERTO', icon: '☾' },
  { id: 'crosswind_signal', seasonId: 'crosswind', missionThreshold: 11, channel: 'TRANSMISSÃO 02', title: 'Sinais cruzados', body: 'O plantão ganhou novos setores. Chamadas chegam de contextos diferentes e a carreira entra na segunda temporada da Central.', signoff: 'CENTRAL · NOVA MALHA DISPONÍVEL', icon: '⌁' },
  { id: 'frontline_open', seasonId: 'frontline', missionThreshold: 26, channel: 'TRANSMISSÃO 03', title: 'Linha de frente', body: 'A Unidade 07 passa a cobrir uma rota contínua. Operações especiais podem atravessar cenários e temporadas durante o turno.', signoff: 'CENTRAL · ROTA CONTÍNUA AUTORIZADA', icon: '✦' },
]

export const createCareerProfile = (): CareerProfile => ({ schemaVersion: 1, xp: 0, credits: 120, missionsCompleted: 0, missionStreak: 0, bestStreak: 0, recentCaseIds: [], upgrades: [], certifications: [], serviceProfileId: 'samu_usb', milestones: [], liveryId: 'vale_standard', completedOperations: [], seenNarrativeEvents: [], vehicleModelId: 'rescue_van' })

export const normalizeCareerProfile = (profile: Partial<CareerProfile> | null): CareerProfile => ({
  ...createCareerProfile(),
  ...profile,
  upgrades: Array.isArray(profile?.upgrades) ? profile.upgrades : [],
  certifications: Array.isArray(profile?.certifications) ? profile.certifications : [],
  recentCaseIds: Array.isArray(profile?.recentCaseIds) ? profile.recentCaseIds.slice(-4) : [],
  milestones: Array.isArray(profile?.milestones) ? profile.milestones.filter((id) => CAREER_MILESTONES.some((milestone) => milestone.id === id)) : [],
  completedOperations: Array.isArray(profile?.completedOperations) ? profile.completedOperations.filter((id): id is CareerOperationId => CAREER_OPERATIONS.some((operation) => operation.id === id)) : [],
  seenNarrativeEvents: Array.isArray(profile?.seenNarrativeEvents) ? profile.seenNarrativeEvents.filter((id): id is CareerNarrativeEventId => CAREER_NARRATIVE_EVENTS.some((event) => event.id === id)) : [],
  liveryId: profile?.liveryId === 'nightwatch' || profile?.liveryId === 'gold_signal' || profile?.liveryId === 'central_archive' || profile?.liveryId === 'vale_standard' ? profile.liveryId : 'vale_standard',
  vehicleModelId: profile?.vehicleModelId === 'urban_response' || profile?.vehicleModelId === 'night_runner' || profile?.vehicleModelId === 'command_unit' || profile?.vehicleModelId === 'rescue_van' ? profile.vehicleModelId : 'rescue_van',
  serviceProfileId: profile?.serviceProfileId === 'samu_usa' || profile?.serviceProfileId === 'paramedic_response' || profile?.serviceProfileId === 'samu_usb' ? profile.serviceProfileId : 'samu_usb',
})

export const rankFor = (xp: number) => [...CAREER_RANKS].reverse().find((rank) => xp >= rank.minXp) ?? CAREER_RANKS[0]

export const nextRankFor = (xp: number) => CAREER_RANKS.find((rank) => rank.minXp > xp) ?? null

export const milestoneProgress = (profile: CareerProfile, milestone: CareerMilestone): number => {
  if (milestone.metric === 'missions') return profile.missionsCompleted
  if (milestone.metric === 'streak') return profile.missionStreak
  if (milestone.metric === 'xp') return profile.xp
  return profile.upgrades.length
}

export const liveryFor = (id: LiveryId) => CAREER_LIVERIES.find((livery) => livery.id === id) ?? CAREER_LIVERIES[0]

export const liveryIsUnlocked = (profile: CareerProfile, livery: CareerLivery): boolean => !livery.requiredMilestone || profile.milestones.includes(livery.requiredMilestone)

export const vehicleFor = (id: VehicleModelId) => CAREER_VEHICLES.find((vehicle) => vehicle.id === id) ?? CAREER_VEHICLES[0]

export const vehicleIsUnlocked = (profile: CareerProfile, vehicle: CareerVehicle): boolean => (!vehicle.requiredMilestone || profile.milestones.includes(vehicle.requiredMilestone)) && (!vehicle.requiredXp || profile.xp >= vehicle.requiredXp) && (!vehicle.requiredOperations || profile.completedOperations.length >= vehicle.requiredOperations)

export const seasonFor = (missionsCompleted: number): CareerSeason => CAREER_SEASONS.find((season) => season.endMission === undefined || missionsCompleted <= season.endMission) ?? CAREER_SEASONS[CAREER_SEASONS.length - 1]

export const seasonProgress = (profile: CareerProfile, season = seasonFor(profile.missionsCompleted)) => {
  const target = season.endMission === undefined ? 10 : season.endMission - season.startMission + 1
  return { completed: Math.max(0, profile.missionsCompleted - season.startMission), target }
}

const operationHash = (caseId: string, seed: number) => Math.abs(Math.floor(Math.sin((seed + [...caseId].reduce((total, char) => total + char.charCodeAt(0), 0)) * 17.371) * 9187.17))

export const specialOperationFor = (profile: CareerProfile, caseId: string, seed: number): CareerOperation | null => {
  const season = seasonFor(profile.missionsCompleted)
  const available = CAREER_OPERATIONS.filter((operation) => operation.seasonId === season.id && operation.unlockMission <= profile.missionsCompleted && !profile.completedOperations.includes(operation.id))
  if (!available.length) return null
  const signal = operationHash(caseId, seed)
  return signal % 3 === 0 ? available[signal % available.length] : null
}

const owned = (profile: CareerProfile) => CAREER_UPGRADES.filter((upgrade) => profile.upgrades.includes(upgrade.id))

export const applyCareerModifiers = (report: ScoreReport, profile: CareerProfile): ScoreReport => {
  const upgrades = owned(profile)
  const scoreBonus = upgrades.reduce((total, upgrade) => total + upgrade.scoreBonus, 0)
  const xpMultiplier = upgrades.reduce((total, upgrade) => total * upgrade.xpMultiplier, 1)
  const xpBonus = Math.round(report.xp * (xpMultiplier - 1))
  if (!scoreBonus && !xpBonus) return report
  const appliedScore = Math.min(1000, report.score + scoreBonus)
  return {
    ...report,
    score: appliedScore,
    xp: report.xp + xpBonus,
    dimensions: scoreBonus ? [...report.dimensions, { label: 'Carreira', value: scoreBonus, max: scoreBonus }] : report.dimensions,
    notes: [...report.notes, `Melhorias de carreira aplicadas: ${upgrades.map((upgrade) => upgrade.name).join(', ')}.`],
  }
}

export const selectCareerCase = (available: CaseDefinition[], profile: CareerProfile, random = Math.random): CaseDefinition => {
  const fresh = available.filter((item) => !profile.recentCaseIds.includes(item.id))
  const pool = fresh.length ? fresh : available
  const selected = pool[Math.floor(random() * pool.length)] ?? available[0]
  if (!selected) throw new Error('A carreira precisa de ao menos uma ocorrência disponível.')
  return selected
}

export const dispatchableCases = (available: CaseDefinition[], profile: CareerProfile): CaseDefinition[] => {
  const service = serviceProfileFor(profile.serviceProfileId)
  const compatible = available.filter((scenario) => scenario.interventions.every((item) => service.interventions.includes(item)) && scenario.medications.every((item) => service.medications.includes(item)))
  return compatible.length ? compatible : available
}

export const fictionalTransitSeconds = (destination: ScoreReport['destination'], profile: CareerProfile): number => {
  if (destination === 'discharge') return 0
  const saved = owned(profile).reduce((total, upgrade) => total + upgrade.travelSecondsSaved, 0)
  return Math.max(65, 160 - saved)
}

export const awardCareer = (profile: CareerProfile, report: ScoreReport, caseId: string, contextBonus = 0, operation: CareerOperation | null = null): CareerReward => {
  const before = rankFor(profile.xp)
  const successful = report.score >= 600
  const missionStreak = successful ? profile.missionStreak + 1 : 0
  const streakBonus = successful ? Math.min(55, missionStreak * 7) : 0
  const passMultiplier = profile.upgrades.includes('shift_pass') ? 1.25 : 1
  const baseCredits = Math.round(Math.max(25, Math.round(report.score / 12) + Math.floor(report.xp / 180) + streakBonus + contextBonus) * passMultiplier)
  const operationReward = successful && operation && !profile.completedOperations.includes(operation.id) ? operation : undefined
  const creditsEarned = baseCredits + (operationReward?.creditReward ?? 0)
  const progressedProfile: CareerProfile = { ...profile, xp: profile.xp + report.xp, credits: profile.credits + creditsEarned, missionsCompleted: profile.missionsCompleted + 1, missionStreak, bestStreak: Math.max(profile.bestStreak, missionStreak), recentCaseIds: [...profile.recentCaseIds, caseId].slice(-4), completedOperations: operationReward ? [...profile.completedOperations, operationReward.id] : profile.completedOperations }
  const narrativeEvent = CAREER_NARRATIVE_EVENTS.find((event) => !progressedProfile.seenNarrativeEvents.includes(event.id) && progressedProfile.missionsCompleted >= event.missionThreshold)
  const seasonClosing = CAREER_SEASONS.find((season) => season.endMission !== undefined && progressedProfile.missionsCompleted === season.endMission + 1)
  const milestoneRewards = CAREER_MILESTONES.filter((milestone) => !progressedProfile.milestones.includes(milestone.id) && milestoneProgress(progressedProfile, milestone) >= milestone.target)
  const nextProfile: CareerProfile = { ...progressedProfile, credits: progressedProfile.credits + milestoneRewards.reduce((total, milestone) => total + milestone.creditReward, 0), milestones: [...progressedProfile.milestones, ...milestoneRewards.map((milestone) => milestone.id)], seenNarrativeEvents: narrativeEvent ? [...progressedProfile.seenNarrativeEvents, narrativeEvent.id] : progressedProfile.seenNarrativeEvents }
  return { profile: nextProfile, xpEarned: report.xp, creditsEarned, streakBonus, contextBonus, promoted: rankFor(nextProfile.xp).name !== before.name, milestoneRewards, operationReward, narrativeEvent, seasonClosing }
}

export const purchaseUpgrade = (profile: CareerProfile, upgradeId: UpgradeId): CareerProfile | null => {
  const upgrade = CAREER_UPGRADES.find((item) => item.id === upgradeId)
  if (!upgrade || profile.upgrades.includes(upgradeId) || profile.credits < upgrade.cost) return null
  return { ...profile, credits: profile.credits - upgrade.cost, upgrades: [...profile.upgrades, upgradeId] }
}
