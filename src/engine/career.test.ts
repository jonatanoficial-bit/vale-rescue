import { describe, expect, it } from 'vitest'
import { applyCareerModifiers, awardCareer, createCareerProfile, normalizeCareerProfile, purchaseUpgrade, rankFor, selectCareerCase } from './career'
import { CASE_LIST } from '../content/cases'
import type { ScoreReport } from './types'

const report: ScoreReport = { score: 720, xp: 468, destination: 'hospital', verdict: 'ok', notes: [], dimensions: [] }

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
})
