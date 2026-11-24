import { describe, expect, it } from 'vitest'
import { applyCareerModifiers, awardCareer, CAREER_MILESTONES, createCareerProfile, dispatchableCases, fictionalTransitSeconds, milestoneProgress, normalizeCareerProfile, purchaseUpgrade, rankFor, selectCareerCase } from './career'
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
    expect(normalizeCareerProfile({ serviceProfileId: 'paramedic_response' }).serviceProfileId).toBe('paramedic_response')
    expect(normalizeCareerProfile({ serviceProfileId: 'unsupported' as never }).serviceProfileId).toBe('samu_usb')
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
})
