import type { CaseId } from '../engine/types'

export type ProtocolStatus = 'referência vinculada' | 'revisão clínica pendente'

export type ProtocolCard = {
  id: string
  title: string
  scope: string
  jurisdiction: string
  sourceLabel: string
  sourceUrl: string
  sourceVersion: string
  supportingSourceLabel?: string
  supportingSourceUrl?: string
  status: ProtocolStatus
  clinicalApproval: string
  cases: CaseId[]
  gameBoundary: string
}

export const CLINICAL_REFERENCE = {
  label: 'Referência-base do simulador: AHA/ILCOR 2025',
  detail: 'RCP e suporte cardiorrespiratório seguem as diretrizes públicas AHA/ILCOR. Outros quadros exigem fonte temática e validação clínica antes de terem resposta farmacológica modelada.',
  ahaUrl: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines',
  ilcorUrl: 'https://www.ilcor.org/uploads/BLS-2025-COSTR-Full-Chapter.pdf',
}

// A source link does not turn a gameplay rule into a patient-specific medical recommendation.
export const PROTOCOLS: ProtocolCard[] = [
  {
    id: 'adult-cardiac-arrest',
    title: 'Parada cardíaca adulta — referência de roteiro',
    scope: 'Ritmos chocáveis e não chocáveis em suporte avançado; a mecânica de jogo só registra etapas e reavaliação.',
    jurisdiction: 'AHA/ILCOR 2025 · referência internacional; exige adaptação e aprovação do serviço local.',
    sourceLabel: 'American Heart Association — Adult Cardiac Arrest Algorithm (2025)',
    sourceUrl: 'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf',
    sourceVersion: 'AHA 2025',
    supportingSourceLabel: 'ILCOR — Adult Basic Life Support CoSTR (2025)',
    supportingSourceUrl: 'https://www.ilcor.org/uploads/BLS-2025-COSTR-Full-Chapter.pdf',
    status: 'referência vinculada',
    clinicalApproval: 'Nenhuma regra de desfecho individual está aprovada no jogo. Validação por direção médica é obrigatória antes de ativar modelos de fármacos.',
    cases: ['CASE-011'],
    gameBoundary: 'O jogo não converte compressões, choque ou medicamentos em retorno automático de circulação; isso seria uma previsão clínica indevida.',
  },
  {
    id: 'scene-triage',
    title: 'Avaliação e resposta inicial — referência de cenário',
    scope: 'Estrutura de avaliação, comunicação e encaminhamento no contexto pré-hospitalar do jogo.',
    jurisdiction: 'AHA/ILCOR 2025 · base cardiorrespiratória; regras específicas de doença permanecem em revisão.',
    sourceLabel: 'American Heart Association — Adult Basic Life Support (2025)',
    sourceUrl: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support',
    sourceVersion: 'AHA 2025',
    supportingSourceLabel: 'ILCOR — Adult Basic Life Support CoSTR (2025)',
    supportingSourceUrl: 'https://www.ilcor.org/uploads/BLS-2025-COSTR-Full-Chapter.pdf',
    status: 'referência vinculada',
    clinicalApproval: 'AHA/ILCOR não substitui protocolo institucional para cada doença ou medicamento. O jogo não habilita administração clínica real.',
    cases: ['CASE-001', 'CASE-003', 'CASE-004', 'CASE-014', 'CASE-018', 'CASE-019'],
    gameBoundary: 'As consequências exibidas são estados de missão, não prognóstico de uma pessoa ou prescrição.',
  },
  {
    id: 'acute-neurology',
    title: 'Sinais neurológicos súbitos — fluxo de destino',
    scope: 'Reconhecimento, registro do horário referido e comunicação para encaminhamento no cenário.',
    jurisdiction: 'AHA/ILCOR 2025 é referência-base de resposta sistêmica; não é protocolo específico de AVC.',
    sourceLabel: 'American Heart Association — Systems of Care (2025)',
    sourceUrl: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/systems-of-care/',
    sourceVersion: 'AHA 2025 · cobertura específica de AVC pendente de fonte temática aprovada',
    supportingSourceLabel: 'ILCOR — Adult Basic Life Support CoSTR (2025)',
    supportingSourceUrl: 'https://www.ilcor.org/uploads/BLS-2025-COSTR-Full-Chapter.pdf',
    status: 'revisão clínica pendente',
    clinicalApproval: 'Sem motor farmacológico para AVC até que um responsável clínico aprove uma matriz institucional de inclusões, exclusões e monitorização.',
    cases: ['CASE-021'],
    gameBoundary: 'O cenário não diagnostica AVC, não diferencia subtipos e não transforma medicamentos em decisão automática.',
  },
]

export const protocolForCase = (caseId: CaseId) => PROTOCOLS.find((protocol) => protocol.cases.includes(caseId))
