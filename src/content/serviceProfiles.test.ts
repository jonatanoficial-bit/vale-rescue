import { describe, expect, it } from 'vitest'
import { SERVICE_PROFILES, serviceProfileFor } from './serviceProfiles'

describe('service profiles', () => {
  it('keeps a stable starter contract and unlock progression', () => {
    expect(SERVICE_PROFILES.map((profile) => profile.id)).toEqual(['samu_usb', 'samu_usa', 'paramedic_response'])
    expect(serviceProfileFor('samu_usb').medications).toContain('glucose-gel')
    expect(serviceProfileFor('paramedic_response').unlockXp).toBeGreaterThan(serviceProfileFor('samu_usa').unlockXp)
  })
})
