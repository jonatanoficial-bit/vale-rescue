import type { ServiceProfileId } from '../engine/types'

export type ServiceProfile = {
  id: ServiceProfileId
  name: string
  subtitle: string
  unlockXp: number
  icon: string
  interventions: readonly string[]
  medications: readonly string[]
}

export const SERVICE_PROFILES: readonly ServiceProfile[] = [
  {
    id: 'samu_usb',
    name: 'SAMU · unidade básica',
    subtitle: 'Contrato inicial ficcional · foco em avaliação, suporte e comunicação.',
    unlockXp: 0,
    icon: '▣',
    interventions: ['monitor', 'position', 'oxygen', 'airway', 'control_bleeding', 'iv_access', 'call_support'],
    medications: ['glucose-gel', 'bronchodilator', 'analgesic', 'hydration'],
  },
  {
    id: 'samu_usa',
    name: 'SAMU · unidade avançada',
    subtitle: 'Contrato de progressão ficcional com catálogo ampliado e equipe virtual.',
    unlockXp: 850,
    icon: '✚',
    interventions: ['monitor', 'position', 'oxygen', 'airway', 'control_bleeding', 'iv_access', 'call_support'],
    medications: ['glucose-gel', 'bronchodilator', 'analgesic', 'hydration', 'reversal', 'epinephrine', 'atropine', 'amiodarone', 'magnesium-sulfate', 'dopamine'],
  },
  {
    id: 'paramedic_response',
    name: 'Resposta paramédica',
    subtitle: 'Contrato avançado ficcional; o catálogo nunca substitui regras ou direção médica reais.',
    unlockXp: 2400,
    icon: '◆',
    interventions: ['monitor', 'position', 'oxygen', 'airway', 'control_bleeding', 'iv_access', 'call_support'],
    medications: ['glucose-gel', 'bronchodilator', 'analgesic', 'hydration', 'reversal', 'epinephrine', 'atropine', 'amiodarone', 'ketorolac', 'morphine', 'heparin', 'streptokinase', 'insulin', 'magnesium-sulfate', 'aminophylline', 'etamsylate', 'emoxipine', 'dopamine', 'nitroglycerin', 'activated-charcoal', 'propofol'],
  },
]

export const serviceProfileFor = (id: ServiceProfileId) => SERVICE_PROFILES.find((profile) => profile.id === id) ?? SERVICE_PROFILES[0]
