import type { CaseId } from '../engine/types'

export type MissionVariant = {
  id: string
  title: string
  location: string
  atmosphere: string
  dispatchTag: string
  complication: string
  creditBonus: number
}

export const MISSION_VARIANTS: MissionVariant[] = [
  { id: 'night-rain', title: 'Chuva no plantão', location: 'Corredor urbano molhado', atmosphere: 'Reflexos de sirene e baixa visibilidade', dispatchTag: 'PRIORIDADE DE DESLOCAMENTO', complication: 'Acesso ao local demora mais que o esperado.', creditBonus: 12 },
  { id: 'stadium-exit', title: 'Saída do estádio', location: 'Fluxo intenso de pedestres', atmosphere: 'Ruído, luzes e movimento constante', dispatchTag: 'MULTIDÃO NO LOCAL', complication: 'O acompanhante fornece dados incompletos.', creditBonus: 10 },
  { id: 'industrial-shift', title: 'Troca de turno', location: 'Entorno industrial', atmosphere: 'Iluminação dura e sirenes ao fundo', dispatchTag: 'ÁREA OPERACIONAL', complication: 'A comunicação com a Central oscila no cenário.', creditBonus: 14 },
  { id: 'apartment-quiet', title: 'Apartamento silencioso', location: 'Prédio residencial', atmosphere: 'Cena fechada e poucas informações', dispatchTag: 'ACESSO RESTRITO', complication: 'Histórico depende de um único acompanhante.', creditBonus: 9 },
  { id: 'market-rush', title: 'Horário de pico', location: 'Comércio movimentado', atmosphere: 'Luzes fortes e público curioso', dispatchTag: 'CENA EXPOSTA', complication: 'Organizar o espaço faz parte do desafio de missão.', creditBonus: 11 },
  { id: 'highway-stop', title: 'Parada na rodovia', location: 'Acostamento controlado', atmosphere: 'Vento, tráfego e iluminação irregular', dispatchTag: 'RISCO AMBIENTAL', complication: 'A missão exige registro rápido antes do transporte.', creditBonus: 15 },
  { id: 'school-evening', title: 'Fim de aula', location: 'Pátio escolar', atmosphere: 'Equipe local tentando ajudar', dispatchTag: 'EQUIPE DE APOIO', complication: 'Relatos chegam de várias pessoas ao mesmo tempo.', creditBonus: 10 },
  { id: 'community-event', title: 'Evento comunitário', location: 'Praça iluminada', atmosphere: 'Música distante e estrutura improvisada', dispatchTag: 'REDE LOCAL', complication: 'O cenário traz informações contraditórias.', creditBonus: 11 },
  { id: 'storm-outage', title: 'Queda de energia', location: 'Bairro com iluminação parcial', atmosphere: 'Lanternas e chuva fraca', dispatchTag: 'VISIBILIDADE REDUZIDA', complication: 'O tempo de cena pesa mais na avaliação.', creditBonus: 16 },
  { id: 'morning-commute', title: 'Primeira chamada', location: 'Terminal de transporte', atmosphere: 'Movimento acelerado ao amanhecer', dispatchTag: 'JANELA CURTA', complication: 'A pessoa que chamou precisa sair antes do fim da missão.', creditBonus: 9 },
  { id: 'warehouse-dock', title: 'Doca de carga', location: 'Galpão logístico', atmosphere: 'Máquinas desligadas e eco metálico', dispatchTag: 'LOCAL AMPLO', complication: 'É necessário confirmar o dado do cenário antes da ação.', creditBonus: 13 },
  { id: 'rainy-hillside', title: 'Subida sob chuva', location: 'Rua íngreme', atmosphere: 'Asfalto escorregadio e sinal fraco', dispatchTag: 'DESLOCAMENTO DIFÍCIL', complication: 'A Central exige uma justificativa de destino mais completa.', creditBonus: 15 },
]

const hash = (caseId: CaseId, seed: number) => {
  const chars = [...caseId].reduce((total, char) => total + char.charCodeAt(0), 0)
  return Math.abs(Math.floor(Math.sin((seed + chars) * 12.9898) * 43758.5453))
}

export const missionVariantFor = (caseId: CaseId, seed: number) => MISSION_VARIANTS[hash(caseId, seed) % MISSION_VARIANTS.length]

export const missionVariantById = (id: string | undefined) => MISSION_VARIANTS.find((variant) => variant.id === id) ?? MISSION_VARIANTS[0]
