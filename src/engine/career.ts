import type { CaseDefinition, ScoreReport } from './types'

export type UpgradeId = 'signal_link' | 'scene_console' | 'fleet_clearance' | 'shift_pass' | 'case_library' | 'night_drive'

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
}

export type CareerReward = {
  profile: CareerProfile
  xpEarned: number
  creditsEarned: number
  streakBonus: number
  contextBonus: number
  promoted: boolean
}

export type CareerUpgrade = {
  id: UpgradeId
  name: string
  description: string
  cost: number
  icon: string
  scoreBonus: number
  xpMultiplier: number
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
  { id: 'signal_link', name: 'Link de Sinal', description: '+12% de XP em missões concluídas.', cost: 180, icon: '⌁', scoreBonus: 0, xpMultiplier: 1.12 },
  { id: 'scene_console', name: 'Console de Cena', description: '+30 pontos de carreira no relatório.', cost: 420, icon: '▦', scoreBonus: 30, xpMultiplier: 1 },
  { id: 'fleet_clearance', name: 'Credencial de Frota', description: '+55 pontos de carreira no relatório.', cost: 760, icon: '◆', scoreBonus: 55, xpMultiplier: 1 },
  { id: 'shift_pass', name: 'Passe de Plantão', description: '+25% de créditos ganhos em missões.', cost: 980, icon: '◈', scoreBonus: 0, xpMultiplier: 1 },
  { id: 'case_library', name: 'Arquivo de Casos', description: '+35 pontos de carreira por relatório documentado.', cost: 1180, icon: '▤', scoreBonus: 35, xpMultiplier: 1 },
  { id: 'night_drive', name: 'Direção Noturna', description: '+18% de XP por sequência de plantão.', cost: 1500, icon: '☾', scoreBonus: 0, xpMultiplier: 1.18 },
]

export const createCareerProfile = (): CareerProfile => ({ schemaVersion: 1, xp: 0, credits: 120, missionsCompleted: 0, missionStreak: 0, bestStreak: 0, recentCaseIds: [], upgrades: [], certifications: [] })

export const normalizeCareerProfile = (profile: Partial<CareerProfile> | null): CareerProfile => ({
  ...createCareerProfile(),
  ...profile,
  upgrades: Array.isArray(profile?.upgrades) ? profile.upgrades : [],
  certifications: Array.isArray(profile?.certifications) ? profile.certifications : [],
  recentCaseIds: Array.isArray(profile?.recentCaseIds) ? profile.recentCaseIds.slice(-4) : [],
})

export const rankFor = (xp: number) => [...CAREER_RANKS].reverse().find((rank) => xp >= rank.minXp) ?? CAREER_RANKS[0]

export const nextRankFor = (xp: number) => CAREER_RANKS.find((rank) => rank.minXp > xp) ?? null

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

export const awardCareer = (profile: CareerProfile, report: ScoreReport, caseId: string, contextBonus = 0): CareerReward => {
  const before = rankFor(profile.xp)
  const successful = report.score >= 600
  const missionStreak = successful ? profile.missionStreak + 1 : 0
  const streakBonus = successful ? Math.min(55, missionStreak * 7) : 0
  const passMultiplier = profile.upgrades.includes('shift_pass') ? 1.25 : 1
  const creditsEarned = Math.round(Math.max(25, Math.round(report.score / 12) + Math.floor(report.xp / 180) + streakBonus + contextBonus) * passMultiplier)
  const nextProfile: CareerProfile = { ...profile, xp: profile.xp + report.xp, credits: profile.credits + creditsEarned, missionsCompleted: profile.missionsCompleted + 1, missionStreak, bestStreak: Math.max(profile.bestStreak, missionStreak), recentCaseIds: [...profile.recentCaseIds, caseId].slice(-4) }
  return { profile: nextProfile, xpEarned: report.xp, creditsEarned, streakBonus, contextBonus, promoted: rankFor(nextProfile.xp).name !== before.name }
}

export const purchaseUpgrade = (profile: CareerProfile, upgradeId: UpgradeId): CareerProfile | null => {
  const upgrade = CAREER_UPGRADES.find((item) => item.id === upgradeId)
  if (!upgrade || profile.upgrades.includes(upgradeId) || profile.credits < upgrade.cost) return null
  return { ...profile, credits: profile.credits - upgrade.cost, upgrades: [...profile.upgrades, upgradeId] }
}
