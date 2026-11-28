import { describe, expect, it } from 'vitest'
import { applyCareerModifiers, awardCareer, CAREER_LIVERIES, CAREER_MILESTONES, CAREER_OPERATIONS, CAREER_VEHICLES, createCareerProfile, dispatchableCases, fictionalTransitSeconds, liveryIsUnlocked, milestoneProgress, normalizeCareerProfile, purchaseUpgrade, rankFor, seasonFor, seasonProgress, selectCareerCase, specialOperationFor, vehicleIsUnlocked } from './career'
import { CASE_LIST } from '../content/cases'
import type { ScoreReport } from './types'

const report: ScoreReport = { score: 720, xp: 468, destination: 'hospital', transportSeconds: 160, verdict: 'ok', notes: [], dimensions: [] }

describe('career progression', () => {
  it('purchases an upgrade only when enough credits are available', () => {
    const profile = createCareerProfile()
    expect(purchaseUpgrade(profile, 'scene_console')).toBeNull()
    const upgraded = purchaseUpgrade({ ...profile, credits: 500 }, 'scene_console')
    expect(upgraded?.credits).toBe(80)
    expect(upgraded?.upgrades).toContain('scene_console')
  })

  it('applies acquired upgrade rewards and grants mission progress', () => {
    const profile = createCareerProfile()
    profile.upgrades.push('signal_link', 'scene_console')
    const modified = applyCareerModifiers(report, profile)
    const reward = awardCareer(profile, modified, 'CASE-001')
    expect(modified.score).toBe(750)
    expect(modified.xp).toBeGreaterThan(report.xp)
    expect(reward.profile.missionsCompleted).toBe(1)
    expect(reward.profile.credits).toBeGreaterThan(profile.credits)
    expect(reward.profile.missionStreak).toBe(1)
    expect(reward.profile.recentCaseIds).toEqual(['CASE-001'])
  })

  it('promotes from cumulative XP thresholds', () => {
    expect(rankFor(0).name).toBe('Cadete')
    expect(rankFor(1500).name).toBe('Operador de Unidade')
  })

  it('avoids recently completed case cores when alternatives exist', () => {
    const profile = { ...createCareerProfile(), recentCaseIds: ['CASE-001', 'CASE-003', 'CASE-004', 'CASE-011'] }
    const selected = selectCareerCase(CASE_LIST, profile, () => 0)
    expect(profile.recentCaseIds).not.toContain(selected.id)
  })

  it('starts and migrates careers with a valid service contract', () => {
    expect(createCareerProfile().serviceProfileId).toBe('samu_usb')
    expect(createCareerProfile().liveryId).toBe('vale_standard')
    expect(createCareerProfile().vehicleModelId).toBe('rescue_van')
    expect(createCareerProfile().completedOperations).toEqual([])
    expect(createCareerProfile().seenNarrativeEvents).toEqual([])
    expect(normalizeCareerProfile({ serviceProfileId: 'paramedic_response' }).serviceProfileId).toBe('paramedic_response')
    expect(normalizeCareerProfile({ serviceProfileId: 'unsupported' as never }).serviceProfileId).toBe('samu_usb')
    expect(normalizeCareerProfile({ liveryId: 'nightwatch' }).liveryId).toBe('nightwatch')
    expect(normalizeCareerProfile({ liveryId: 'signal_route' }).liveryId).toBe('signal_route')
    expect(normalizeCareerProfile({ vehicleModelId: 'night_runner' }).vehicleModelId).toBe('night_runner')
  })

  it('dispatches only scenarios compatible with the chosen virtual unit', () => {
    const starter = { ...createCareerProfile(), xp: 1000 }
    const candidates = CASE_LIST.filter((item) => item.id === 'CASE-023' || item.id === 'CASE-024')
    expect(dispatchableCases(candidates, starter).map((item) => item.id)).toEqual(['CASE-023'])
    expect(dispatchableCases(candidates, { ...starter, serviceProfileId: 'samu_usa' }).map((item) => item.id)).toEqual(['CASE-023', 'CASE-024'])
  })

  it('turns fleet purchases into shorter fictional travel', () => {
    const profile = createCareerProfile()
    expect(fictionalTransitSeconds('hospital', profile)).toBe(160)
    expect(fictionalTransitSeconds('hospital', { ...profile, upgrades: ['fleet_clearance', 'night_drive'] })).toBe(105)
    expect(fictionalTransitSeconds('discharge', profile)).toBe(0)
  })

  it('awards campaign milestones once and persists their credit reward', () => {
    const profile = { ...createCareerProfile(), missionsCompleted: 2, missionStreak: 2, credits: 100 }
    const reward = awardCareer(profile, report, 'CASE-001')
    expect(reward.milestoneRewards.map((milestone) => milestone.id)).toEqual(['first_route', 'steady_shift'])
    expect(reward.profile.milestones).toEqual(['first_route', 'steady_shift'])
    expect(reward.profile.credits).toBeGreaterThan(100 + reward.creditsEarned)
    expect(milestoneProgress(reward.profile, CAREER_MILESTONES[0])).toBe(3)
    expect(awardCareer(reward.profile, report, 'CASE-003').milestoneRewards.map((milestone) => milestone.id)).not.toContain('first_route')
  })

  it('unlocks cosmetic liveries only through their career milestone', () => {
    const profile = createCareerProfile()
    const nightwatch = CAREER_LIVERIES.find((livery) => livery.id === 'nightwatch')
    expect(nightwatch).toBeDefined()
    expect(liveryIsUnlocked(profile, nightwatch!)).toBe(false)
    expect(liveryIsUnlocked({ ...profile, milestones: ['first_route'] }, nightwatch!)).toBe(true)
    const signalRoute = CAREER_LIVERIES.find((livery) => livery.id === 'signal_route')
    expect(liveryIsUnlocked(profile, signalRoute!)).toBe(false)
    expect(liveryIsUnlocked({ ...profile, completedOperations: ['open_frequency'] }, signalRoute!)).toBe(true)
  })

  it('unlocks visual unit models through career-only achievements', () => {
    const profile = createCareerProfile()
    const urban = CAREER_VEHICLES.find((vehicle) => vehicle.id === 'urban_response')
    const night = CAREER_VEHICLES.find((vehicle) => vehicle.id === 'night_runner')
    expect(vehicleIsUnlocked(profile, urban!)).toBe(false)
    expect(vehicleIsUnlocked({ ...profile, milestones: ['first_route'] }, urban!)).toBe(true)
    expect(vehicleIsUnlocked({ ...profile, completedOperations: ['open_frequency', 'rain_line'] }, night!)).toBe(true)
  })

  it('moves the campaign through seasons and assigns special operations without manual selection', () => {
    const profile = createCareerProfile()
    expect(seasonFor(0).name).toBe('Plantão Noturno')
    expect(seasonFor(10).name).toBe('Sinais Cruzados')
    expect(seasonProgress({ ...profile, missionsCompleted: 4 }).completed).toBe(4)
    const assigned = Array.from({ length: 24 }, (_, seed) => specialOperationFor(profile, 'CASE-001', seed)).find(Boolean)
    expect(assigned).toBeDefined()
    expect(assigned?.seasonId).toBe('nightshift')
  })

  it('rewards a well-rated special operation only once', () => {
    const profile = createCareerProfile()
    const operation = CAREER_OPERATIONS[0]
    const reward = awardCareer(profile, report, 'CASE-001', 0, operation)
    expect(reward.operationReward?.id).toBe(operation.id)
    expect(reward.profile.completedOperations).toContain(operation.id)
    expect(reward.creditsEarned).toBeGreaterThan(operation.creditReward)
    expect(awardCareer(reward.profile, report, 'CASE-003', 0, operation).operationReward).toBeUndefined()
  })

  it('records each season transmission once when its mission threshold is crossed', () => {
    const first = awardCareer(createCareerProfile(), report, 'CASE-001')
    expect(first.narrativeEvent?.id).toBe('first_frequency')
    expect(first.profile.seenNarrativeEvents).toContain('first_frequency')
    expect(awardCareer(first.profile, report, 'CASE-003').narrativeEvent).toBeUndefined()
    const crosswindProfile = { ...first.profile, missionsCompleted: 10 }
    expect(awardCareer(crosswindProfile, report, 'CASE-004').narrativeEvent?.id).toBe('crosswind_signal')
  })

  it('closes a season once when the mission threshold is crossed', () => {
    const profile = { ...createCareerProfile(), missionsCompleted: 9 }
    const closing = awardCareer(profile, report, 'CASE-001')
    expect(closing.seasonClosing?.id).toBe('nightshift')
    expect(awardCareer(closing.profile, report, 'CASE-003').seasonClosing).toBeUndefined()
  })
})
