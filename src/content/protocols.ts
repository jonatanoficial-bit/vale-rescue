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
  status: ProtocolStatus
  clinicalApproval: string
  cases: CaseId[]
  gameBoundary: string
}

// A source link does not turn a gameplay rule into a patient-specific medical recommendation.
export const PROTOCOLS: ProtocolCard[] = [
  {
    id: 'adult-cardiac-arrest',
    title: 'Parada cardíaca adulta — referência de roteiro',
    scope: 'Ritmos chocáveis e não chocáveis em suporte avançado; a mecânica de jogo só registra etapas e reavaliação.',
    jurisdiction: 'Referência internacional; exige adaptação e aprovação do serviço local.',
    sourceLabel: 'American Heart Association — Adult Cardiac Arrest Algorithm (2025)',
    sourceUrl: 'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf',
    sourceVersion: 'AHA 2025',
    status: 'referência vinculada',
    clinicalApproval: 'Nenhuma regra de desfecho individual está aprovada no jogo. Validação por direção médica é obrigatória antes de ativar modelos de fármacos.',
    cases: ['CASE-011'],
    gameBoundary: 'O jogo não converte compressões, choque ou medicamentos em retorno automático de circulação; isso seria uma previsão clínica indevida.',
  },
  {
    id: 'prehospital-samu',
    title: 'Atendimento pré-hospitalar — referência de serviço',
    scope: 'Estrutura de cenários, avaliação, comunicação e encaminhamento no contexto pré-hospitalar.',
    jurisdiction: 'Brasil · SAMU 192 / SUS',
    sourceLabel: 'Ministério da Saúde — Protocolo de Suporte Avançado de Vida',
    sourceUrl: 'https://www.gov.br/saude/pt-br/composicao/saes/samu-192/publicacoes/protocolo-de-suporte-avancado-de-vida-1.pdf',
    sourceVersion: 'Página atualizada pelo Ministério da Saúde em 2024; conteúdo do protocolo requer verificação do serviço.',
    status: 'referência vinculada',
    clinicalApproval: 'O protocolo local e a regulação médica prevalecem. O jogo não habilita administração clínica real.',
    cases: ['CASE-001', 'CASE-003', 'CASE-004', 'CASE-014', 'CASE-018', 'CASE-019'],
    gameBoundary: 'As consequências exibidas são estados de missão, não prognóstico de uma pessoa ou prescrição.',
  },
  {
    id: 'acute-neurology',
    title: 'Sinais neurológicos súbitos — fluxo de destino',
    scope: 'Reconhecimento, registro do horário referido e comunicação para encaminhamento no cenário.',
    jurisdiction: 'Brasil · linha de cuidado do SUS',
    sourceLabel: 'Ministério da Saúde — Linha de Cuidado do AVC no Adulto',
    sourceUrl: 'https://linhasdecuidado.saude.gov.br/portal/acidente-vascular-cerebral-%28AVC%29-no-adulto/definicao-acidente-vascular-cerebral-%28AVC%29-no-Adulto',
    sourceVersion: 'Consulta em novembro de 2026',
    status: 'referência vinculada',
    clinicalApproval: 'Sem motor farmacológico para AVC até que um responsável clínico aprove uma matriz institucional de inclusões, exclusões e monitorização.',
    cases: ['CASE-021'],
    gameBoundary: 'O cenário não diagnostica AVC, não diferencia subtipos e não transforma medicamentos em decisão automática.',
  },
]

export const protocolForCase = (caseId: CaseId) => PROTOCOLS.find((protocol) => protocol.cases.includes(caseId))
