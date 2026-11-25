import type { CaseId } from '../engine/types'

export type SceneTheme = 'rain' | 'crowd' | 'industrial' | 'quiet' | 'market' | 'road' | 'school' | 'festival' | 'blackout' | 'dawn' | 'warehouse' | 'hillside' | 'metro' | 'heatwave' | 'harbor' | 'suburb' | 'tunnel' | 'park'

export type MissionVariant = {
  id: string
  title: string
  location: string
  atmosphere: string
  dispatchTag: string
  complication: string
  creditBonus: number
  visualTheme: SceneTheme
  visualLabel: string
}

export const MISSION_VARIANTS: MissionVariant[] = [
  { id: 'night-rain', title: 'Chuva no plantão', location: 'Corredor urbano molhado', atmosphere: 'Reflexos de sirene e baixa visibilidade', dispatchTag: 'PRIORIDADE DE DESLOCAMENTO', complication: 'Acesso ao local demora mais que o esperado.', creditBonus: 12, visualTheme: 'rain', visualLabel: 'REFLEXOS DE CHUVA' },
  { id: 'stadium-exit', title: 'Saída do estádio', location: 'Fluxo intenso de pedestres', atmosphere: 'Ruído, luzes e movimento constante', dispatchTag: 'MULTIDÃO NO LOCAL', complication: 'O acompanhante fornece dados incompletos.', creditBonus: 10, visualTheme: 'crowd', visualLabel: 'FLUXO DE MULTIDÃO' },
  { id: 'industrial-shift', title: 'Troca de turno', location: 'Entorno industrial', atmosphere: 'Iluminação dura e sirenes ao fundo', dispatchTag: 'ÁREA OPERACIONAL', complication: 'A comunicação com a Central oscila no cenário.', creditBonus: 14, visualTheme: 'industrial', visualLabel: 'LUZ INDUSTRIAL' },
  { id: 'apartment-quiet', title: 'Apartamento silencioso', location: 'Prédio residencial', atmosphere: 'Cena fechada e poucas informações', dispatchTag: 'ACESSO RESTRITO', complication: 'Histórico depende de um único acompanhante.', creditBonus: 9, visualTheme: 'quiet', visualLabel: 'CENA FECHADA' },
  { id: 'market-rush', title: 'Horário de pico', location: 'Comércio movimentado', atmosphere: 'Luzes fortes e público curioso', dispatchTag: 'CENA EXPOSTA', complication: 'Organizar o espaço faz parte do desafio de missão.', creditBonus: 11, visualTheme: 'market', visualLabel: 'NEON COMERCIAL' },
  { id: 'highway-stop', title: 'Parada na rodovia', location: 'Acostamento controlado', atmosphere: 'Vento, tráfego e iluminação irregular', dispatchTag: 'RISCO AMBIENTAL', complication: 'A missão exige registro rápido antes do transporte.', creditBonus: 15, visualTheme: 'road', visualLabel: 'LUZ DE RODOVIA' },
  { id: 'school-evening', title: 'Fim de aula', location: 'Pátio escolar', atmosphere: 'Equipe local tentando ajudar', dispatchTag: 'EQUIPE DE APOIO', complication: 'Relatos chegam de várias pessoas ao mesmo tempo.', creditBonus: 10, visualTheme: 'school', visualLabel: 'PÁTIO ILUMINADO' },
  { id: 'community-event', title: 'Evento comunitário', location: 'Praça iluminada', atmosphere: 'Música distante e estrutura improvisada', dispatchTag: 'REDE LOCAL', complication: 'O cenário traz informações contraditórias.', creditBonus: 11, visualTheme: 'festival', visualLabel: 'LUZES DE PRAÇA' },
  { id: 'storm-outage', title: 'Queda de energia', location: 'Bairro com iluminação parcial', atmosphere: 'Lanternas e chuva fraca', dispatchTag: 'VISIBILIDADE REDUZIDA', complication: 'O tempo de cena pesa mais na avaliação.', creditBonus: 16, visualTheme: 'blackout', visualLabel: 'MODO BAIXA LUZ' },
  { id: 'morning-commute', title: 'Primeira chamada', location: 'Terminal de transporte', atmosphere: 'Movimento acelerado ao amanhecer', dispatchTag: 'JANELA CURTA', complication: 'A pessoa que chamou precisa sair antes do fim da missão.', creditBonus: 9, visualTheme: 'dawn', visualLabel: 'AMANHECER URBANO' },
  { id: 'warehouse-dock', title: 'Doca de carga', location: 'Galpão logístico', atmosphere: 'Máquinas desligadas e eco metálico', dispatchTag: 'LOCAL AMPLO', complication: 'É necessário confirmar o dado do cenário antes da ação.', creditBonus: 13, visualTheme: 'warehouse', visualLabel: 'SOMBRA DE GALPÃO' },
  { id: 'rainy-hillside', title: 'Subida sob chuva', location: 'Rua íngreme', atmosphere: 'Asfalto escorregadio e sinal fraco', dispatchTag: 'DESLOCAMENTO DIFÍCIL', complication: 'A Central exige uma justificativa de destino mais completa.', creditBonus: 15, visualTheme: 'hillside', visualLabel: 'ENCOSTA MOLHADA' },
  { id: 'metro-platform', title: 'Plataforma final', location: 'Terminal subterrâneo', atmosphere: 'Vibração distante e luz fria', dispatchTag: 'ACESSO POR RAMPA', complication: 'O sinal de rádio chega em blocos no cenário.', creditBonus: 14, visualTheme: 'metro', visualLabel: 'LUZ SUBTERRÂNEA' },
  { id: 'summer-block', title: 'Tarde de calor', location: 'Quadra de bairro', atmosphere: 'Sol baixo e asfalto quente', dispatchTag: 'CALOR AMBIENTAL', complication: 'A cena começa com poucas sombras disponíveis.', creditBonus: 12, visualTheme: 'heatwave', visualLabel: 'CALOR DE VERÃO' },
  { id: 'harbor-shift', title: 'Turno do cais', location: 'Porto local', atmosphere: 'Névoa, contêineres e sirene grave', dispatchTag: 'ÁREA PORTUÁRIA', complication: 'O acesso visual ao entorno muda durante a missão.', creditBonus: 15, visualTheme: 'harbor', visualLabel: 'NÉVOA DO CAIS' },
  { id: 'suburb-watch', title: 'Vigília de bairro', location: 'Rua residencial', atmosphere: 'Postes espaçados e casas silenciosas', dispatchTag: 'VIA LOCAL', complication: 'A Central recebe relatos em tempos diferentes.', creditBonus: 10, visualTheme: 'suburb', visualLabel: 'VIGÍLIA NOTURNA' },
  { id: 'tunnel-echo', title: 'Eco no túnel', location: 'Passagem sob viaduto', atmosphere: 'Luzes pulsantes e ruído reverberado', dispatchTag: 'CORREDOR ESTREITO', complication: 'A leitura do ambiente exige atenção extra.', creditBonus: 16, visualTheme: 'tunnel', visualLabel: 'ECO DE TÚNEL' },
  { id: 'park-lanterns', title: 'Lanternas no parque', location: 'Alameda municipal', atmosphere: 'Árvores, lâmpadas suaves e vento', dispatchTag: 'ÁREA ABERTA', complication: 'O ponto exato da ocorrência muda no relato.', creditBonus: 11, visualTheme: 'park', visualLabel: 'LANTERNAS DO PARQUE' },
]

const hash = (caseId: CaseId, seed: number) => {
  const chars = [...caseId].reduce((total, char) => total + char.charCodeAt(0), 0)
  return Math.abs(Math.floor(Math.sin((seed + chars) * 12.9898) * 43758.5453))
}

export const missionVariantFor = (caseId: CaseId, seed: number) => MISSION_VARIANTS[hash(caseId, seed) % MISSION_VARIANTS.length]

export const missionVariantById = (id: string | undefined) => MISSION_VARIANTS.find((variant) => variant.id === id) ?? MISSION_VARIANTS[0]
